import { NextResponse } from 'next/server';
import { getSecureAdminClient } from '@/lib/secure-admin-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const { customer_phone, phone } = body;
        const targetPhone = customer_phone || phone;

        // Try to get admin ID from headers (if middleware sets it) or body
        const headersList = request.headers;
        const adminId = headersList.get('x-admin-id') || headersList.get('x-user-id') || body.admin_id || null;

        if (!targetPhone) {
            return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
        }

        const supabase = getSecureAdminClient();

        // 1. Normalize Phone Number
        // Remove all non-digit characters
        const digits = targetPhone.replace(/\D/g, '');

        // Generate potential formats to search
        const phoneCandidates = new Set<string>();
        phoneCandidates.add(targetPhone); // Exact input
        if (digits) phoneCandidates.add(digits); // Plain digits

        // Indian formats
        if (digits.length === 10) {
            phoneCandidates.add(`+91${digits}`);
            phoneCandidates.add(`91${digits}`);
            phoneCandidates.add(`${digits}`);
        } else if (digits.length === 12 && digits.startsWith('91')) {
            phoneCandidates.add(`+${digits}`);
            phoneCandidates.add(digits);
            phoneCandidates.add(digits.slice(2));
        }

        const uniqueCandidates = Array.from(phoneCandidates);

        // 2. PRIMARY LOOKUP: Customers Table
        const { data: matchedCustomers, error: findError } = await supabase
            .from('customers')
            .select('id, phone, name, is_active, login_enabled')
            .in('phone', uniqueCandidates)
            .limit(1);

        if (findError) {
            console.error("[CustomerAccess] Customer Find Error:", findError);
            return NextResponse.json({ error: `Database error: ${findError.message}` }, { status: 500 });
        }

        // 3. SUCCESS PATH
        if (matchedCustomers && matchedCustomers.length > 0) {
            const customer = matchedCustomers[0];

            // Activate
            const { data: updatedCustomer, error: updateError } = await supabase
                .from('customers')
                .update({
                    login_enabled: true,
                    is_active: true,
                    updated_at: new Date().toISOString()
                })
                .eq('id', customer.id)
                .select()
                .single();

            if (updateError) {
                console.error("[CustomerAccess] Activation Error:", updateError);
                return NextResponse.json({ error: "Failed to update customer record" }, { status: 500 });
            }

            // Whitelist
            const { error: whitelistError } = await supabase
                .from('phone_whitelist')
                .upsert({
                    phone: customer.phone,
                    active: true,
                    added_by: adminId,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'phone' });

            if (whitelistError) {
                console.error("[CustomerAccess] Whitelist Error:", whitelistError);
                // Fail hard because login depends on this
                return NextResponse.json({ error: "Failed to whitelist phone number" }, { status: 500 });
            }

            return NextResponse.json({
                success: true,
                message: "Access activated successfully",
                customer: updatedCustomer,
                profile_id: customer.id
            });
        }

        // 4. DIAGNOSTIC LOOKUP: Profiles Table
        // Use this to tell the user WHY it failed if the number exists elsewhere
        const { data: matchedProfiles, error: profileError } = await supabase
            .from('profiles')
            .select('id, phone, full_name, role')
            .in('phone', uniqueCandidates)
            .limit(1);

        if (matchedProfiles && matchedProfiles.length > 0) {
            const profile = matchedProfiles[0];
            const role = profile.role || 'User';

            // Found in profiles but not customers
            return NextResponse.json({
                error: `Phone number exists for ${role} "${profile.full_name}", but no Customer record found. Please create a Customer profile first.`
            }, { status: 404 });
        }

        // 5. TRULY NOT FOUND
        return NextResponse.json({
            error: "Customer not found. Please create customer first."
        }, { status: 404 });

    } catch (err: any) {
        console.error("[CustomerAccess] Unhandled Error:", err);
        return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { getSecureAdminClient } from '@/lib/secure-admin-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    let createdAuthId: string | null = null;
    const supabase = getSecureAdminClient();

    try {
        const body = await request.json().catch(() => ({}));
        const {
            full_name,
            phone,
            password,
            aadhaar_number,
            dob,
            gender,
            residential_address,
            landmark,
            area_branch,
            business_address,
            father_or_spouse_name,
            nominee_name,
            nominee_relationship,
            nominee_age,
            scheme_type,
            scheme_number,
            payment_mode,
            installment_amount,
            scheme_start_date,
            book_number,
            sales_officer_id,
            sales_officer_name,
            notes,
            status = 'active'
        } = body;

        // 1. Basic Validation
        if (!full_name || !phone || !password || !aadhaar_number) {
            return NextResponse.json({ error: "Missing required fields (Name, Phone, Password, Aadhaar)" }, { status: 400 });
        }

        // Normalize Phone (Simple +91 enforcement if missing, though typically frontend handles it)
        const normalizedPhone = phone.replace(/^\+/, ''); // Remove leading + to standardize input for raw check, but we usually want E.164 for Auth
        const e164Phone = phone.startsWith('+') ? phone : `+${phone}`; // Simple assumption, user should provide full code or we normalize strictly. 
        // For Supabase Auth, E.164 is preferred.

        // 2. Check Duplicates in DB first to save Auth call overhead
        const { data: existing } = await supabase
            .from('customers')
            .select('id')
            .or(`phone.eq.${phone},aadhaar_number.eq.${aadhaar_number}`)
            .maybeSingle();

        if (existing) {
            return NextResponse.json({ error: "Customer with this Phone or Aadhaar already exists" }, { status: 409 });
        }

        // 3. Create Supabase Auth User
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            phone: e164Phone,
            password: password,
            email_confirm: true,
            phone_confirm: true,
            user_metadata: {
                full_name: full_name,
                role: 'customer'
            }
        });

        if (authError) {
            console.error("Auth Creation Failed:", authError);
            return NextResponse.json({ error: `Auth Error: ${authError.message}` }, { status: 500 });
        }

        createdAuthId = authData.user.id;

        // 4. Generate Customer Code (Simple logic: CUS-Timestamp-Random or Sequence)
        // Ideally use a DB sequence or function, but for now: CUS-{Random 6 digits}
        const customerCode = `CUS${Math.floor(100000 + Math.random() * 900000)}`;

        // 5. Insert into Customers Table
        const { data: customerData, error: dbError } = await supabase
            .from('customers')
            .insert({
                auth_user_id: createdAuthId,
                customer_code: customerCode,
                full_name,
                phone, // Storing what Admin entered (could be without +) or normalized. Let's store exact input but ensure query consistency.
                aadhaar_number,
                dob,
                gender,
                residential_address,
                landmark,
                area_branch,
                business_address,
                father_or_spouse_name,
                nominee_name,
                nominee_relationship,
                nominee_age,
                scheme_type,
                scheme_number,
                payment_mode,
                installment_amount,
                scheme_start_date,
                book_number,
                sales_officer_id,
                sales_officer_name,
                notes,
                status,
                login_enabled: true, // Auto-enable
                is_active: status === 'active'
            })
            .select()
            .single();

        if (dbError) {
            console.error("DB Insert Failed:", dbError);
            throw new Error(`Database Insert Failed: ${dbError.message}`);
        }

        // 6. [FIX] Auto-Enroll in Scheme if provided
        if (scheme_type) {
            // A. Lookup Scheme ID
            const { data: schemeData } = await supabase
                .from('schemes')
                .select('id')
                .ilike('name', `%${scheme_type}%`) // Loose match or exact match preferred
                .filter('is_active', 'eq', true)
                .maybeSingle();

            if (schemeData) {
                // B. Create User Scheme Record
                const { error: schemeError } = await supabase
                    .from('user_schemes')
                    .insert({
                        customer_id: customerData.id,
                        scheme_id: schemeData.id,
                        status: 'active',
                        total_grams: 0,
                        total_paid: 0,
                        // Defaults
                    });

                if (schemeError) {
                    console.error("Failed to enroll user in scheme:", schemeError);
                    // Non-critical: User created, but scheme failed. We don't rollback user, just log.
                } else {
                    console.log(`Auto-enrolled customer ${customerData.id} in scheme ${schemeData.id}`);
                }
            } else {
                console.warn(`Scheme type '${scheme_type}' not found or inactive. User created without scheme.`);
            }
        }

        // 6. Success
        return NextResponse.json({
            success: true,
            message: "Customer created successfully",
            customer: customerData
        });

    } catch (error: any) {
        console.error("Create Customer Transaction Failed:", error);

        // ROLLBACK: Delete Auth User if DB insert failed
        if (createdAuthId && supabase) {
            await supabase.auth.admin.deleteUser(createdAuthId).catch(delErr => {
                console.error("CRITICAL: Failed to rollback Auth User:", delErr);
            });
        }

        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

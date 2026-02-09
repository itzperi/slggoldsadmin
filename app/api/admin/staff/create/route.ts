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
            name,
            username,
            password,
            role = 'staff', // Default to staff
            phone,
            address,
            designation,
            salary,
            joining_date
        } = body;

        // 1. Basic Validation
        if (!username || !password || !name) {
            return NextResponse.json({ error: "Missing required fields (Name, Username, Password)" }, { status: 400 });
        }

        // 2. Generate Synthetic Email
        // Format: username@staff.local (ensure lowercase)
        const syntheticEmail = `${username.toLowerCase().trim()}@staff.local`;

        // 3. Check Duplicates in DB
        const { data: existing } = await supabase
            .from('staff')
            .select('id')
            .eq('username', username)
            .maybeSingle();

        if (existing) {
            return NextResponse.json({ error: "Staff with this username already exists" }, { status: 409 });
        }

        // 4. Create Supabase Auth User
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: syntheticEmail,
            password: password,
            email_confirm: true,
            user_metadata: {
                full_name: name,
                role: role,
                is_staff: true
            }
        });

        if (authError) {
            console.error("Staff Auth Creation Failed:", authError);
            return NextResponse.json({ error: `Auth Error: ${authError.message}` }, { status: 500 });
        }

        createdAuthId = authData.user.id;

        // 4.5 Insert into Profiles Table (REQUIRED for FK constraint on staff table)
        // Staff table references profiles(id), so we must create this first.

        // Map generic 'staff' role to a valid constraint value
        let profileRole = role;
        if (role === 'staff') {
            profileRole = 'office_staff'; // Default generic staff to office_staff to satisfy constraint
        } else if (!['admin', 'office_staff', 'collection_staff', 'customer'].includes(role)) {
            profileRole = 'office_staff'; // Fallback for safety
        }

        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                id: createdAuthId,
                role: profileRole,
                full_name: name,
                username: username.toLowerCase().trim(),
                phone: phone,
                // email: syntheticEmail, // REMOVED: Column does not exist in 'profiles'
                login_enabled: true,
                staff_type: role, // Keep original role in staff_type if needed
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });

        if (profileError) {
            console.error("Profile Insert Failed:", profileError);
            // Rollback Auth User
            await supabase.auth.admin.deleteUser(createdAuthId);
            return NextResponse.json({ error: `Profile Creation Failed: ${profileError.message}` }, { status: 500 });
        }

        // 5. Insert into Staff Table
        const { data: staffData, error: dbError } = await supabase
            .from('staff')
            .insert({
                auth_user_id: createdAuthId,
                name,
                username: username.toLowerCase().trim(), // Normalize
                role,
                phone,
                address,
                designation,
                salary,
                joining_date,
                status: 'active',
                email: syntheticEmail // consistent with auth
            })
            .select()
            .single();

        if (dbError) {
            console.error("DB Insert Failed:", dbError);
            throw new Error(`Database Insert Failed: ${dbError.message}`);
        }

        // 6. Success
        return NextResponse.json({
            success: true,
            message: "Staff created successfully",
            staff: staffData
        });

    } catch (error: any) {
        console.error("Create Staff Transaction Failed:", error);

        // ROLLBACK: Delete Auth User if DB insert failed
        if (createdAuthId && supabase) {
            await supabase.auth.admin.deleteUser(createdAuthId).catch(delErr => {
                console.error("CRITICAL: Failed to rollback Auth User:", delErr);
            });
        }

        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

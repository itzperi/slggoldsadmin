import { NextResponse } from 'next/server';
import { getSecureAdminClient } from '@/lib/secure-admin-client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    let createdAuthId = null;
    const supabase = getSecureAdminClient();

    try {
        const body = await request.json();
        const {
            full_name,
            phone,
            password,
            // Additional Fields from Form
            aadhaar_number,
            gender,
            address, // Form sends 'address'
            nominee_name,
            nominee_relationship,
            nominee_age,
            father_spouse_name, // Form sends 'father_spouse_name'

            // New Fields (might be null from current form, but supported)
            nominee_phone,
            dob,
            scheme_type,
            scheme_amount, // Form/Body might send this
            payment_mode,
            sales_officer_id,
            sales_officer_name,
            book_number,
            area_branch,
            landmark,
            business_address,
            scheme_number,
            scheme_start_date
        } = body;

        // Basic Validation
        if (!full_name || !phone || !password || !aadhaar_number) {
            return NextResponse.json({ error: "Missing required fields (Name, Phone, Password, Aadhaar)" }, { status: 400 });
        }

        // 1. Check if phone already exists in DB
        const { data: existingCustomer, error: checkError } = await supabase
            .from('customers')
            .select('id')
            .or(`phone.eq.${phone},aadhaar_number.eq.${aadhaar_number}`)
            .maybeSingle();

        if (checkError) throw new Error(`Database check failed: ${checkError.message}`);
        if (existingCustomer) {
            return NextResponse.json({ error: "Customer with this Phone or Aadhaar already exists." }, { status: 409 });
        }

        // 2. Create Supabase Auth User
        const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
            phone: phone,
            password: password,
            phone_confirm: true,
            user_metadata: {
                full_name: full_name,
                role: 'customer'
            }
        });

        if (authError) {
            console.error("Auth Creation Error:", authError);
            return NextResponse.json({ error: `Auth Error: ${authError.message}` }, { status: 500 });
        }

        createdAuthId = authUser.user.id;

        // 3. Generate Customer Code
        const customerCode = `SLG-${Date.now().toString().slice(-6)}`;

        // 4. Insert into Customers Table (Strict Schema Mapping)
        const { data: newCustomer, error: insertError } = await supabase
            .from('customers')
            .insert({
                user_id: null, // Decoupled from Link
                auth_user_id: createdAuthId,

                // Identity
                full_name: full_name,
                phone: phone,
                aadhaar_number: aadhaar_number,
                gender: gender,
                dob: dob || null,

                // Address
                residential_address: address || null, // Map form 'address' to 'residential_address'
                area_branch: area_branch || null,
                landmark: landmark || null,
                business_address: business_address || null,

                // Family / Nominee
                father_or_spouse_name: father_spouse_name || null, // Map form 'father_spouse_name'
                nominee_name: nominee_name,
                nominee_relationship: nominee_relationship, // Note: DB column might be nominee_relation or nominee_relationship. Checked 172: it is nominee_relationship.
                nominee_age: nominee_age || null,
                nominee_phone: nominee_phone || null,

                // Scheme
                scheme_type: scheme_type || null,
                scheme_number: scheme_number || null,
                payment_mode: payment_mode || null,
                installment_amount: scheme_amount || null, // Map 'scheme_amount' to 'installment_amount'
                scheme_start_date: scheme_start_date || null,

                // Admin / Office
                sales_officer_id: sales_officer_id || null,
                sales_officer_name: sales_officer_name || null,
                book_number: book_number || null,

                // System
                customer_code: customerCode,
                status: 'active',
                // login_enabled: true // Check if this column exists. Step 172: yes 'login_enabled'. 
                // But generally status='active' should be enough. Let's include it for safety if legacy.
                login_enabled: true
            })
            .select()
            .single();

        if (insertError) {
            throw new Error(`Customer DB Insert Error: ${insertError.message}`);
        }

        return NextResponse.json({
            success: true,
            message: "Customer created successfully",
            customer: newCustomer,
            auth_user_id: createdAuthId
        });

    } catch (error: any) {
        console.error("Creation Failed:", error);

        // ROLLBACK: Delete Auth User 
        if (createdAuthId) {
            await supabase.auth.admin.deleteUser(createdAuthId);
        }

        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

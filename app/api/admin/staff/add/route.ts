import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email, fullName, phone, staffType, dailyTarget } = await request.json();

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseServiceKey) {
            return NextResponse.json({ error: 'Missing service role key' }, { status: 500 });
        }

        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // 1. Create Supabase Auth user
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password: 'SLG@123', // Default password
            email_confirm: true,
            user_metadata: { full_name: fullName }
        });

        if (authError) throw authError;

        // 2. Insert into profiles table
        const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
                id: authUser.user.id,
                role: 'staff',
                full_name: fullName,
                phone: phone || null
            });

        if (profileError) throw profileError;

        // 3. Insert into staff_metadata table
        const { error: metadataError } = await supabaseAdmin
            .from('staff_metadata')
            .insert({
                user_id: authUser.user.id,
                staff_type: staffType,
                daily_target: dailyTarget || null,
                is_active: true
            });

        if (metadataError) throw metadataError;

        return NextResponse.json({ success: true, userId: authUser.user.id });
    } catch (error: any) {
        console.error('Staff creation error:', error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

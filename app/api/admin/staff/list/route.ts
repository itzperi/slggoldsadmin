import { NextResponse } from 'next/server';
import { getSecureAdminClient } from '@/lib/secure-admin-client';

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log("[API] List Staff v2 (Explicit Selects) - " + new Date().toISOString());

    try {
        const supabaseAdmin = getSecureAdminClient();

        // Join staff with profiles to get full details

        // Join staff with profiles to get full details
        const { data: staff, error } = await supabaseAdmin
            .from('staff')
            .select(`
                id,
                staff_code,
                name,
                username,
                status,
                role,
                created_at,
                email,
                phone,
                auth_user_id,
                profiles!inner(
                    full_name,
                    phone,
                    role
                )
            `)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("[API] DB Select Error:", error);
            throw error;
        }

        // Transform data to match UI expectations
        // UI expects: id, staff_code, name, username, status, assigned_customers_count
        const formattedStaff = staff.map((s: any) => {
            // Handle 'profiles' array or object depending on relationship (One-to-One here)
            const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;

            return {
                ...s,
                name: profile?.full_name || s.name || 'N/A', // Fallback to profile name
                email: s.email,
                phone: profile?.phone || s.phone,
                role: profile?.role || s.role
            };
        });

        return NextResponse.json({ staff: formattedStaff });

    } catch (err: any) {
        console.error("[API] Staff List Error:", err);
        return NextResponse.json({ error: err.message || "Failed to fetch staff" }, { status: 500 });
    }
}

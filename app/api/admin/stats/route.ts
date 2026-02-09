import { getSecureAdminClient } from '@/lib/secure-admin-client';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabaseAdmin = getSecureAdminClient();
        const [
            { count: customerCount },
            { count: schemeCount },
            { count: withdrawalCount },
            { count: paymentsCount }
        ] = await Promise.all([
            supabaseAdmin.from('customers').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('schemes').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('withdrawals').select('*', { count: 'exact', head: true }),
            supabaseAdmin.from('payments').select('*', { count: 'exact', head: true })
        ]);

        return NextResponse.json({
            customers: customerCount || 0,
            collections: paymentsCount || 0,
            schemes: schemeCount || 0,
            withdrawals: withdrawalCount || 0
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

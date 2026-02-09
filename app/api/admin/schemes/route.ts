import { NextResponse } from 'next/server';
import { getSecureAdminClient } from '@/lib/secure-admin-client';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = getSecureAdminClient();
        const { data, error } = await supabase
            .from('schemes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // Map emi_amount back to installment_amount for frontend compatibility
        const mappedData = data?.map(s => ({
            ...s,
            installment_amount: s.emi_amount
        }));

        return NextResponse.json(mappedData);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const supabase = getSecureAdminClient();

        // 1. Map frontend fields to DB columns
        const dbPayload = {
            name: body.name,
            emi_amount: body.installment_amount,
            duration_months: body.duration_months,
            min_amount: body.installment_amount,
            max_amount: body.installment_amount,
            description: body.description,
            is_active: body.active,
            metal_type: body.asset_type
        };

        const { data, error } = await supabase
            .from('schemes')
            .insert(dbPayload)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (err: any) {
        console.error("Scheme creation error:", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

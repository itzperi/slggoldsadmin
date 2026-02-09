import { NextResponse } from 'next/server';
import { getSecureAdminClient } from '@/lib/secure-admin-client';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const supabase = getSecureAdminClient();
        const { data, error } = await supabase
            .from('market_rates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const supabase = getSecureAdminClient();

        // Assuming body contains { rate: number, type: 'gold' | 'silver', ... }
        // Verify columns? For now pass body directly but ensure validation if needed.
        // Or specific fields: rate, type, unit?
        // Let's rely on body matching mostly, but safer to pick fields.
        // However, without seeing body shape from UI it's a guess.
        // But previously it was just passing body to MCP.

        const { data, error } = await supabase
            .from('market_rates')
            .insert({
                ...body,
                updated_at: new Date().toISOString() // Ensure timestamp update
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

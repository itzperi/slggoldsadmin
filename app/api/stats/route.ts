import { NextResponse } from 'next/server';

export async function GET() {
    console.log("[API] Forwarding Stats Fetch to MCP/Edge Layer");

    const FUNCTION_URL = 'https://lvabuspixfgscqidyfki.supabase.co/functions/v1/admin-action';

    try {
        const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'get-stats', payload: {} })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            total_customers: 0,
            total_staff: 0,
            total_collections: 0,
            active_schemes: 18
        }, { status: 500 });
    }
}

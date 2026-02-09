import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    console.log("[API] Forwarding Office Customer Add to MCP/Edge Layer");

    // Project Ref determined from tool output: lvabuspixfgscqidyfki
    const FUNCTION_URL = 'https://lvabuspixfgscqidyfki.supabase.co/functions/v1/admin-action';

    try {
        const body = await request.json();

        const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'add-customer', payload: body })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        return NextResponse.json({ success: true, customerId: data.customerId });

    } catch (err: any) {
        return NextResponse.json({ error: err.message || "MCP Proxy Failed" }, { status: 500 });
    }
}

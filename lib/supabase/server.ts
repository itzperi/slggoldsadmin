// This file is DEPRECATED for Admin API usage.
//
// ARCHITECTURAL RULE COMPLIANCE:
// The shared `supabaseAdmin` client has been removed to prevent "Invalid API key" errors caused by
// module-scope initialization in Next.js Edge/Node mixed runtimes.
//
// DO NOT RESTORE THE EXPORT.
//
// Instead, inside your API Route or Server Action:
// 1. Import { createClient } from '@supabase/supabase-js';
// 2. Instantiate the client INSIDE the function handler:
//
//    const supabaseAdmin = createClient(
//      process.env.NEXT_PUBLIC_SUPABASE_URL!,
//      process.env.SUPABASE_SERVICE_ROLE_KEY!,
//      { auth: { autoRefreshToken: false, persistSession: false } }
//    );

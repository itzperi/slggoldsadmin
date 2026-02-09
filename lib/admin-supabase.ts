import { createClient } from '@supabase/supabase-js';

export function getAdminClient() {
    // 1. Strict Environment Checks
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!url) {
        throw new Error("NEXT_PUBLIC_SUPABASE_URL is missing from environment.");
    }

    if (!serviceKey) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is missing from environment.");
    }

    if (serviceKey.startsWith("YOUR_")) {
        throw new Error("SUPABASE_SERVICE_ROLE_KEY is still set to placeholder 'YOUR_SERVICE_ROLE_KEY_HERE'.");
    }

    // 2. Prevent Client-Side Usage (Sanity Check)
    if (typeof window !== 'undefined') {
        throw new Error("Admin Client called on client-side! This is a security violation.");
    }

    // 3. Initialize Client
    return createClient(url, serviceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
        }
    });
}

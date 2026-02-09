
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

/**
 * reliable-admin-client.ts
 * 
 * Helper to get a Supabase Admin Client that is guaranteed to use the 
 * correct Service Role Key from .env.local, bypassing potential 
 * process.env pollution or stale shell variables.
 */

export function getSecureAdminClient() {
    // 1. Runtime Check: Must be Server Side
    if (typeof window !== 'undefined') {
        throw new Error("Security Violation: Admin Client cannot be used in browser.");
    }

    // 2. Load Env Directly from File
    const envPath = path.resolve(process.cwd(), '.env.local');
    let serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    let finalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // Try reading file only if we are in Node and fs is available to avoid edge crashes
    try {
        if (fs && fs.existsSync && fs.existsSync(envPath)) {
            const content = fs.readFileSync(envPath, 'utf8');
            content.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    let value = match[2].trim();
                    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }

                    if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
                        // Always prefer file if process.env differs
                        if (serviceKey !== value) {
                            console.log("[AdminAuth] Using key from .env.local (overriding process.env)");
                            serviceKey = value;
                        }
                    }
                    if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
                        // Prefer file if env is missing
                        if (!finalUrl) finalUrl = value;
                    }
                }
            });
        }
    } catch (e) {
        console.warn("[AdminAuth] Failed to parse .env.local (this is harmless if vars are loaded):", e);
    }

    // 3. Validation
    if (!finalUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
    if (!serviceKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

    if (serviceKey === process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        throw new Error("Configuration Error: Service Role Key is same as Anon Key!");
    }

    if (!serviceKey.startsWith('eyJ')) {
        throw new Error("Invalid Service Role Key format (not a JWT).");
    }

    // 4. Create Client
    return createClient(finalUrl, serviceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false
        }
    });
}

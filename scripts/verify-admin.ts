
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load .env.local explicitly
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

async function verify() {
    console.log("--- Verifying Supabase Admin Access ---");
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log(`URL: ${url}`);
    console.log(`Key Present: ${!!key}`);
    if (key) {
        console.log(`Key Length: ${key.length}`);
        console.log(`Key Prefix: ${key.substring(0, 10)}...`);
        if (key === process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
            console.error("CRITICAL: Service Role Key IS THE ANON KEY.");
        }
    } else {
        console.error("CRITICAL: Service Role Key is MISSING.");
        return;
    }

    const supabase = createClient(url!, key!, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    try {
        const { data, error } = await supabase.from('staff').select('count', { count: 'exact', head: true });
        if (error) {
            console.error("Supabase Query Failed:", error.message);
        } else {
            console.log("SUCCESS: Supabase Admin Connection Verified!");
            console.log(`Staff Count: ${data}`);
        }
    } catch (e: any) {
        console.error("Exception:", e.message);
    }
}

verify();

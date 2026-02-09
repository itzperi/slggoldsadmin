const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Load .env.local manually
const envPath = path.join(__dirname, '../.env.local');
if (!fs.existsSync(envPath)) {
    console.error("❌ .env.local not found at", envPath);
    process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        let value = match[2].trim();
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        envVars[match[1].trim()] = value;
    }
});

const url = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const serviceKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

console.log("--- Supabase Verification ---");
console.log("URL:", url);
console.log("Key Length:", serviceKey ? serviceKey.length : "MISSING");
console.log("Key Start:", serviceKey ? serviceKey.substring(0, 10) + "..." : "N/A");

if (!url || !serviceKey || serviceKey.includes("YOUR_SERVICE_ROLE_KEY")) {
    console.error("❌ Configuration invalid. Please check .env.local");
    process.exit(1);
}

// 2. Initialize Supabase
const supabase = createClient(url, serviceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

// 3. Test Connection
async function verify() {
    console.log("Attempting to list users (admin only)...");
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });

    if (error) {
        console.error("❌ verification FAILED");
        console.error("Error Message:", error.message);
        console.error("Error Status:", error.status);
        console.error("Possible Cause: The Service Role Key is invalid, expired, or belongs to a different project.");
    } else {
        console.log("✅ verification SUCCESS");
        console.log("Successfully connected to Supabase as Admin.");
        console.log("Found users:", data.users.length);
    }
}

verify();

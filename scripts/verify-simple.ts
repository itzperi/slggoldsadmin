
const fs = require('fs');
const path = require('path');
const https = require('https');

// Manually parse .env.local
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        const content = fs.readFileSync(envPath, 'utf8');
        const env = {};
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                let value = match[2].trim();
                // Remove quotes
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                env[match[1].trim()] = value;
            }
        });
        return env;
    } catch (e) {
        console.error("Error loading .env.local:", e.message);
        return {};
    }
}

async function verify() {
    const env = loadEnv();
    const url = env.NEXT_PUBLIC_SUPABASE_URL;
    const key = env.SUPABASE_SERVICE_ROLE_KEY;

    console.log("Checking keys...");
    console.log("URL:", url);
    console.log("Key starts with:", key ? key.substring(0, 10) : "MISSING");

    if (!url || !key) {
        console.error("Missing URL or KEY in .env.local");
        return;
    }

    try {
        const fetchUrl = `${url}/rest/v1/staff?select=count&limit=1`;
        console.log("Fetching:", fetchUrl);

        const resp = await fetch(fetchUrl, {
            headers: {
                'apikey': key,
                'Authorization': `Bearer ${key}`
            }
        });

        const text = await resp.text();
        console.log("Status:", resp.status);
        console.log("Response:", text);

        if (resp.status === 200 || resp.status === 206) {
            console.log("SUCCESS: Key is VALID.");
        } else {
            console.error("FAILURE: Key is INVALID.");
        }
    } catch (e) {
        console.error("Fetch Error:", e);
    }
}

verify();


const fs = require('fs');
const path = require('path');

// Read .env manually
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const envConfig = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        envConfig[key] = value;
    }
});

const SERVICE_KEY = envConfig['SUPABASE_SERVICE_ROLE_KEY'];
const FUNCTION_URL = 'https://lvabuspixfgscqidyfki.supabase.co/functions/v1/admin-action';

console.log("Service Key Found:", !!SERVICE_KEY);

async function testListStaff() {
    console.log("Testing list-staff action with Service Key...");
    try {
        const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SERVICE_KEY}`
            },
            body: JSON.stringify({ action: 'list-staff', payload: {} })
        });

        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Response Body (Truncated):", JSON.stringify(data, null, 2).substring(0, 500));

        if (data.data && Array.isArray(data.data)) {
            console.log("SUCCESS: Received array of length", data.data.length);
        } else if (data.staff && Array.isArray(data.staff)) {
            console.log("SUCCESS: Received array of length", data.staff.length);
        } else {
            console.log("FAILURE: Invalid shape");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

testListStaff();

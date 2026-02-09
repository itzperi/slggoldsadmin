
const FUNCTION_URL = 'https://lvabuspixfgscqidyfki.supabase.co/functions/v1/admin-action';

async function testListStaff() {
    console.log("Testing list-staff action...");
    try {
        const response = await fetch(FUNCTION_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'list-staff', payload: {} })
        });

        console.log("Status:", response.status);
        const data = await response.json();
        console.log("Response Body:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}

testListStaff();

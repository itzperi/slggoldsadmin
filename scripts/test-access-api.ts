
// Uses global fetch in Node 18+

async function testAccessApi() {
    console.log("Testing Customer Access API...");

    // 1. Define the target phone (sends +91, stored as 9999999999)
    const phone = "+919999999999";

    try {
        const response = await fetch('http://localhost:3000/api/admin/customers/access', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phone })
        });

        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(data, null, 2));

        if (response.status === 200 && data.success) {
            console.log("PASS: Access activated successfully.");
        } else {
            console.log("FAIL: API did not return success.");
        }

    } catch (e) {
        console.error("API Call Failed:", e);
    }
}

testAccessApi();


import { getSecureAdminClient } from '../lib/secure-admin-client';

async function checkCustomers() {
    console.log("Checking Customers Table via Service Role...");
    try {
        const admin = getSecureAdminClient();

        // 1. List all customers
        const { data: allCustomers, error: listError } = await admin
            .from('customers')
            .select('*');

        if (listError) {
            console.error("List Error:", listError);
        } else {
            console.log(`Found ${allCustomers.length} customers.`);
            allCustomers.forEach(c => console.log(` - ${c.name} (${c.phone})`));
        }

        // 2. Try to insert a dummy customer if empty
        if (!allCustomers || allCustomers.length === 0) {
            console.log("Attempting to insert dummy customer...");
            const { data: newC, error: insertError } = await admin
                .from('customers')
                .insert({
                    name: "Test Customer",
                    phone: "9999999999",
                    is_active: true
                })
                .select()
                .single();

            if (insertError) {
                console.error("Insert Error:", insertError);
            } else {
                console.log("Inserted Test Customer:", newC);
            }
        }

    } catch (e) {
        console.error("Exception:", e);
    }
}

checkCustomers();

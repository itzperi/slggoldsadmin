
import { getSecureAdminClient } from '../lib/secure-admin-client';

async function setupCustomer() {
    try {
        const admin = getSecureAdminClient();

        // 1. Get Scheme
        const { data: scheme, error: schemeError } = await admin.from('schemes').select('id').limit(1).single();
        if (schemeError) console.error("Scheme Fetch Error:", schemeError);
        console.log("Fetched Scheme:", scheme);

        if (!scheme) throw new Error("No schemes found!");

        // 2. Insert Customer
        const { data, error } = await admin
            .from('customers')
            .upsert({
                id: '11111111-1111-1111-1111-111111111111', // Fixed ID for repeatability
                name: "Test Normalization User",
                phone: "9999999999",
                scheme_id: scheme.id,
                is_active: true
            }, { onConflict: 'id' })
            .select()
            .single();

        if (error) {
            console.error("Setup Failed:", error);
        } else {
            console.log("Customer Setup Complete:", data.phone);
        }

    } catch (e) {
        console.error("Setup Exception:", e);
    }
}

setupCustomer();

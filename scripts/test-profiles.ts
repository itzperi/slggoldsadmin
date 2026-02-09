
import { getSecureAdminClient } from '../lib/secure-admin-client';
import fs from 'fs';
import path from 'path';

async function testProfiles() {
    const logParams = [];
    const log = (...args) => {
        console.log(...args);
        logParams.push(args.map(a => JSON.stringify(a)).join(' '));
    };

    log("Testing Service Role Access to Profiles...");
    try {
        const admin = getSecureAdminClient();
        const { data, error } = await admin
            .from('profiles')
            .select('count')
            .limit(1);

        if (error) {
            log("FAIL: Permission Denied or Error:", error);
        } else {
            log("SUCCESS: Accessed profiles. Data:", data);
        }

        // Also test the join
        log("Testing Join Staff -> Profiles...");
        const { data: joinData, error: joinError } = await admin
            .from('staff')
            .select('id, profiles!inner(full_name)')
            .limit(1);

        if (joinError) {
            log("FAIL: Join Error:", joinError);
        } else {
            log("SUCCESS: Join worked.");
        }

    } catch (e) {
        log("CRITICAL EXCEPTION:", JSON.stringify(e, Object.getOwnPropertyNames(e)));
    }

    fs.writeFileSync(path.join(__dirname, 'output.txt'), logParams.join('\n'));
}

testProfiles();

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

console.log("Checking file:", envPath);

try {
    if (!fs.existsSync(envPath)) {
        console.error("ERROR: .env.local does not exist at this path!");
    } else {
        const content = fs.readFileSync(envPath, 'utf8');
        console.log("--- START .env.local ---");
        const lines = content.split('\n');
        lines.forEach(line => {
            if (line.includes("SUPABASE_SERVICE_ROLE_KEY")) {
                console.log(line);
            }
        });
        console.log("--- END .env.local ---");
    }
} catch (err) {
    console.error("Error reading file:", err);
}

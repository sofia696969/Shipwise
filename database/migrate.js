import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Error: Missing Supabase credentials in environment variables"
  );
  console.error("Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runMigrations() {
  console.log(" Starting Supabase database migrations...\n");

  const migrationFiles = [
    "001_shipments.sql",
    "002_goods.sql",
    "003_carriers.sql",
    "004_incidents.sql",
    "005_staff_users.sql",
  ];

  for (const file of migrationFiles) {
    const filePath = path.join(path.dirname(new URL(import.meta.url).pathname), file);

    try {
      const sql = fs.readFileSync(filePath, "utf8");
      console.log(`⏳ Running: ${file}`);

      // Execute SQL
      const { error } = await supabase.rpc("exec_sql", { sql });

      if (error) {
        console.error(`Error in ${file}:`);
        console.error(error.message);
        throw error;
      }

      console.log(`Completed: ${file}\n`);
    } catch (err) {
      console.error(`Failed to run ${file}`);
      console.error(err);
      process.exit(1);
    }
  }

  console.log(" All migrations completed successfully!");
  console.log(
    "You can now use the Shipwise application with your Supabase database."
  );
}

runMigrations();

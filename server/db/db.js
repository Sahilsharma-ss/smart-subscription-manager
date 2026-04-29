import "dotenv/config";
import pkg from "pg";

const { Pool } = pkg;

const shouldUseSsl = /supabase\.co|pooler\.supabase\.com/i.test(
  process.env.DATABASE_URL || ""
);

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: shouldUseSsl || process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

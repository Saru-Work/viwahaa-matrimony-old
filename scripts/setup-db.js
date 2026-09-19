import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const HOST = process.env.DB_HOST || "localhost";
const PORT = Number(process.env.DB_PORT || "3306");
const USER = process.env.DB_USER || "root";
const PASSWORD = process.env.DB_PASSWORD || undefined;
const DB = process.env.DB_NAME || "viwahaa";

async function setup() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: HOST,
      port: PORT,
      user: USER,
      password: PASSWORD,
      multipleStatements: true,
    });
  } catch (err) {
    console.error("Could not connect to MySQL:", err.message);
    process.exit(1);
  }

  const [rows] = await conn.query("SHOW DATABASES LIKE ?", [DB]);
  const isNewDb = rows.length === 0;

  if (isNewDb) {
    console.log(`Database '${DB}' not found — creating...`);
    await conn.query(`CREATE DATABASE \`${DB}\``);
    await conn.query(`USE \`${DB}\``);

    const backupPath = path.resolve(process.cwd(), "api/Database/viwaaha_backup.sql");
    if (fs.existsSync(backupPath)) {
      console.log("Importing schema from backup SQL...");
      const sql = fs.readFileSync(backupPath, "utf8");
      await conn.query(sql);
      console.log("Schema imported.");
    } else {
      console.warn("Backup SQL not found — skipping schema import.");
    }

    await conn.end();

    // Mark the initial Prisma migration as already applied (schema came from backup)
    try {
      console.log("Marking initial Prisma migration as applied...");
      execSync('npx prisma migrate resolve --applied "20260331045524_init"', {
        stdio: "inherit",
      });
    } catch {
      // Non-fatal — Prisma table may not exist yet; migrate deploy will handle it
      execSync("npx prisma migrate deploy", { stdio: "inherit" });
    }
  } else {
    await conn.end();
    // DB exists — just apply any new pending Prisma migrations
    try {
      execSync("npx prisma migrate deploy", { stdio: "inherit" });
    } catch (err) {
      console.warn("Prisma migrate deploy warning:", err.message);
    }
  }

  console.log("Database is ready.");
}

setup().catch((err) => {
  console.error("Database setup failed:", err.message);
  process.exit(1);
});

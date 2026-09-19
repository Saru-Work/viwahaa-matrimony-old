import mysql from "mysql2/promise";
import dotenv from "dotenv";


//dotenv.config();
import path from "path";
import fs from "fs";

// Load .env.local for local development, fall back to .env for production
const envLocalPath = path.resolve(process.cwd(), ".env.local");
const envPath = path.resolve(process.cwd(), ".env");

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
  console.log("Loaded environment from .env.local (local development)");
} else {
  dotenv.config({ path: envPath });
  console.log("Loaded environment from .env (production)");
}

// Create a connection pool instead of a single connection
// Note: Empty DB_PASSWORD ("") must be treated as undefined/no password
// so mysql2 sends "using password: NO" — required for XAMPP/MariaDB root
// We distinguish between "set but empty" vs "not set at all":
//   - Set but empty string → no password (local XAMPP)
//   - Not set at all → use hardcoded fallback (production)
const isPasswordDefined = "DB_PASSWORD" in process.env;
const dbPassword = isPasswordDefined
  ? (process.env.DB_PASSWORD || undefined)  // empty string → undefined (no password)
  : "";                         // fallback for production

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || "3306",
  user: process.env.DB_USER || "root",
  //  password: process.env.DB_PASSWORD || "J!7FowuO$mHf",
  password: dbPassword,
  database: process.env.DB_NAME || "viwahaa",
  waitForConnections: true,
  connectionLimit: 10, // Adjust based on your needs
  queueLimit: 0,
  enableKeepAlive: true, // Important for long-running applications
  keepAliveInitialDelay: 10000, // 10 seconds
});

// Test the connection on startup
pool
  .getConnection()
  .then((connection) => {
    console.log("Successfully connected to MySQL database");
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit if initial connection fails
  });

// Handle connection errors
pool.on("error", (err) => {
  console.error("Database pool error:", err);
  if (err.code === "PROTOCOL_CONNECTION_LOST") {
    console.log("Attempting to reconnect...");
  } else {
    throw err;
  }
});

// Graceful shutdown handler
process.on("SIGINT", () => {
  pool
    .end()
    .then(() => {
      console.log("Database pool closed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error closing database pool:", err);
      process.exit(1);
    });
});

export default pool;

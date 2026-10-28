import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool = null;
let isConnected = false;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "interviewiq_db",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });
} catch (err) {
  console.warn("[MySQL] Pool initialization failed:", err.message);
}

/**
 * Check MySQL connection status safely without throwing fatal error
 */
export async function testDbConnection() {
  if (!pool) return false;
  try {
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    isConnected = true;
    return true;
  } catch (err) {
    isConnected = false;
    return false;
  }
}

export function isDbConnected() {
  return isConnected;
}

export default pool;

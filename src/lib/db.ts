
// src/lib/db.ts
import mysql from 'mysql2/promise';

// Database configuration for the remote freesqldatabase.com server.
const dbConfig = {
  host: process.env.DB_HOST || 'sql12.freesqldatabase.com',
  user: process.env.DB_USER || 'sql12793195',
  password: process.env.DB_PASSWORD || 'QIdmgcuWYH',
  database: process.env.DB_NAME || 'sql12793195',
  port: 3306,
  connectionLimit: 1, // Explicitly limit connections to 1 for this free tier.
};

// Create a single, persistent connection pool.
const pool = mysql.createPool(dbConfig);


// A dedicated function to test the database connection.
export async function testConnection() {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.ping();
        return { success: true, message: "Database connection successful!" };
    } catch (error: any) {
        console.error('DATABASE_CONNECTION_FAILED:', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}


// The query function executes a SQL query and returns the result.
export async function query(sql: string, params: any[] = []) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error: any) {
    console.error('DATABASE_QUERY_FAILED:', error);
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

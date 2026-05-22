import e from "express";
import pool from "../connection/Index";

const initDB = async () => {
  //user models
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(20),
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);
    await pool.query(`
  CREATE TABLE IF NOT EXISTS issues (
    id SERIAL PRIMARY KEY,

    title VARCHAR(150) NOT NULL
    CHECK (char_length(title) <= 150),

    description TEXT NOT NULL
    CHECK (char_length(description) >= 20),

    type VARCHAR(20) NOT NULL
    CHECK (type IN ('bug', 'feature_request')),

    status VARCHAR(20) DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'resolved')),

    reporter_id INTEGER NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);
    console.log("Database Initialized Successfully! 🚀");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
export default initDB;

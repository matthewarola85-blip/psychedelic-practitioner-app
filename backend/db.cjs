require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id SERIAL PRIMARY KEY,
        clerk_user_id VARCHAR(255),
        name VARCHAR(255) NOT NULL,
        date_of_birth DATE,
        treatment_goal TEXT,
        notes TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Clients table created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS treatment_reports (
        id SERIAL PRIMARY KEY,
        client_id INTEGER REFERENCES clients(id) ON DELETE CASCADE,
        treatment_goal TEXT,
        psychedelic VARCHAR(255),
        medications JSONB,
        report TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✓ Treatment reports table created');

    console.log('Database setup complete');
    process.exit(0);
  } catch (err) {
    console.error('Database setup failed:', err.message);
    process.exit(1);
  }
};

createTables();
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'Psychedelic Practitioner API is running' });
});

// Test database connection
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ status: 'Database connected' });
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

// Routes (we will add these next)
const treatmentRoutes = require('./routes/treatment.cjs');
const clientRoutes = require('./routes/clients.cjs');

app.use('/api/treatment', treatmentRoutes);
app.use('/api/clients', clientRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
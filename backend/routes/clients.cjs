const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { clerkClient } = require('@clerk/clerk-sdk-node');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware to get clerk user id from header
const getUserId = (req) => {
  return req.headers['x-user-id'];
};

// Get all clients for this user
router.get('/', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const result = await pool.query(
      'SELECT * FROM clients WHERE clerk_user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single client
router.get('/:id', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const result = await pool.query(
      'SELECT * FROM clients WHERE id = $1 AND clerk_user_id = $2',
      [req.params.id, userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create client
router.post('/', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { name, date_of_birth, treatment_goal, notes } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO clients (clerk_user_id, name, date_of_birth, treatment_goal, notes, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [userId, name, date_of_birth, treatment_goal, notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update client
router.put('/:id', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { name, date_of_birth, treatment_goal, notes } = req.body;
  try {
    const result = await pool.query(
      `UPDATE clients SET name=$1, date_of_birth=$2, treatment_goal=$3, notes=$4
       WHERE id=$5 AND clerk_user_id=$6 RETURNING *`,
      [name, date_of_birth, treatment_goal, notes, req.params.id, userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete client
router.delete('/:id', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  try {
    await pool.query(
      'DELETE FROM clients WHERE id = $1 AND clerk_user_id = $2',
      [req.params.id, userId]
    );
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
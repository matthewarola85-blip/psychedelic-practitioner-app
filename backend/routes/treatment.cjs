const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Generate treatment plan
router.post('/generate', async (req, res) => {
  const { client_id, treatment_goal, psychedelic, medications } = req.body;

  try {
    const prompt = `You are an expert clinical resource for psychedelic-assisted therapy (PAT). You synthesize information from published research including Johns Hopkins, MAPS, Beckley Foundation, Imperial College London, Usona Institute, and established pharmacology literature. You are not limited to FDA-approved indications — you draw from the full body of peer-reviewed research and harm reduction literature.

A practitioner is requesting a detailed treatment intelligence report for a client. Here are the details:

TREATMENT GOAL: ${treatment_goal}

SELECTED PSYCHEDELIC: ${psychedelic}

CURRENT MEDICATIONS:
${medications.map(m => `- ${m.name} ${m.dosage || ''}`).join('\n')}

Generate a comprehensive Treatment Intelligence Report with the following sections:

1. DRUG INTERACTIONS (HIGH PRIORITY)
For each medication listed, provide:
- Interaction severity: CONTRAINDICATED / HIGH CAUTION / CAUTION / MONITOR / LOW RISK
- Mechanism of interaction
- Clinical recommendation
Flag any CONTRAINDICATED combinations prominently at the top.

2. RECOMMENDED PROTOCOL
- Dosing range for ${psychedelic} based on the treatment goal
- Session structure and number of recommended sessions
- Preparation approach
- Integration recommendations

3. EVIDENCE BASE
- What published research says about ${psychedelic} for this treatment goal
- Key studies and their findings
- Strength of current evidence

4. BENEFITS
- Evidence-based benefits specific to this treatment goal
- Experiential and therapeutic mechanisms

5. RISKS & CONTRAINDICATIONS
- Medical risks
- Psychological risks
- Absolute contraindications
- Relative contraindications

6. PRACTITIONER NOTES
- Key clinical considerations for this specific case
- Monitoring recommendations
- Red flags to watch for

Format your response clearly with headers for each section. Be thorough, evidence-based, and clinically useful. This report is for a trained practitioner, not a patient.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const reportText = message.content[0].text;

    // Save to database
    const result = await pool.query(
      `INSERT INTO treatment_reports (client_id, treatment_goal, psychedelic, medications, report, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [client_id, treatment_goal, psychedelic, JSON.stringify(medications), reportText]
    );

    res.json({
      report: reportText,
      report_id: result.rows[0].id
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all reports for a client
router.get('/client/:client_id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM treatment_reports WHERE client_id = $1 ORDER BY created_at DESC',
      [req.params.client_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single report
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM treatment_reports WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
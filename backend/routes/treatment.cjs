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

A practitioner is requesting a detailed treatment intelligence report. Here are the details:

TREATMENT GOAL: ${treatment_goal}

SELECTED PSYCHEDELIC: ${psychedelic}

CURRENT MEDICATIONS:
${medications.length > 0 ? medications.map(m => `- ${m.name}${m.dosage ? ` ${m.dosage}` : ''}`).join('\n') : '- No medications listed'}

You MUST format your response using EXACTLY these section headers, in this order, with nothing before the first header:

## DRUG INTERACTIONS

For each medication listed, provide a structured entry:
- Medication name and dose
- Severity: CONTRAINDICATED / HIGH CAUTION / CAUTION / MONITOR / LOW RISK
- Mechanism of interaction
- Clinical recommendation

If any medications are CONTRAINDICATED, add a prominent warning at the top of this section.

## RECOMMENDED PROTOCOL

Include all of the following:
- Recommended dose range for ${psychedelic} specific to the treatment goal
- Session structure (number of sessions, duration, spacing)
- Preparation phase (number of prep sessions, key focus areas, set and setting guidance)
- Medicine session guidance (mindset, environment, music, support)
- Integration phase (recommended integration sessions, timeline, key themes to explore)
- Practitioner role during session

## EVIDENCE BASE

Include:
- Summary of published research on ${psychedelic} for this treatment goal
- Key studies and their outcomes (Johns Hopkins, MAPS, Imperial College, etc.)
- Current strength of evidence (strong / moderate / emerging / limited)
- Relevant mechanisms of action

## BENEFITS

Include:
- Evidence-based therapeutic benefits specific to this treatment goal
- Reported experiential benefits
- Neurobiological mechanisms behind therapeutic effects
- Expected timeline for benefits

## RISKS & CONTRAINDICATIONS

Include:
- Medical risks and contraindications
- Psychological risks
- Absolute contraindications
- Relative contraindications
- Risk mitigation strategies

## PRACTITIONER NOTES

Include:
- Key clinical considerations specific to this case
- What to monitor before, during, and after the session
- Red flags requiring intervention
- Recommended screening tools
- Follow-up care recommendations

Be thorough, evidence-based, and clinically detailed. This report is for a trained practitioner, not a patient. Do not truncate any section.`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      messages: [
        { role: 'user', content: prompt }
      ]
    });

    const reportText = message.content[0].text;

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
'use strict';
/**
 * VEN-M Correspondence & Contract Management System
 * Listens on PORT (default 4080)
 * kevan@unykorn.com via Zoho Mail API
 */

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');

const emailRoutes    = require('./routes/email');
const contactRoutes  = require('./routes/contacts');
const contractRoutes = require('./routes/contracts');

const app  = express();
const PORT = process.env.PORT || 4080;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Simple auth check — attach X-Comms-Secret header (or skip for local dev)
app.use((req, res, next) => {
  const secret = process.env.COMMS_SECRET;
  if (!secret || req.path === '/health') return next();
  const provided = req.headers['x-comms-secret'];
  if (provided !== secret) return res.status(401).json({ error: 'Unauthorized' });
  next();
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/email',     emailRoutes);
app.use('/api/contacts',  contactRoutes);
app.use('/api/contracts', contractRoutes);

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    ok:        true,
    system:    'VEN-M Comms',
    version:   '1.0.0',
    from:      process.env.ZOHO_FROM_ADDRESS,
    tokenReady: !!process.env.ZOHO_REFRESH_TOKEN,
    time:      new Date().toISOString(),
  });
});

// ── Pipeline dashboard ────────────────────────────────────────────────────────
app.get('/pipeline', (req, res) => {
  const contacts  = require('./lib/contacts');
  const contracts = require('./lib/contracts');
  const corr      = require('./lib/correspondence');

  const allContacts  = contacts.list();
  const allContracts = contracts.list();
  const allCorr      = corr.list();

  const stageMap = {};
  for (const s of contacts.VALID_STAGES) {
    stageMap[s] = allContacts.filter(c => c.stage === s).length;
  }

  res.json({
    ok:          true,
    pipeline:    stageMap,
    contracts:   contracts.summary(),
    emails_sent: allCorr.filter(e => e.direction === 'outbound').length,
    total_contacts: allContacts.length,
    active: allContacts.filter(c => !['funded','declined','stalled'].includes(c.stage)).length,
  });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  VEN-M Comms System`);
  console.log(`  ─────────────────────────────────────`);
  console.log(`  Port:    ${PORT}`);
  console.log(`  From:    ${process.env.ZOHO_FROM_ADDRESS || '(not set)'}`);
  console.log(`  Token:   ${process.env.ZOHO_REFRESH_TOKEN ? 'READY' : 'MISSING — run: npm run oauth'}`);
  console.log(`  Health:  http://localhost:${PORT}/health`);
  console.log(`  Pipeline:http://localhost:${PORT}/pipeline`);
  console.log(`  ─────────────────────────────────────\n`);
});

module.exports = app;

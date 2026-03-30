'use strict';
const express   = require('express');
const router    = express.Router();
const contacts  = require('../lib/contacts');

// ── GET /api/contacts ─────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  const { stage, category } = req.query;
  let list;
  if (stage)    list = contacts.byStage(stage);
  else if (category) list = contacts.byCategory(category);
  else list = contacts.list();
  res.json({ ok: true, count: list.length, contacts: list });
});

// ── GET /api/contacts/stages ─ enum reference ─────────────────────────────────
router.get('/stages', (req, res) => {
  res.json({ stages: contacts.VALID_STAGES, categories: contacts.LENDER_CATEGORIES });
});

// ── GET /api/contacts/:id ─────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const c = contacts.get(req.params.id);
  if (!c) return res.status(404).json({ error: 'Contact not found' });
  res.json({ ok: true, contact: c });
});

// ── POST /api/contacts ────────────────────────────────────────────────────────
router.post('/', (req, res) => {
  try {
    const c = contacts.create(req.body);
    res.status(201).json({ ok: true, contact: c });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── PATCH /api/contacts/:id/stage ─────────────────────────────────────────────
router.patch('/:id/stage', (req, res) => {
  try {
    const { stage } = req.body;
    if (!stage) return res.status(400).json({ error: 'stage required' });
    const c = contacts.advanceStage(req.params.id, stage);
    if (!c) return res.status(404).json({ error: 'Contact not found' });
    res.json({ ok: true, contact: c });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── PATCH /api/contacts/:id ───────────────────────────────────────────────────
router.patch('/:id', (req, res) => {
  const c = contacts.patch(req.params.id, req.body);
  if (!c) return res.status(404).json({ error: 'Contact not found' });
  res.json({ ok: true, contact: c });
});

// ── DELETE /api/contacts/:id ──────────────────────────────────────────────────
router.delete('/:id', (req, res) => {
  const removed = contacts.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Contact not found' });
  res.json({ ok: true });
});

module.exports = router;

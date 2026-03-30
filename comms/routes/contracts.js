'use strict';
const express   = require('express');
const router    = express.Router();
const contracts = require('../lib/contracts');
const zoho      = require('../lib/zoho');
const tmpl      = require('../lib/templates');
const corr      = require('../lib/correspondence');
const contacts  = require('../lib/contacts');

// ── GET /api/contracts ────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  const { status, type, contactId, owner, system, lane } = req.query;
  let list;
  if (status)    list = contracts.byStatus(status);
  else if (type) list = contracts.byType(type);
  else if (owner) list = contracts.byOwner(owner);
  else if (system) list = contracts.bySystem(system);
  else if (lane) list = contracts.byLane(lane);
  else if (contactId) list = contracts.byContact(contactId);
  else list = contracts.list();
  res.json({ ok: true, count: list.length, contracts: list });
});

// ── GET /api/contracts/summary ────────────────────────────────────────────────
router.get('/summary', (req, res) => {
  res.json({ ok: true, summary: contracts.summary() });
});

// ── GET /api/contracts/types ─ enum reference ─────────────────────────────────
router.get('/types', (req, res) => {
  res.json({ types: contracts.CONTRACT_TYPES, statuses: contracts.CONTRACT_STATUSES });
});

// ── GET /api/contracts/policy ── offered contract matrix and ownership model
router.get('/policy', (req, res) => {
  res.json({ ok: true, policy: contracts.policyMatrix() });
});

// ── GET /api/contracts/:id ────────────────────────────────────────────────────
router.get('/:id', (req, res) => {
  const c = contracts.get(req.params.id);
  if (!c) return res.status(404).json({ error: 'Contract not found' });
  res.json({ ok: true, contract: c });
});

// ── POST /api/contracts ───────────────────────────────────────────────────────
router.post('/', (req, res) => {
  try {
    const c = contracts.create(req.body);
    res.status(201).json({ ok: true, contract: c });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── PATCH /api/contracts/:id/status ──────────────────────────────────────────
router.patch('/:id/status', (req, res) => {
  try {
    const { status, note } = req.body;
    if (!status) return res.status(400).json({ error: 'status required' });
    const c = contracts.transition(req.params.id, status, note || '');
    if (!c) return res.status(404).json({ error: 'Contract not found' });
    res.json({ ok: true, contract: c });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── PATCH /api/contracts/:id/file ─────────────────────────────────────────────
router.patch('/:id/file', (req, res) => {
  const { filePath } = req.body;
  if (!filePath) return res.status(400).json({ error: 'filePath required' });
  const c = contracts.setFile(req.params.id, filePath);
  if (!c) return res.status(404).json({ error: 'Contract not found' });
  res.json({ ok: true, contract: c });
});

// ── POST /api/contracts/:id/send-nda-cover ────────────────────────────────────
// Sends the NDA cover email AND marks the NDA contract as "sent"
router.post('/:id/send-nda-cover', async (req, res) => {
  try {
    const contract = contracts.get(req.params.id);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });
    if (contract.type !== 'nda') return res.status(400).json({ error: 'Contract is not an NDA' });

    const contact = contract.contactId ? contacts.get(contract.contactId) : null;
    if (!contact) return res.status(400).json({ error: 'Contact not found on this contract' });

    const { subject, html } = tmpl.ndaTransmittal({
      recipientName: contact.name,
      organization:  contact.organization,
    });

    await zoho.sendEmail({ to: contact.email, subject, html });
    contracts.transition(req.params.id, 'sent', 'NDA cover email delivered via Zoho');
    contacts.advanceStage(contract.contactId, 'nda_sent');
    contacts.recordContact(contract.contactId);
    corr.log({
      direction:   'outbound',
      contactId:   contract.contactId,
      contactName: contact.name,
      to:          contact.email,
      from:        process.env.ZOHO_FROM_ADDRESS,
      subject,
      type:        'nda',
      contractId:  contract.id,
    });

    res.json({ ok: true, contractStatus: 'sent', contactStage: 'nda_sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

'use strict';
const express  = require('express');
const router   = express.Router();
const intake   = require('../lib/intake');
const zoho     = require('../lib/zoho');
const tmpl     = require('../lib/templates');
const corr     = require('../lib/correspondence');
const contracts = require('../lib/contracts');

// ── GET /api/intake ── list all, with optional filters
router.get('/', (req, res) => {
  const { type, assignedTo, stage, system, lane } = req.query;
  let list;
  if (type)       list = intake.byType(type);
  else if (assignedTo) list = intake.byAssignee(assignedTo);
  else if (stage) list = intake.byStage(stage);
  else if (lane) list = intake.byLane(lane);
  else if (system) list = intake.bySystem(system);
  else            list = intake.list();
  res.json({ ok: true, count: list.length, clients: list });
});

// ── GET /api/intake/summary ── counts by type/system/assignee
router.get('/summary', (req, res) => {
  res.json({ ok: true, summary: intake.summary() });
});

// ── GET /api/intake/types ── reference data for client apps
router.get('/types', (req, res) => {
  res.json({
    types:              intake.CLIENT_TYPES,
    stagesByType:       intake.STAGES_BY_TYPE,
    requiredDocsByType: intake.REQUIRED_DOCS_BY_TYPE,
    contractsByType:    intake.CONTRACTS_BY_TYPE,
    systemByType:       intake.SYSTEM_BY_TYPE,
    operatingLaneByType: intake.OPERATING_LANE_BY_TYPE,
    defaultAssignee:    intake.DEFAULT_ASSIGNEE,
  });
});

// ── GET /api/intake/lanes ── explicit AI vs core system grouping
router.get('/lanes', (req, res) => {
  res.json({
    ok: true,
    lanes: {
      core_system: intake.byLane('core_system'),
      ai_system: intake.byLane('ai_system'),
    },
  });
});

// ── GET /api/intake/:id ── single record
router.get('/:id', (req, res) => {
  const c = intake.get(req.params.id);
  if (!c) return res.status(404).json({ error: 'Client not found' });
  res.json({ ok: true, client: c });
});

// ── POST /api/intake ── create new intake record, send confirmation email
router.post('/', async (req, res) => {
  try {
    const client = intake.create(req.body);

    // Auto-create a draft NDA contract record for lender / client / sales types
    if (['lender', 'client', 'sales'].includes(client.type)) {
      const ndaRecord = contracts.create({
        type:        'nda',
        contactName: client.name,
        notes:       `Auto-created on intake — ${client.type} type`,
      });
      intake.linkContract(client.id, ndaRecord.id);
    }

    // Send intake confirmation email to the new client
    try {
      const { subject, html } = tmpl.intakeConfirmation({
        name:       client.name,
        type:       client.type,
        assignedTo: client.assignedTo,
        product:    client.product,
      });
      await zoho.sendEmail({ to: client.email, subject, html });
      corr.log({
        direction:   'outbound',
        contactName: client.name,
        to:          client.email,
        from:        process.env.ZOHO_FROM_ADDRESS,
        subject,
        type:        'intake_confirmation',
        clientId:    client.id,
      });
    } catch (emailErr) {
      console.warn('[intake] confirmation email failed:', emailErr.message);
    }

    res.status(201).json({ ok: true, client });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── PATCH /api/intake/:id ── update fields
router.patch('/:id', (req, res) => {
  try {
    const c = intake.patch(req.params.id, req.body);
    if (!c) return res.status(404).json({ error: 'Client not found' });
    res.json({ ok: true, client: c });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── PATCH /api/intake/:id/stage ── advance pipeline stage
router.patch('/:id/stage', (req, res) => {
  try {
    const { stage } = req.body;
    if (!stage) return res.status(400).json({ error: 'stage required' });
    const c = intake.advanceStage(req.params.id, stage);
    if (!c) return res.status(404).json({ error: 'Client not found' });
    res.json({ ok: true, client: c });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── POST /api/intake/:id/doc ── mark a required document as received
router.post('/:id/doc', (req, res) => {
  const { doc } = req.body;
  if (!doc) return res.status(400).json({ error: 'doc name required' });
  const c = intake.receiveDoc(req.params.id, doc);
  if (!c) return res.status(404).json({ error: 'Client not found' });
  res.json({ ok: true, client: c });
});

// ── DELETE /api/intake/:id ── remove a record
router.delete('/:id', (req, res) => {
  const removed = intake.remove(req.params.id);
  if (!removed) return res.status(404).json({ error: 'Client not found' });
  res.json({ ok: true });
});

module.exports = router;

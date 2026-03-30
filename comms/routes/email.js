'use strict';
const express    = require('express');
const router     = express.Router();
const zoho       = require('../lib/zoho');
const contacts   = require('../lib/contacts');
const templates  = require('../lib/templates');
const corr       = require('../lib/correspondence');

// ── POST /api/email/send ─ raw send ───────────────────────────────────────────
router.post('/send', async (req, res) => {
  try {
    const { to, subject, html } = req.body;
    if (!to || !subject || !html) return res.status(400).json({ error: 'to, subject, html required' });
    const result = await zoho.sendEmail({ to, subject, html });
    res.json({ ok: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/email/outreach ─ send initial outreach to a contact ─────────────
router.post('/outreach', async (req, res) => {
  try {
    const { contactId } = req.body;
    if (!contactId) return res.status(400).json({ error: 'contactId required' });

    const contact = contacts.get(contactId);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    const { subject, html } = templates.outreach({
      recipientName:   contact.name,
      organization:    contact.organization,
      lenderCategory:  contact.category.replace('_', ' '),
    });

    await zoho.sendEmail({ to: contact.email, subject, html });

    contacts.advanceStage(contactId, 'outreach_sent');
    contacts.recordContact(contactId);
    corr.log({
      direction:   'outbound',
      contactId,
      contactName: contact.name,
      to:          contact.email,
      from:        process.env.ZOHO_FROM_ADDRESS,
      subject,
      type:        'outreach',
    });

    res.json({ ok: true, stage: 'outreach_sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/email/nda ─ send NDA cover email ────────────────────────────────
router.post('/nda', async (req, res) => {
  try {
    const { contactId } = req.body;
    if (!contactId) return res.status(400).json({ error: 'contactId required' });

    const contact = contacts.get(contactId);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    const { subject, html } = templates.ndaTransmittal({
      recipientName: contact.name,
      organization:  contact.organization,
    });

    await zoho.sendEmail({ to: contact.email, subject, html });

    contacts.advanceStage(contactId, 'nda_sent');
    contacts.recordContact(contactId);
    corr.log({
      direction:   'outbound',
      contactId,
      contactName: contact.name,
      to:          contact.email,
      from:        process.env.ZOHO_FROM_ADDRESS,
      subject,
      type:        'nda',
    });

    res.json({ ok: true, stage: 'nda_sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/email/packet ─ send diligence packet ────────────────────────────
router.post('/packet', async (req, res) => {
  try {
    const { contactId } = req.body;
    if (!contactId) return res.status(400).json({ error: 'contactId required' });

    const contact = contacts.get(contactId);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    const { subject, html } = templates.diligencePacket({
      recipientName: contact.name,
      organization:  contact.organization,
    });

    await zoho.sendEmail({ to: contact.email, subject, html });

    contacts.advanceStage(contactId, 'packet_sent');
    contacts.recordContact(contactId);
    corr.log({
      direction:   'outbound',
      contactId,
      contactName: contact.name,
      to:          contact.email,
      from:        process.env.ZOHO_FROM_ADDRESS,
      subject,
      type:        'packet',
    });

    res.json({ ok: true, stage: 'packet_sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/email/follow-up ─────────────────────────────────────────────────
router.post('/follow-up', async (req, res) => {
  try {
    const { contactId } = req.body;
    if (!contactId) return res.status(400).json({ error: 'contactId required' });

    const contact = contacts.get(contactId);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    const lastMs        = contact.lastContactAt ? new Date(contact.lastContactAt).getTime() : null;
    const daysSinceLast = lastMs ? Math.floor((Date.now() - lastMs) / 86400000) : null;

    const { subject, html } = templates.followUp({
      recipientName:  contact.name,
      organization:   contact.organization,
      daysSinceLast,
      stage:          contact.stage,
    });

    await zoho.sendEmail({ to: contact.email, subject, html });

    contacts.recordContact(contactId);
    corr.log({
      direction:   'outbound',
      contactId,
      contactName: contact.name,
      to:          contact.email,
      from:        process.env.ZOHO_FROM_ADDRESS,
      subject,
      type:        'follow_up',
    });

    res.json({ ok: true, daysSinceLast });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/email/general ─ free-form email to a contact ───────────────────
router.post('/general', async (req, res) => {
  try {
    const { contactId, subjectLine, bodyText } = req.body;
    if (!contactId || !bodyText) return res.status(400).json({ error: 'contactId, bodyText required' });

    const contact = contacts.get(contactId);
    if (!contact) return res.status(404).json({ error: 'Contact not found' });

    const { subject, html } = templates.general({
      recipientName: contact.name,
      organization:  contact.organization,
      subject:       subjectLine,
      bodyText,
    });

    await zoho.sendEmail({ to: contact.email, subject, html });

    contacts.recordContact(contactId);
    corr.log({
      direction:   'outbound',
      contactId,
      contactName: contact.name,
      to:          contact.email,
      from:        process.env.ZOHO_FROM_ADDRESS,
      subject,
      type:        'general',
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/email/inbox ──────────────────────────────────────────────────────
router.get('/inbox', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const inbox = await zoho.getInbox(limit);
    res.json({ ok: true, messages: inbox });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── GET /api/email/log ─ correspondence log ───────────────────────────────────
router.get('/log', (req, res) => {
  const { contactId, contractId } = req.query;
  let log;
  if (contactId)  log = corr.byContact(contactId);
  else if (contractId) log = corr.byContract(contractId);
  else log = corr.list();
  res.json({ ok: true, count: log.length, log });
});

module.exports = router;

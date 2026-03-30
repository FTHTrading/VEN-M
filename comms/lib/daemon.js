'use strict';
/**
 * daemon.js — Inbound email polling daemon
 *
 * Polls the Zoho inbox every 60 seconds.
 * When a reply from a known lender contact is detected:
 *   1. Advances their pipeline stage
 *   2. Auto-sends the next appropriate email template
 *   3. Logs every action to data/daemon.log
 *
 * Stage progression:
 *   prospect   → interested  (sends NDA Transmittal)
 *   nda_sent   → diligence   (sends Diligence Packet)
 *   diligence  → review      (sends Follow-Up)
 *   review     → term_sheet  (sends Term Sheet Ack)
 */

const fs    = require('fs');
const path  = require('path');
const zoho  = require('./zoho');
const templates = require('./templates');

const CONTACTS_FILE  = path.join(__dirname, '../data/contacts.json');
const STATE_FILE     = path.join(__dirname, '../data/daemon-state.json');
const LOG_FILE       = path.join(__dirname, '../data/daemon.log');
const POLL_MS        = 60_000;   // 60 seconds

// ── Stage auto-response map ───────────────────────────────────────────────────
const STAGE_MAP = {
  prospect:   { next: 'nda_sent',    template: 'ndaTransmittal',  label: 'NDA Transmittal' },
  interested: { next: 'nda_sent',    template: 'ndaTransmittal',  label: 'NDA Transmittal' },
  nda_sent:   { next: 'diligence',   template: 'diligencePacket', label: 'Diligence Packet' },
  diligence:  { next: 'review',      template: 'followUp',        label: 'Follow-Up' },
  review:     { next: 'term_sheet',  template: 'termSheetAck',    label: 'Term Sheet Ack' },
};

// ── Logger ────────────────────────────────────────────────────────────────────
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log('[daemon]', msg);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

// ── State persistence (tracks last seen message time) ────────────────────────
function loadState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
  } catch {
    return { lastCheckedAt: new Date(Date.now() - POLL_MS).toISOString(), processedIds: [] };
  }
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

// ── Load contacts ─────────────────────────────────────────────────────────────
function loadContacts() {
  return JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf8'));
}

function saveContacts(contacts) {
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
}

// ── Find contact by sender email ──────────────────────────────────────────────
function findContact(contacts, fromEmail) {
  const addr = (fromEmail || '').toLowerCase().trim();
  return contacts.find(c => c.email && c.email.toLowerCase() === addr);
}

// ── Build and send the auto-response ─────────────────────────────────────────
async function sendAutoResponse(contact, templateKey) {
  const builder = templates[templateKey];
  if (!builder) {
    log(`WARN: No template function found for key="${templateKey}" — skipping`);
    return;
  }

  const { subject, html } = builder({
    recipientName:  contact.name,
    organization:   contact.organization,
    lenderCategory: contact.category || 'specialty asset',
  });

  await zoho.sendEmail({ to: contact.email, subject, html });
  log(`AUTO-SENT "${subject}" → ${contact.email}`);
}

// ── Poll cycle ────────────────────────────────────────────────────────────────
async function poll() {
  log('polling inbox...');

  const state    = loadState();
  const contacts = loadContacts();
  let   updated  = false;

  let inboxData;
  try {
    inboxData = await zoho.getInbox(50);
  } catch (err) {
    log(`ERROR fetching inbox: ${err.message}`);
    return;
  }

  const messages = inboxData?.data || [];
  const newMessages = messages.filter(m => {
    if (state.processedIds.includes(String(m.messageId))) return false;
    const recvTime = new Date(Number(m.receivedTime)).toISOString();
    return recvTime > state.lastCheckedAt;
  });

  log(`found ${newMessages.length} new message(s)`);

  for (const msg of newMessages) {
    const fromEmail = msg.fromAddress?.trim();
    const subject   = msg.subject || '(no subject)';
    const msgId     = String(msg.messageId);
    const recvTime  = new Date(Number(msg.receivedTime)).toISOString();

    state.processedIds.push(msgId);

    // Keep processedIds from growing unbounded (cap at 500)
    if (state.processedIds.length > 500) {
      state.processedIds = state.processedIds.slice(-500);
    }

    log(`MSG [${msgId}] from="${fromEmail}" subj="${subject}"`);

    const contact = findContact(contacts, fromEmail);
    if (!contact) {
      log(`  → unknown sender, skipping auto-response`);
      continue;
    }

    const stageAction = STAGE_MAP[contact.stage];
    if (!stageAction) {
      log(`  → contact "${contact.name}" is at terminal stage "${contact.stage}", no auto-response`);
      continue;
    }

    log(`  → MATCH: ${contact.name} (${contact.organization}) stage="${contact.stage}" → advancing to "${stageAction.next}"`);

    try {
      await sendAutoResponse(contact, stageAction.template);

      // Advance stage
      contact.stage          = stageAction.next;
      contact.updatedAt      = new Date().toISOString();
      contact.lastContactAt  = recvTime;
      contact.correspondenceCount = (contact.correspondenceCount || 0) + 1;
      contact.notes = [
        contact.notes || '',
        `[${recvTime}] Auto-replied with ${stageAction.label} after inbound email: "${subject}"`,
      ].filter(Boolean).join('\n');

      updated = true;
      log(`  ✓ Advanced stage to "${contact.stage}" and updated contact`);
    } catch (err) {
      log(`  ERROR auto-sending to ${contact.email}: ${err.message}`);
    }
  }

  if (updated) {
    saveContacts(contacts);
    log('contacts.json updated');
  }

  // Update last checked timestamp to the most recent message received time
  const timestamps = messages
    .map(m => Number(m.receivedTime))
    .filter(Boolean);
  if (timestamps.length) {
    state.lastCheckedAt = new Date(Math.max(...timestamps)).toISOString();
  } else {
    state.lastCheckedAt = new Date().toISOString();
  }

  saveState(state);
}

// ── Start daemon loop ─────────────────────────────────────────────────────────
async function start() {
  log('=== VEN-M Inbound Email Daemon starting ===');
  log(`Poll interval: ${POLL_MS / 1000}s | Contact file: ${CONTACTS_FILE}`);

  // Run immediately on start, then on interval
  await poll().catch(err => log(`ERROR in poll: ${err.message}`));

  setInterval(() => {
    poll().catch(err => log(`ERROR in poll: ${err.message}`));
  }, POLL_MS);
}

module.exports = { start, poll };

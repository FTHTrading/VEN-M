'use strict';

const fs = require('fs');
const path = require('path');
const zoho = require('./zoho');
const corr = require('./correspondence');

const STATE_FILE = path.join(__dirname, '../data/vendor-daemon-state.json');
const REPORT_FILE = path.join(__dirname, '../data/vendor-replies.json');
const LOG_FILE = path.join(__dirname, '../data/vendor-daemon.log');
const POLL_MS = Number(process.env.VENDOR_DAEMON_POLL_MS || 120000);

const WATCH_EXACT = new Set([
  'pemchuila.rs@zohocorp.com',
  'ebenezer.mohan@zohocorp.com',
  'support@zohomail.com',
  'noreply@zoho.com',
]);

const WATCH_DOMAINS = ['@zohocorp.com', '@zoho.com', '@zohomail.com', '@zohoaccounts.com'];

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log('[vendor-daemon]', msg);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

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

function readReport() {
  try {
    return JSON.parse(fs.readFileSync(REPORT_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeReport(items) {
  fs.writeFileSync(REPORT_FILE, JSON.stringify(items, null, 2));
}

function isZohoSender(email) {
  const from = String(email || '').toLowerCase().trim();
  if (!from) return false;
  if (WATCH_EXACT.has(from)) return true;
  return WATCH_DOMAINS.some((d) => from.endsWith(d));
}

function isRelevantSubject(subject) {
  const s = String(subject || '').toLowerCase();
  return /(outgoing|blocked|freeze|pricing|price|plan|subscription|billing|limit|restriction|support|clarification|team)/.test(s);
}

async function notifyTeam(entry) {
  const notify = String(process.env.VENDOR_DAEMON_NOTIFY || 'true').toLowerCase() !== 'false';
  if (!notify) return;

  const to = [process.env.ZOHO_FROM_ADDRESS || 'kevan@unykorn.org', 'buckvaughan3636@gmail.com'];
  const subject = `[Vendor Reply] ${entry.subject || 'No subject'}`;
  const html = `
    <p><strong>Vendor reply detected</strong> by the monitor daemon.</p>
    <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
      <tr><td><strong>From</strong></td><td>${entry.from}</td></tr>
      <tr><td><strong>Received</strong></td><td>${entry.at}</td></tr>
      <tr><td><strong>Subject</strong></td><td>${entry.subject}</td></tr>
      <tr><td><strong>Summary</strong></td><td>${entry.summary || '(none)'}</td></tr>
      <tr><td><strong>Message ID</strong></td><td>${entry.messageId}</td></tr>
    </table>
    <p>This was auto-logged to <code>comms/data/vendor-replies.json</code>.</p>
  `;

  await zoho.sendEmail({ to, subject, html });
  corr.log({
    direction: 'outbound',
    contactName: 'Internal Team Alert',
    to: to.join(','),
    from: process.env.ZOHO_FROM_ADDRESS,
    subject,
    type: 'vendor_reply_alert',
    notes: `Auto-alert for vendor reply messageId=${entry.messageId}`,
  });
}

async function poll() {
  const state = loadState();
  log('polling inbox for vendor replies...');

  let inboxData;
  try {
    inboxData = await zoho.getInbox(100);
  } catch (err) {
    log(`ERROR fetching inbox: ${err.message}`);
    return;
  }

  const messages = inboxData?.data || [];
  const newMessages = messages.filter((m) => {
    const id = String(m.messageId);
    if (state.processedIds.includes(id)) return false;
    const recvIso = new Date(Number(m.receivedTime)).toISOString();
    return recvIso > state.lastCheckedAt;
  });

  let report = readReport();
  let found = 0;

  for (const msg of newMessages) {
    const id = String(msg.messageId);
    const from = String(msg.fromAddress || '').toLowerCase().trim();
    const subject = msg.subject || '';
    const summary = msg.summary || '';
    const at = new Date(Number(msg.receivedTime)).toISOString();

    state.processedIds.push(id);
    if (state.processedIds.length > 800) state.processedIds = state.processedIds.slice(-800);

    if (!isZohoSender(from)) continue;
    if (!isRelevantSubject(subject) && !isRelevantSubject(summary)) continue;

    const entry = { messageId: id, from, subject, summary, at };
    report.push(entry);
    found += 1;
    log(`vendor reply captured: ${from} | ${subject}`);

    try {
      await notifyTeam(entry);
    } catch (err) {
      log(`WARN notify failed: ${err.message}`);
    }
  }

  if (found > 0) {
    writeReport(report);
    log(`saved ${found} new vendor reply item(s)`);
  }

  const times = messages.map((m) => Number(m.receivedTime)).filter(Boolean);
  state.lastCheckedAt = times.length ? new Date(Math.max(...times)).toISOString() : new Date().toISOString();
  saveState(state);
}

async function start() {
  log('=== Vendor reply daemon starting ===');
  log(`Poll interval: ${POLL_MS / 1000}s`);
  await poll().catch((err) => log(`ERROR in poll: ${err.message}`));
  setInterval(() => poll().catch((err) => log(`ERROR in poll: ${err.message}`)), POLL_MS);
}

module.exports = { start, poll };

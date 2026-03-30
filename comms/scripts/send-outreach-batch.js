'use strict';
/**
 * send-outreach-batch.js — Send initial outreach email to lender prospects
 *
 * Usage:
 *   node scripts/send-outreach-batch.js               — sends to ALL contacts at 'prospect' stage
 *   node scripts/send-outreach-batch.js --id <uuid>   — sends to ONE contact by ID
 *   node scripts/send-outreach-batch.js --dry-run     — preview queue without sending
 *   node scripts/send-outreach-batch.js --category specialty_asset  — filter by category
 *
 * Rate: waits 3 seconds between sends to respect Zoho API limits.
 * Safe to run again — contacts already at 'outreach_sent' or beyond are skipped.
 */

require('dotenv').config();
const contacts  = require('../lib/contacts');
const templates = require('../lib/templates');
const zoho      = require('../lib/zoho');
const corr      = require('../lib/correspondence');

const DRY_RUN   = process.argv.includes('--dry-run');
const args      = process.argv.slice(2);

function arg(name) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : null;
}

const TARGET_ID       = arg('id');
const TARGET_CATEGORY = arg('category');

const SEND_DELAY_MS = 3000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const CATEGORY_LABELS = {
  specialty_asset: 'specialty asset / hard asset',
  trade_finance:   'trade finance and commodity',
  private_credit:  'private credit and direct lending',
  dfi:             'development finance',
  family_office:   'family office and private wealth',
  other:           'institutional lending',
};

async function main() {
  console.log('\n  VEN-M — Lender Outreach Batch Sender');
  console.log('  ──────────────────────────────────────────');

  let queue;

  if (TARGET_ID) {
    const contact = contacts.get(TARGET_ID);
    if (!contact) {
      console.error(`  ERROR: Contact ${TARGET_ID} not found`);
      process.exit(1);
    }
    queue = [contact];
  } else {
    const all = contacts.list();
    queue = all.filter(c => {
      if (c.stage !== 'prospect') return false;           // skip already actioned
      if (TARGET_CATEGORY && c.category !== TARGET_CATEGORY) return false;
      return true;
    });
  }

  if (queue.length === 0) {
    console.log('  No contacts in prospect stage to send to.');
    if (TARGET_CATEGORY) console.log(`  (filtered by category: ${TARGET_CATEGORY})`);
    console.log();
    return;
  }

  console.log(`  Queue: ${queue.length} contact(s) to send outreach to\n`);

  // Print queue preview
  const catMap = {};
  queue.forEach(c => {
    catMap[c.category] = (catMap[c.category] || 0) + 1;
  });
  Object.entries(catMap).forEach(([cat, n]) => {
    console.log(`    ${String(n).padStart(2)}x  ${CATEGORY_LABELS[cat] || cat}`);
  });
  console.log();

  if (DRY_RUN) {
    console.log('  DRY RUN — emails below would be sent:\n');
    queue.forEach((c, i) => {
      const { subject } = templates.outreach({
        recipientName:  c.name,
        organization:   c.organization || '—',
        lenderCategory: CATEGORY_LABELS[c.category] || c.category,
      });
      console.log(`  ${String(i + 1).padStart(2)}. ${c.organization}`);
      console.log(`      To:      ${c.email}`);
      console.log(`      Subject: ${subject}`);
      console.log();
    });
    return;
  }

  // Confirm before sending
  console.log(`  About to send ${queue.length} outreach email(s) via Zoho from: ${process.env.ZOHO_FROM_ADDRESS}`);
  console.log('  Press ENTER to continue or Ctrl+C to cancel...');

  await new Promise(resolve => {
    process.stdin.resume();
    process.stdin.once('data', () => {
      process.stdin.pause();
      resolve();
    });
  });

  console.log();

  let sent = 0;
  let failed = 0;

  for (let i = 0; i < queue.length; i++) {
    const contact = queue[i];
    console.log(`  [${i + 1}/${queue.length}] ${contact.organization} — ${contact.email}`);

    try {
      const { subject, html } = templates.outreach({
        recipientName:  contact.name,
        organization:   contact.organization || '—',
        lenderCategory: CATEGORY_LABELS[contact.category] || contact.category,
      });

      await zoho.sendEmail({ to: contact.email, subject, html });

      contacts.advanceStage(contact.id, 'outreach_sent');
      contacts.recordContact(contact.id);

      corr.log({
        direction:   'outbound',
        contactId:   contact.id,
        contactName: contact.name,
        to:          contact.email,
        from:        process.env.ZOHO_FROM_ADDRESS,
        subject,
        type:        'outreach',
      });

      console.log(`         ✓ Sent — stage → outreach_sent`);
      sent++;

      if (i < queue.length - 1) {
        process.stdout.write(`         Waiting ${SEND_DELAY_MS / 1000}s...`);
        await sleep(SEND_DELAY_MS);
        process.stdout.write(' done\n');
      }
    } catch (err) {
      console.error(`         ✗ FAILED: ${err.message}`);
      failed++;
    }
  }

  console.log();
  console.log('  ──────────────────────────────────────────');
  console.log(`  Sent: ${sent}  |  Failed: ${failed}`);
  console.log();
  console.log('  Next step: run `node scripts/status.js` to see full pipeline.');
  console.log();
}

main().catch(err => { console.error('\nFATAL:', err.message); process.exit(1); });

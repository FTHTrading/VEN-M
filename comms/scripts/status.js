'use strict';
/**
 * status.js — Pipeline status reporter
 * Run: node scripts/status.js
 */

require('dotenv').config();
const contacts  = require('../lib/contacts');
const contracts = require('../lib/contracts');
const corr      = require('../lib/correspondence');

function bar(label, count, max) {
  const filled = max > 0 ? Math.round((count / max) * 20) : 0;
  return `${'█'.repeat(filled)}${'░'.repeat(20 - filled)} ${count}`;
}

const allContacts  = contacts.list();
const allContracts = contracts.list();
const allCorr      = corr.list();

const now = new Date();
console.log(`\n  ╔══════════════════════════════════════════════════════╗`);
console.log(`  ║        VEN-M COMMS PIPELINE STATUS                  ║`);
console.log(`  ║        ${now.toISOString().slice(0,10)}  kevan@unykorn.com            ║`);
console.log(`  ╠══════════════════════════════════════════════════════╣`);

console.log('\n  LENDER PIPELINE\n');
let maxCount = 0;
const stageCounts = {};
for (const s of contacts.VALID_STAGES) {
  const count = allContacts.filter(c => c.stage === s).length;
  stageCounts[s] = count;
  if (count > maxCount) maxCount = count;
}
for (const [s, count] of Object.entries(stageCounts)) {
  console.log(`  ${s.padEnd(28)} ${bar(s, count, Math.max(maxCount, 1))}`);
}

console.log('\n  CONTRACT SUMMARY\n');
const cSummary = contracts.summary();
console.log(`  Total contracts: ${cSummary.total}`);
console.log('  By type:');
for (const [t, n] of Object.entries(cSummary.byType || {})) {
  console.log(`    ${t.padEnd(24)} ${n}`);
}
console.log('  By status:');
for (const [s, n] of Object.entries(cSummary.byStatus || {})) {
  console.log(`    ${s.padEnd(24)} ${n}`);
}

const outbound = allCorr.filter(e => e.direction === 'outbound');
console.log(`\n  CORRESPONDENCE\n`);
console.log(`  Total emails sent:  ${outbound.length}`);
console.log(`  Total contacts:     ${allContacts.length}`);
console.log(`  Active (not closed):${allContacts.filter(c => !['funded','declined','stalled'].includes(c.stage)).length}`);

if (allContacts.length > 0) {
  console.log('\n  CONTACTS\n');
  for (const c of allContacts) {
    const last = c.lastContactAt ? `  last: ${c.lastContactAt.slice(0,10)}` : '';
    console.log(`  ${c.name.padEnd(24)} ${c.stage.padEnd(22)} ${(c.organization || '').padEnd(20)}${last}`);
  }
}

console.log('\n  ──────────────────────────────────────────────────────\n');

if (!process.env.ZOHO_REFRESH_TOKEN) {
  console.log('  ⚠  ZOHO_REFRESH_TOKEN not set — run: npm run oauth\n');
}

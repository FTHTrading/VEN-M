'use strict';
/**
 * zoho-test.js — Verify the Zoho API connection and send a test email to yourself
 * Run: node scripts/zoho-test.js
 */

require('dotenv').config();
const zoho = require('../lib/zoho');

async function main() {
  console.log('\n  VEN-M — Zoho API Connection Test\n');

  console.log('  1. Refreshing access token...');
  const token = await zoho.refreshAccessToken();
  console.log(`  ✓ Token: ${token.substring(0, 16)}...`);

  console.log('  2. Fetching account ID...');
  const accountId = await zoho.getAccountId();
  console.log(`  ✓ Account ID: ${accountId}`);

  console.log('  3. Sending test email to self...');
  const from = process.env.ZOHO_FROM_ADDRESS;
  await zoho.sendEmail({
    to:      from,
    subject: `VEN-M Comms — API Test ${new Date().toISOString()}`,
    html:    `<p style="font-family:sans-serif;color:#333;">Zoho Mail API is configured and working for <strong>${from}</strong>.</p><p>VEN-M Correspondence System is ready.</p>`,
  });
  console.log('  ✓ Test email sent to', from);

  console.log('\n  ✓ All checks passed. Run: npm start\n');
}

main().catch(err => { console.error('\n  ERROR:', err.message); process.exit(1); });

'use strict';
/**
 * selfclient-oauth.js — Token exchange for Zoho Self Client apps
 *
 * Zoho Self Client apps don't use browser-based redirect OAuth.
 * They generate a short-lived grant code DIRECTLY in the Zoho API Console.
 *
 * Steps:
 *  1. Go to: https://api-console.zoho.com/
 *  2. Click on "UnykornMailAPI" → "Self Client" tab
 *  3. Click "Generate Code"
 *  4. Paste these scopes:
 *       ZohoMail.messages.CREATE,ZohoMail.messages.READ,ZohoMail.messages.ALL,ZohoMail.accounts.READ
 *  5. Set time duration to "10 Minutes"
 *  6. Copy the generated code
 *  7. Paste it into this script when prompted
 *  8. Refresh token is saved to .env automatically
 */

require('dotenv').config();
const readline = require('readline');
const axios    = require('axios');
const fs       = require('fs');
const path     = require('path');

const CLIENT_ID     = process.env.ZOHO_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\nERROR: ZOHO_CLIENT_ID or ZOHO_CLIENT_SECRET missing from .env\n');
  process.exit(1);
}

const SCOPES = 'ZohoMail.messages.CREATE,ZohoMail.messages.READ,ZohoMail.messages.ALL,ZohoMail.accounts.READ';

console.log('\n  VEN-M — Zoho Self Client Token Setup');
console.log('  ─────────────────────────────────────────────────────');
console.log('  Follow these steps:\n');
console.log('  1. Open: https://api-console.zoho.com/');
console.log('  2. Under "UnykornMailAPI" → click "Self Client" tab');
console.log('  3. Click "Generate Code"');
console.log('  4. Paste these scopes exactly:');
console.log(`\n     ${SCOPES}\n`);
console.log('  5. Duration: 10 Minutes');
console.log('  6. Click "Create" — copy the generated code');
console.log('  7. Paste it below\n');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('  Paste grant code here: ', async (code) => {
  rl.close();
  code = code.trim();

  if (!code) {
    console.error('\n  ERROR: No code entered.\n');
    process.exit(1);
  }

  console.log('\n  Exchanging grant code for tokens...');

  try {
    const params = new URLSearchParams({
      grant_type:    'authorization_code',
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri:  'http://www.zoho.com/',   // Required for Self Client type
    });

    const resp = await axios.post(
      'https://accounts.zoho.com/oauth/v2/token',
      params.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const data = resp.data;

    if (data.error) {
      throw new Error(`Zoho returned: ${data.error} — ${data.error_description || ''}`);
    }

    const refresh_token = data.refresh_token;
    const access_token  = data.access_token;

    if (!refresh_token) {
      console.error('\n  [debug] Response:', JSON.stringify(data, null, 2));
      throw new Error('No refresh_token in response. Ensure you selected "Self Client" tab and not another app type.');
    }

    // Save to .env
    const envPath = path.resolve(__dirname, '../.env');
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

    if (envContent.includes('ZOHO_REFRESH_TOKEN=')) {
      envContent = envContent.replace(/ZOHO_REFRESH_TOKEN=.*/, `ZOHO_REFRESH_TOKEN=${refresh_token}`);
    } else {
      envContent += `\nZOHO_REFRESH_TOKEN=${refresh_token}`;
    }
    fs.writeFileSync(envPath, envContent);
    process.env.ZOHO_REFRESH_TOKEN = refresh_token;

    console.log('\n  ✓ SUCCESS — Refresh token saved to .env');
    console.log(`  Access token:   ${access_token.substring(0, 20)}...`);
    console.log(`  Refresh token:  ${refresh_token.substring(0, 20)}...\n`);
    console.log('  Next steps:');
    console.log('    node scripts/zoho-test.js    ← verify connection + test email');
    console.log('    npm start                    ← start the server\n');

  } catch (err) {
    console.error('\n  ERROR:', err.message, '\n');
    process.exit(1);
  }
});

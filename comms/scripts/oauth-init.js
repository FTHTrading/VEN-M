'use strict';
/**
 * oauth-init.js — One-time Zoho OAuth2 setup wizard
 *
 * Run: node scripts/oauth-init.js
 *
 * 1. Opens the Zoho consent page in your browser
 * 2. Starts a local HTTP server to capture the callback
 * 3. Exchanges the authorization code for access_token + refresh_token
 * 4. Writes ZOHO_REFRESH_TOKEN and ZOHO_ACCOUNT_ID to comms/.env
 */

require('dotenv').config();
const http = require('http');
const path = require('path');
const fs   = require('fs');
const url  = require('url');
const axios = require('axios');

const CLIENT_ID     = process.env.ZOHO_CLIENT_ID;
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;
const REDIRECT_PORT = 9876;
const REDIRECT_URI  = `http://localhost:${REDIRECT_PORT}/callback`;

const SCOPES = [
  'ZohoMail.messages.CREATE',
  'ZohoMail.messages.READ',
  'ZohoMail.messages.ALL',
  'ZohoMail.accounts.READ',
].join(',');

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\nERROR: ZOHO_CLIENT_ID or ZOHO_CLIENT_SECRET missing from .env\n');
  process.exit(1);
}

const authUrl =
  `https://accounts.zoho.com/oauth/v2/auth` +
  `?scope=${encodeURIComponent(SCOPES)}` +
  `&client_id=${CLIENT_ID}` +
  `&response_type=code` +
  `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
  `&access_type=offline` +
  `&prompt=consent`;

console.log('\n  VEN-M Zoho OAuth Setup');
console.log('  ──────────────────────────────────────────');
console.log('  1. Opening Zoho consent page in browser...');
console.log('  2. Log in with: kevan@unykorn.com');
console.log('  3. Grant the requested permissions');
console.log('  4. Token will be saved to .env automatically\n');
console.log('  Auth URL:\n  ' + authUrl + '\n');

// Try to open browser
try {
  const { execSync } = require('child_process');
  execSync(`start "" "${authUrl}"`, { stdio: 'ignore' });
} catch {
  console.log('  Could not auto-open browser. Copy the URL above and open it manually.\n');
}

// Start callback server
const server = http.createServer(async (req, res) => {
  const parsed = url.parse(req.url, true);
  if (parsed.pathname !== '/callback') {
    res.end('Not found'); return;
  }

  const code  = parsed.query.code;
  const error = parsed.query.error;

  if (error) {
    res.writeHead(400);
    res.end(`<h2>OAuth Error: ${error}</h2>`);
    server.close();
    return;
  }

  if (!code) {
    res.writeHead(400);
    res.end('<h2>No code received.</h2>');
    server.close();
    return;
  }

  console.log('  [oauth] Authorization code received. Exchanging for tokens...');

  try {
    const params = new URLSearchParams({
      grant_type:    'authorization_code',
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri:  REDIRECT_URI,
      code,
    });

    const tokenResp = await axios.post(
      'https://accounts.zoho.com/oauth/v2/token',
      params.toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const respData = tokenResp.data;
    console.log('  [debug] Token response keys:', Object.keys(respData));

    const tokenError = respData.error;
    if (tokenError) throw new Error(tokenError);

    // Zoho may return refresh_token or access_token depending on grant type
    const refresh_token = respData.refresh_token;
    const access_token  = respData.access_token;

    if (!refresh_token) {
      console.error('\n  [debug] Full response:', JSON.stringify(respData, null, 2));
      throw new Error(
        'No refresh_token in Zoho response.\n' +
        'Ensure your Zoho app type is "Server-based Applications" (not Self Client)\n' +
        'and the redirect URI http://localhost:8080/callback is registered in the API Console.'
      );
    }

    // Write refresh_token to .env
    const envPath = path.resolve(__dirname, '../.env');
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

    if (envContent.includes('ZOHO_REFRESH_TOKEN=')) {
      envContent = envContent.replace(/ZOHO_REFRESH_TOKEN=.*/, `ZOHO_REFRESH_TOKEN=${refresh_token}`);
    } else {
      envContent += `\nZOHO_REFRESH_TOKEN=${refresh_token}`;
    }
    fs.writeFileSync(envPath, envContent);

    console.log('\n  ✓ SUCCESS');
    console.log('  Refresh token saved to .env');
    console.log(`  Refresh token: ${refresh_token.substring(0, 20)}...`);
    console.log('\n  You can now run: npm start\n');

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <html><body style="background:#0a0a0a;color:#f5f5f5;font-family:sans-serif;padding:40px;">
        <h2 style="color:#c9a84c;">OAuth Setup Complete</h2>
        <p>Refresh token saved to <code>.env</code>.</p>
        <p>You can close this window and run <strong>npm start</strong>.</p>
      </body></html>
    `);

    server.close();
  } catch (err) {
    console.error('\n  ERROR exchanging token:', err.message);
    res.writeHead(500);
    res.end(`<h2>Token exchange error: ${err.message}</h2>`);
    server.close();
  }
});

server.listen(REDIRECT_PORT, () => {
  console.log(`  Listening for Zoho callback on port ${REDIRECT_PORT}...\n`);
});

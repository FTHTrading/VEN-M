'use strict';
/**
 * zoho.js — Zoho Mail API v1 client
 *
 * Handles OAuth2 token refresh automatically.
 * Stores the current access token in memory; persists refresh token via .env.
 *
 * Zoho OAuth docs: https://www.zoho.com/mail/help/api/
 * Scopes used: ZohoMail.messages.CREATE, ZohoMail.messages.READ,
 *              ZohoMail.messages.ALL, ZohoMail.accounts.READ
 */

require('dotenv').config();
const axios = require('axios');
const fs    = require('fs');
const path  = require('path');

const ZOHO_TOKEN_URL = 'https://accounts.zoho.com/oauth/v2/token';
const ZOHO_MAIL_BASE = 'https://mail.zoho.com/api';

// ── In-memory token cache ─────────────────────────────────────────────────────
let _accessToken  = null;
let _tokenExpires = 0;          // epoch ms
let _accountId    = process.env.ZOHO_ACCOUNT_ID || null;

// ── Token refresh ─────────────────────────────────────────────────────────────
async function refreshAccessToken() {
  const { ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, ZOHO_REFRESH_TOKEN } = process.env;

  if (!ZOHO_REFRESH_TOKEN) {
    throw new Error(
      'ZOHO_REFRESH_TOKEN is not set.\n' +
      'Run: npm run oauth   in the comms/ directory to generate one.'
    );
  }

  const params = new URLSearchParams({
    grant_type:    'refresh_token',
    client_id:     ZOHO_CLIENT_ID,
    client_secret: ZOHO_CLIENT_SECRET,
    refresh_token: ZOHO_REFRESH_TOKEN,
  });

  const resp = await axios.post(ZOHO_TOKEN_URL, params.toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (resp.data.error) {
    throw new Error(`Zoho token refresh failed: ${resp.data.error}`);
  }

  _accessToken  = resp.data.access_token;
  _tokenExpires = Date.now() + (resp.data.expires_in - 60) * 1000; // 1-min buffer
  console.log('[zoho] access token refreshed, expires in', resp.data.expires_in, 's');
  return _accessToken;
}

// ── Get valid access token (auto-refresh) ─────────────────────────────────────
async function getToken() {
  if (_accessToken && Date.now() < _tokenExpires) return _accessToken;
  return refreshAccessToken();
}

// ── Authenticated request helper ──────────────────────────────────────────────
async function zohoRequest(method, path, data = null) {
  const token = await getToken();
  const config = {
    method,
    url: `${ZOHO_MAIL_BASE}${path}`,
    headers: {
      Authorization: `Zoho-oauthtoken ${token}`,
      'Content-Type': 'application/json',
    },
  };
  if (data) config.data = data;

  try {
    const resp = await axios(config);
    return resp.data;
  } catch (err) {
    const msg = err.response?.data || err.message;
    throw new Error(`Zoho API error [${method} ${path}]: ${JSON.stringify(msg)}`);
  }
}

// ── Get account ID (cached) ───────────────────────────────────────────────────
async function getAccountId() {
  if (_accountId) return _accountId;

  const data = await zohoRequest('GET', '/accounts');
  if (!data.data || !data.data.length) {
    throw new Error('No Zoho Mail accounts found for this token.');
  }

  _accountId = String(data.data[0].accountId);

  // Persist to .env for subsequent restarts
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    let envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('ZOHO_ACCOUNT_ID=')) {
      envContent = envContent.replace(/ZOHO_ACCOUNT_ID=.*/, `ZOHO_ACCOUNT_ID=${_accountId}`);
    } else {
      envContent += `\nZOHO_ACCOUNT_ID=${_accountId}`;
    }
    fs.writeFileSync(envPath, envContent);
    process.env.ZOHO_ACCOUNT_ID = _accountId;
  }

  console.log('[zoho] accountId resolved:', _accountId);
  return _accountId;
}

// ── Send email ────────────────────────────────────────────────────────────────
/**
 * @param {object} opts
 * @param {string|string[]} opts.to        - recipient address(es)
 * @param {string}          opts.subject   - email subject
 * @param {string}          opts.html      - HTML body
 * @param {string}          [opts.cc]      - CC addresses
 * @param {string}          [opts.replyTo] - reply-to address
 */
async function sendEmail({ to, subject, html, cc, replyTo }) {
  const accountId = await getAccountId();
  const fromAddress = process.env.ZOHO_FROM_ADDRESS;
  const fromName    = process.env.ZOHO_FROM_NAME;

  const toList = Array.isArray(to) ? to.join(',') : to;

  const payload = {
    fromAddress: `${fromName} <${fromAddress}>`,
    toAddress:   toList,
    subject,
    content:     html,
    mailFormat:  'html',
  };
  if (cc)      payload.ccAddress  = cc;
  if (replyTo) payload.replyTo    = replyTo;

  const result = await zohoRequest('POST', `/accounts/${accountId}/messages`, payload);
  console.log('[zoho] email sent →', toList, '|', subject);
  return result;
}

// ── Read inbox (last N messages) ──────────────────────────────────────────────
async function getInbox(limit = 20) {
  const accountId = await getAccountId();
  return zohoRequest('GET', `/accounts/${accountId}/messages/view?limit=${limit}`);
}

// ── Get thread by message ID ─────────────────────────────────────────────────
async function getMessage(messageId) {
  const accountId = await getAccountId();
  return zohoRequest('GET', `/accounts/${accountId}/messages/${messageId}`);
}

module.exports = { sendEmail, getInbox, getMessage, getToken, getAccountId, refreshAccessToken };

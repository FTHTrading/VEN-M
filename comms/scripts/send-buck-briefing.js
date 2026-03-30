'use strict';
/**
 * send-buck-briefing.js
 *
 * Sends Buck Vaughan the VEN-M portfolio briefing — onboarding him as a
 * team stakeholder and giving him portal access and context.
 *
 * Usage:  node scripts/send-buck-briefing.js
 */

require('dotenv').config();
const zoho      = require('../lib/zoho');
const templates = require('../lib/templates');

const BUCK_EMAIL  = 'buckvaughan3636@gmail.com';
const BUCK_PHONE  = '+1 (678) 687-2855';
const PORTAL_URL  = 'https://comms.unykorn.org';
const GITHUB_BASE = 'https://github.com/FTHTrading/VEN-M/blob/main';

function buildEmail() {
  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const body = `
    <p class="salutation">Buck,</p>

    <p>I'm bringing you in on the <strong class="gold">CB Oriente Portfolio — VEN-M</strong> credit facility. This is a $15M–$21M senior secured raise backed by a <span class="gold">$42,000,000 appraised rough alexandrite chrysoberyl</span> out of Bahia, Brazil — plus three producing Venezuelan resource businesses as operational collateral.</p>

    <p>The full institutional correspondence system is live and operational. Your access to the portfolio portal is at the link below — bookmark it, this is the live dashboard for the entire raise process:</p>

    <div style="text-align:center;margin:28px 0;">
      <a href="${PORTAL_URL}" style="display:inline-block;background:#c9a84c;color:#0a0a0a;font-weight:700;padding:14px 36px;text-decoration:none;font-size:14px;border-radius:4px;letter-spacing:0.05em;">VIEW PORTFOLIO PORTAL →</a>
      <div style="margin-top:10px;font-size:11px;color:#555;letter-spacing:1px;">${PORTAL_URL}</div>
    </div>

    <hr style="border:none;border-top:1px solid #2a2a2a;margin:28px 0;"/>

    <p style="font-size:10px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;margin-bottom:12px;">DEAL SNAPSHOT</p>

    <table class="table">
      <tr><th>Item</th><th>Detail</th></tr>
      <tr><td>Facility Type</td><td>Senior Secured Term Loan</td></tr>
      <tr><td>Facility Size</td><td class="gold">$15,000,000 – $21,000,000</td></tr>
      <tr><td>Primary Collateral</td><td class="gold">2 kg Alexandrite Chrysoberyl — $42M Appraised</td></tr>
      <tr><td>LTV at $15M</td><td>35.7%</td></tr>
      <tr><td>Appraiser</td><td>Prof. Norman Michael Rodi, G.G. (GIA #7535333)</td></tr>
      <tr><td>Portfolio EBITDA (Yr 2)</td><td>$9,744,000</td></tr>
      <tr><td>DSCR at $19M</td><td>1.99x</td></tr>
      <tr><td>Principal / Borrower</td><td>Miguel Silva — Investments Danath Inc.</td></tr>
      <tr><td>Lender Pipeline</td><td>27 named institutions across 4 categories — ready to deploy</td></tr>
      <tr><td>Evidence Chain</td><td>DocuSign + SHA-256 + IPFS + XRPL on-chain attestation</td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #2a2a2a;margin:28px 0;"/>

    <p style="font-size:10px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;margin-bottom:12px;">WHAT'S BUILT AND OPERATIONAL</p>

    <table class="table">
      <tr><th>Component</th><th>Status</th></tr>
      <tr><td>Portfolio Portal (live)</td><td class="gold">comms.unykorn.org — Online</td></tr>
      <tr><td>Automated Email System</td><td class="gold">Zoho Mail API, OAuth2 live</td></tr>
      <tr><td>Inbound Email Daemon</td><td class="gold">Auto-advances pipeline on lender replies</td></tr>
      <tr><td>Lender Pipeline</td><td class="gold">27 named firms — seeded, ready to dispatch</td></tr>
      <tr><td>Full Diligence Package</td><td class="gold">49-item indexed package — GitHub repository</td></tr>
      <tr><td>Evidence Anchoring</td><td class="gold">SHA-256 + IPFS pinned + XRPL anchor pending</td></tr>
      <tr><td>Web3 Identity (.unykorn)</td><td style="color:#e74c3c;">⏳ Registration in progress</td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #2a2a2a;margin:28px 0;"/>

    <p style="font-size:10px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;margin-bottom:12px;">FULL DOCUMENT REPOSITORY</p>

    <p>All documents are live on GitHub. Click to review:</p>

    <table class="table">
      <tr><th>Document</th><th>Link</th></tr>
      <tr><td>Executive Portal Overview</td><td><a href="${GITHUB_BASE}/00-EXECUTIVE-PORTAL.md" style="color:#c9a84c;">00-EXECUTIVE-PORTAL.md</a></td></tr>
      <tr><td>Master Portfolio Record</td><td><a href="${GITHUB_BASE}/asset/04-Master-Portfolio-Record.md" style="color:#c9a84c;">asset/04-Master-Portfolio-Record.md</a></td></tr>
      <tr><td>Alexandrite Appraisal Record</td><td><a href="${GITHUB_BASE}/asset/01-Alexandrite-Appraisal-Record.md" style="color:#c9a84c;">asset/01-Alexandrite-Appraisal-Record.md</a></td></tr>
      <tr><td>Financial Model (LTV/DSCR)</td><td><a href="${GITHUB_BASE}/finance/03-Financial-Model.md" style="color:#c9a84c;">finance/03-Financial-Model.md</a></td></tr>
      <tr><td>Lender Strategy</td><td><a href="${GITHUB_BASE}/ops/04-Lender-Target-List.md" style="color:#c9a84c;">ops/04-Lender-Target-List.md</a></td></tr>
      <tr><td>Full Repository</td><td><a href="https://github.com/FTHTrading/VEN-M" style="color:#c9a84c;">github.com/FTHTrading/VEN-M</a></td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #2a2a2a;margin:28px 0;"/>

    <p>Hit me at <a href="mailto:kevan@unykorn.org" style="color:#c9a84c;">kevan@unykorn.org</a> or <strong class="gold">+1 (321) 278-8323</strong> with any questions. Looking forward to getting you fully up to speed.</p>

    <p style="color:#c9a84c;font-weight:600;">Let's close this one, Buck.</p>

    <p>— Kevan</p>

    <p style="margin-top:20px;">
      <strong style="color:#f5f5f5;">Kevan Burns</strong><br/>
      <span style="color:#888;font-size:12px;">Portfolio Correspondent — CB Oriente / VEN-M<br/>
      UnyKorn &nbsp;&bull;&nbsp; <a href="mailto:kevan@unykorn.org" style="color:#c9a84c;">kevan@unykorn.org</a> &nbsp;&bull;&nbsp; +1 (321) 278-8323 &nbsp;&bull;&nbsp; <a href="https://unykorn.org" style="color:#c9a84c;">unykorn.org</a></span>
    </p>`;

  return templates.layout(body);
}

async function main() {
  console.log('\n  VEN-M — Buck Vaughan Briefing Send');
  console.log('  ──────────────────────────────────────');
  console.log(`  To:   ${BUCK_EMAIL}`);
  console.log(`  From: ${process.env.ZOHO_FROM_ADDRESS}`);

  const subject = 'CB Oriente Portfolio — VEN-M Briefing & Portal Access | Kevan Burns / UnyKorn';
  console.log(`  Subj: ${subject}\n`);

  const html = buildEmail();
  await zoho.sendEmail({ to: BUCK_EMAIL, subject, html });

  console.log('  ✓ Email sent to', BUCK_EMAIL);
  console.log(`  ✓ Portal: ${PORTAL_URL}\n`);
  process.exit(0);
}

main().catch(err => { console.error('ERROR:', err.message); process.exit(1); });

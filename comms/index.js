'use strict';
/**
 * VEN-M Correspondence & Contract Management System
 * Listens on PORT (default 4080)
 * kevan@unykorn.com via Zoho Mail API
 */

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const daemon   = require('./lib/daemon');
const policy   = require('./lib/policy-lock');

const emailRoutes    = require('./routes/email');
const contactRoutes  = require('./routes/contacts');
const contractRoutes = require('./routes/contracts');
const intakeRoutes   = require('./routes/intake');
const policyRoutes   = require('./routes/policy');

const app  = express();
const PORT = process.env.PORT || 4080;
const REPO_ROOT = path.resolve(__dirname, '..');

policy.ensureLockFiles(REPO_ROOT);

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Simple auth check — public paths bypass, all /api/* require X-Comms-Secret
const PUBLIC_PATHS = ['/', '/health', '/pipeline', '/status'];
app.use((req, res, next) => {
  const secret = process.env.COMMS_SECRET;
  if (!secret) return next();
  if (PUBLIC_PATHS.includes(req.path)) return next();
  const provided = req.headers['x-comms-secret'];
  if (provided !== secret) return res.status(401).json({ error: 'Unauthorized' });
  next();
});

// Process lock: blocks mutations unless explicitly approved.
app.use(policy.enforceProcessLock(REPO_ROOT));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/email',     emailRoutes);
app.use('/api/contacts',  contactRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/intake',    intakeRoutes);
app.use('/api/policy',    policyRoutes);

// ── Root landing page ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  const contacts  = require('./lib/contacts');
  const contracts = require('./lib/contracts');
  const corr      = require('./lib/correspondence');
  const allContacts  = contacts.list();
  const active = allContacts.filter(c => !['funded','declined','stalled'].includes(c.stage)).length;
  const allCorr = corr.list();
  const sent = allCorr.filter(e => e.direction === 'outbound').length;

  res.setHeader('Content-Type', 'text/html');
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>CB Oriente Portfolio — VEN-M Comms</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{background:#080808;color:#e8e8e8;font-family:'Segoe UI',system-ui,sans-serif;line-height:1.6}
    a{color:#c9a84c;text-decoration:none}
    /* ── Header ── */
    .header{background:#0d0d0d;border-bottom:1px solid #1a1a1a;padding:28px 48px;display:flex;align-items:center;justify-content:space-between}
    .header-left .eyebrow{font-size:10px;letter-spacing:4px;color:#c9a84c;text-transform:uppercase;margin-bottom:4px}
    .header-left h1{font-size:22px;font-weight:300;letter-spacing:2px}
    .header-right{text-align:right}
    .header-right .label{font-size:10px;letter-spacing:2px;color:#555;text-transform:uppercase;margin-bottom:3px}
    .header-right .contact{font-size:13px;color:#aaa}
    .header-right .contact b{color:#e8e8e8;font-weight:400}
    /* ── Hero band ── */
    .hero{background:linear-gradient(135deg,#0d0d0d 0%,#111008 100%);border-bottom:1px solid #1a1600;padding:48px 48px 40px}
    .hero-grid{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:0;max-width:1100px}
    .hero-stat{padding:0 32px 0 0;border-right:1px solid #1e1e1e}
    .hero-stat:last-child{border-right:none;padding-left:32px;padding-right:0}
    .hero-stat:first-child{padding-left:0}
    .hero-stat .val{font-size:32px;font-weight:200;color:#c9a84c;letter-spacing:-1px;margin-bottom:4px}
    .hero-stat .lbl{font-size:10px;letter-spacing:3px;color:#555;text-transform:uppercase}
    .hero-stat .sub{font-size:11px;color:#444;margin-top:2px}
    /* ── Section wrapper ── */
    .wrap{max-width:1100px;margin:0 auto;padding:0 48px}
    .section{padding:40px 0 20px}
    .section-title{font-size:10px;letter-spacing:4px;color:#c9a84c;text-transform:uppercase;margin-bottom:20px;padding-bottom:10px;border-bottom:1px solid #1a1a1a}
    /* ── Asset cards ── */
    .assets{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:8px}
    .asset-card{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:6px;padding:24px;position:relative;overflow:hidden}
    .asset-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#c9a84c,#8b6914)}
    .asset-card .asset-type{font-size:9px;letter-spacing:3px;color:#555;text-transform:uppercase;margin-bottom:8px}
    .asset-card .asset-name{font-size:16px;font-weight:400;color:#f0f0f0;margin-bottom:4px}
    .asset-card .asset-loc{font-size:11px;color:#555;margin-bottom:16px}
    .asset-card .asset-row{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px}
    .asset-card .asset-key{font-size:11px;color:#555}
    .asset-card .asset-val{font-size:12px;color:#ccc;font-weight:500}
    .asset-card .asset-highlight{font-size:18px;color:#c9a84c;font-weight:300}
    .asset-card .asset-tag{display:inline-block;font-size:9px;letter-spacing:2px;text-transform:uppercase;padding:3px 8px;border-radius:3px;margin-top:12px}
    .tag-collateral{background:#1a1200;color:#c9a84c;border:1px solid #2a2000}
    .tag-expansion{background:#001a12;color:#2ecc71;border:1px solid #004020}
    .tag-infrastructure{background:#00101a;color:#3498db;border:1px solid #002040}
    .tag-restart{background:#1a0010;color:#e74c3c;border:1px solid #400020}
    /* ── Finance cards ── */
    .finance-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
    .fin-card{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:6px;padding:20px}
    .fin-card .fin-label{font-size:9px;letter-spacing:3px;color:#555;text-transform:uppercase;margin-bottom:8px}
    .fin-card .fin-val{font-size:22px;font-weight:200;color:#f0f0f0}
    .fin-card .fin-sub{font-size:11px;color:#444;margin-top:4px}
    /* ── Pipeline table ── */
    .pipeline-bar{background:#0d0d0d;border:1px solid #1a1a1a;border-radius:6px;padding:24px}
    .pipeline-stages{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin-bottom:16px}
    .stage-item{text-align:center;padding:14px 8px;border-radius:4px;background:#111;border:1px solid #1a1a1a}
    .stage-item .stage-n{font-size:22px;font-weight:200;color:#c9a84c}
    .stage-item .stage-l{font-size:9px;letter-spacing:1px;color:#555;text-transform:uppercase;margin-top:4px;line-height:1.3}
    /* ── Contacts table ── */
    .tbl{width:100%;border-collapse:collapse;font-size:12px}
    .tbl th{text-align:left;font-size:9px;letter-spacing:2px;color:#444;text-transform:uppercase;padding:8px 12px;border-bottom:1px solid #1a1a1a;font-weight:400}
    .tbl td{padding:10px 12px;border-bottom:1px solid #111;color:#aaa;vertical-align:middle}
    .tbl tr:last-child td{border-bottom:none}
    .tbl .name{color:#e8e8e8;font-weight:500}
    .stage-pill{display:inline-block;font-size:9px;letter-spacing:1px;text-transform:uppercase;padding:2px 7px;border-radius:12px;background:#111;border:1px solid #222;color:#666}
    .stage-pill.active{border-color:#2a2000;background:#1a1200;color:#c9a84c}
    /* ── Footer ── */
    .footer{background:#0d0d0d;border-top:1px solid #1a1a1a;padding:24px 48px;display:flex;justify-content:space-between;align-items:center;margin-top:60px}
    .footer .foot-left{font-size:11px;color:#333}
    .footer .foot-right{font-size:10px;color:#444;letter-spacing:2px;text-transform:uppercase}
    .dot-live{display:inline-block;width:7px;height:7px;border-radius:50%;background:#2ecc71;margin-right:6px;vertical-align:middle}
    .conf-badge{display:inline-block;font-size:9px;letter-spacing:2px;text-transform:uppercase;padding:3px 10px;border:1px solid #2a2000;border-radius:3px;color:#c9a84c;background:#0d0a00}
    @media(max-width:768px){
      .header{padding:20px 20px;flex-direction:column;gap:12px;text-align:center}
      .hero{padding:32px 20px}
      .hero-grid{grid-template-columns:1fr 1fr;gap:20px}
      .hero-stat{border-right:none;padding:0}
      .wrap{padding:0 20px}
      .assets{grid-template-columns:1fr}
      .finance-grid{grid-template-columns:1fr}
      .pipeline-stages{grid-template-columns:repeat(3,1fr)}
      .footer{flex-direction:column;gap:8px;text-align:center;padding:20px}
    }
  </style>
</head>
<body>

<!-- ── Header ── -->
<div class="header">
  <div class="header-left">
    <div class="eyebrow">CB Oriente Portfolio</div>
    <h1>VEN-M &nbsp;<span style="color:#c9a84c;font-weight:400">Comms</span></h1>
  </div>
  <div class="header-right">
    <div class="label">Operator</div>
    <div class="contact"><b>Miguel Silva</b> — Investments Danath Inc.</div>
    <div class="contact" style="font-size:11px;margin-top:2px">investment.danath@gmail.com &nbsp;·&nbsp; +1 (407) 705 7884</div>
  </div>
</div>

<!-- ── Hero Stats ── -->
<div class="hero">
  <div class="hero-grid">
    <div class="hero-stat">
      <div class="val">$42M</div>
      <div class="lbl">Primary Collateral</div>
      <div class="sub">GIA Alexandrite — Bahia, Brazil</div>
    </div>
    <div class="hero-stat" style="padding-left:32px">
      <div class="val">$15–25M</div>
      <div class="lbl">Facility Target</div>
      <div class="sub">Senior secured credit facility</div>
    </div>
    <div class="hero-stat" style="padding-left:32px">
      <div class="val">4</div>
      <div class="lbl">Linked Assets</div>
      <div class="sub">Gem · Mining · Fuel · Coal</div>
    </div>
    <div class="hero-stat" style="padding-left:32px">
      <div class="val">${allContacts.length}</div>
      <div class="lbl">Lender Contacts</div>
      <div class="sub">${active} active in pipeline</div>
    </div>
  </div>
</div>

<div class="wrap">

  <!-- ── Portfolio Assets ── -->
  <div class="section">
    <div class="section-title">Portfolio Assets</div>
    <div class="assets">

      <div class="asset-card">
        <div class="asset-type">Primary Collateral</div>
        <div class="asset-name">Alexandrite Gemstone — 2kg</div>
        <div class="asset-loc">Bahia, Brazil &nbsp;·&nbsp; GIA Appraised</div>
        <div class="asset-row"><span class="asset-key">Appraised Value</span><span class="asset-highlight">$42,000,000</span></div>
        <div class="asset-row"><span class="asset-key">LTV Advance (25–50%)</span><span class="asset-val">$10.5M – $21M</span></div>
        <div class="asset-row"><span class="asset-key">Legal Owner</span><span class="asset-val">Investments Danath Inc.</span></div>
        <div class="asset-row"><span class="asset-key">Custody</span><span class="asset-val">XRPL anchored · Vault insured</span></div>
        <span class="asset-tag tag-collateral">Collateral Anchor</span>
      </div>

      <div class="asset-card">
        <div class="asset-type">Mining Concession</div>
        <div class="asset-name">Carbonatos de Oriente, C.A.</div>
        <div class="asset-loc">Sucre, Venezuela &nbsp;·&nbsp; 44.10 Ha limestone</div>
        <div class="asset-row"><span class="asset-key">CaCO₃ Purity</span><span class="asset-highlight">96%</span></div>
        <div class="asset-row"><span class="asset-key">Target Output</span><span class="asset-val">600,000 MT/yr (post-expansion)</span></div>
        <div class="asset-row"><span class="asset-key">Funding Ask</span><span class="asset-val">$3.5M – $5M</span></div>
        <div class="asset-row"><span class="asset-key">Current Capacity Used</span><span class="asset-val">~25% → full-capacity expansion</span></div>
        <span class="asset-tag tag-expansion">Expansion Project</span>
      </div>

      <div class="asset-card">
        <div class="asset-type">Fuel Infrastructure</div>
        <div class="asset-name">Base Combustible Sucre (Curaoil)</div>
        <div class="asset-loc">Sucre, Venezuela &nbsp;·&nbsp; Shovel-ready</div>
        <div class="asset-row"><span class="asset-key">Project Stage</span><span class="asset-highlight" style="font-size:14px">Permitted</span></div>
        <div class="asset-row"><span class="asset-key">Fuel Types</span><span class="asset-val">Gasoline, Diesel, Aviation</span></div>
        <div class="asset-row"><span class="asset-key">Funding Ask</span><span class="asset-val">$6M – $8M</span></div>
        <div class="asset-row"><span class="asset-key">Operator</span><span class="asset-val">Curaoil Sucre CA + Danath</span></div>
        <span class="asset-tag tag-infrastructure">Infrastructure</span>
      </div>

      <div class="asset-card">
        <div class="asset-type">Coal Concessions</div>
        <div class="asset-name">Fila Maestra Coal I, II &amp; III</div>
        <div class="asset-loc">Anzoátegui, Venezuela &nbsp;·&nbsp; 3 concessions</div>
        <div class="asset-row"><span class="asset-key">Target Output</span><span class="asset-highlight" style="font-size:14px">500K MT/yr</span></div>
        <div class="asset-row"><span class="asset-key">Coal Type</span><span class="asset-val">Thermal / metallurgical</span></div>
        <div class="asset-row"><span class="asset-key">Funding Ask</span><span class="asset-val">$5M – $12M</span></div>
        <div class="asset-row"><span class="asset-key">Status</span><span class="asset-val">Permitted — restart phase</span></div>
        <span class="asset-tag tag-restart">Restart Project</span>
      </div>

    </div>
  </div>

  <!-- ── Credit Facility ── -->
  <div class="section">
    <div class="section-title">Credit Facility Structure</div>
    <div class="finance-grid">
      <div class="fin-card">
        <div class="fin-label">Total Facility Target</div>
        <div class="fin-val">$15M – $25M</div>
        <div class="fin-sub">Senior secured, SPV-structured</div>
      </div>
      <div class="fin-card">
        <div class="fin-label">Primary Collateral LTV</div>
        <div class="fin-val">25% – 50%</div>
        <div class="fin-sub">$42M appraisal → $10.5M–$21M advance</div>
      </div>
      <div class="fin-card">
        <div class="fin-label">Structure</div>
        <div class="fin-val" style="font-size:14px;padding-top:4px">SPV Facility</div>
        <div class="fin-sub">Project-controlled disbursement · XRPL anchored receipts</div>
      </div>
      <div class="fin-card">
        <div class="fin-label">Emails Sent</div>
        <div class="fin-val">${sent}</div>
        <div class="fin-sub">Via kevan@unykorn.org</div>
      </div>
      <div class="fin-card">
        <div class="fin-label">Lender Contacts</div>
        <div class="fin-val">${allContacts.length}</div>
        <div class="fin-sub">${active} active · ${allContacts.filter(c=>c.stage==='funded').length} funded</div>
      </div>
      <div class="fin-card">
        <div class="fin-label">System Status</div>
        <div class="fin-val" style="font-size:14px;padding-top:4px"><span class="dot-live"></span>All Systems Live</div>
        <div class="fin-sub">Zoho · Cloudflare · XRPL</div>
      </div>
    </div>
  </div>

  <!-- ── Lender Pipeline ── -->
  <div class="section">
    <div class="section-title">Lender Pipeline</div>
    <div class="pipeline-bar">
      <div class="pipeline-stages">
        <div class="stage-item"><div class="stage-n">${allContacts.filter(c=>c.stage==='prospect').length}</div><div class="stage-l">Prospect</div></div>
        <div class="stage-item"><div class="stage-n">${allContacts.filter(c=>c.stage==='outreach_sent').length}</div><div class="stage-l">Outreach Sent</div></div>
        <div class="stage-item"><div class="stage-n">${allContacts.filter(c=>c.stage==='nda_sent').length}</div><div class="stage-l">NDA Sent</div></div>
        <div class="stage-item"><div class="stage-n">${allContacts.filter(c=>c.stage==='nda_signed').length}</div><div class="stage-l">NDA Signed</div></div>
        <div class="stage-item"><div class="stage-n">${allContacts.filter(c=>c.stage==='packet_sent').length}</div><div class="stage-l">Packet Sent</div></div>
        <div class="stage-item"><div class="stage-n">${allContacts.filter(c=>'term_sheet_received,term_sheet_signed,credit_agreement_sent,funded'.includes(c.stage)).length}</div><div class="stage-l">Term Sheet+</div></div>
      </div>
      ${allContacts.length > 0 ? `
      <table class="tbl">
        <thead><tr><th>Name</th><th>Organization</th><th>Category</th><th>Stage</th><th>Last Contact</th></tr></thead>
        <tbody>
          ${allContacts.slice(0,10).map(c => `<tr>
            <td class="name">${c.name || '—'}</td>
            <td>${c.organization || '—'}</td>
            <td>${(c.category || '').replace(/_/g,' ')}</td>
            <td><span class="stage-pill ${['prospect','outreach_sent','nda_sent','nda_signed','packet_sent','term_sheet_received','term_sheet_signed','credit_agreement_sent'].includes(c.stage)?'active':''}">${(c.stage||'').replace(/_/g,' ')}</span></td>
            <td>${c.lastContact ? new Date(c.lastContact).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'}</td>
          </tr>`).join('')}
        </tbody>
      </table>` : `<div style="text-align:center;padding:24px;color:#333;font-size:12px;letter-spacing:2px;text-transform:uppercase">No lender contacts yet — add via API or CLI</div>`}
    </div>
  </div>

  <!-- ── Web3 Identity ── -->
  <div class="section">
    <div class="section-title">Web3 Identity</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">
      <div class="fin-card">
        <div class="fin-label">UnyKorn L1 Namespace</div>
        <div class="fin-val" style="font-size:18px;letter-spacing:0.05em;">.unykorn</div>
        <div class="fin-sub" style="color:#2ecc71;">Native to Chain 7331 &mdash; Live</div>
      </div>
      <div class="fin-card">
        <div class="fin-label">Namespace Resolver</div>
        <div class="fin-val" style="font-size:12px;padding-top:4px;">l1.unykorn.org/ns/:name</div>
        <div class="fin-sub">On-chain registry &mdash; UnyKorn OS</div>
      </div>
      <div class="fin-card">
        <div class="fin-label">EVM Treasury</div>
        <div class="fin-val" style="font-size:10px;font-family:monospace;letter-spacing:0.02em;">0x7d9a65d0…156DB</div>
        <div class="fin-sub">ETH · Polygon · Avalanche · Base</div>
      </div>
      <div class="fin-card">
        <div class="fin-label">Apostle Chain</div>
        <div class="fin-val" style="font-size:14px;">ATP / UNY</div>
        <div class="fin-sub">Chain ID 7332 — AI-to-AI Layer</div>
      </div>
    </div>
  </div>

  <!-- ── Confidentiality ── -->
  <div class="section" style="padding-bottom:0">
    <div style="text-align:center;padding:24px 0">
      <span class="conf-badge">Confidential</span>
      <div style="margin-top:12px;font-size:11px;color:#333;max-width:600px;margin-inline:auto">
        This correspondence system and portfolio data are strictly confidential. Authorized parties only.
        All email correspondence routes through kevan@unykorn.org · Secured via Cloudflare Zero Trust.
      </div>
    </div>
  </div>

</div><!-- /wrap -->

<!-- ── Footer ── -->
<div class="footer">
  <div class="foot-left">
    <span class="dot-live"></span>comms.unykorn.org &nbsp;·&nbsp; ${new Date().toISOString().split('T')[0]}
    &nbsp;·&nbsp; VEN-M Correspondence System v1.0.0
  </div>
  <div class="foot-right">CB Oriente &nbsp;·&nbsp; Investments Danath Inc. &nbsp;·&nbsp; ${new Date().getFullYear()}</div>
</div>

</body>
</html>`);
});

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    ok:        true,
    system:    'VEN-M Comms',
    version:   '1.0.0',
    from:      process.env.ZOHO_FROM_ADDRESS,
    tokenReady: !!process.env.ZOHO_REFRESH_TOKEN,
    time:      new Date().toISOString(),
  });
});

// ── Pipeline dashboard ────────────────────────────────────────────────────────
app.get('/pipeline', (req, res) => {
  const contacts  = require('./lib/contacts');
  const contracts = require('./lib/contracts');
  const corr      = require('./lib/correspondence');

  const allContacts  = contacts.list();
  const allContracts = contracts.list();
  const allCorr      = corr.list();

  const stageMap = {};
  for (const s of contacts.VALID_STAGES) {
    stageMap[s] = allContacts.filter(c => c.stage === s).length;
  }

  res.json({
    ok:          true,
    pipeline:    stageMap,
    contracts:   contracts.summary(),
    emails_sent: allCorr.filter(e => e.direction === 'outbound').length,
    total_contacts: allContacts.length,
    active: allContacts.filter(c => !['funded','declined','stalled'].includes(c.stage)).length,
  });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

// ── Start ─────────────────────────────────────────────────────────────────────
// ── Auto-start inbound email daemon ─────────────────────────────────────────
if (process.env.DAEMON_ENABLED !== 'false') {
  daemon.start().catch(err => console.error('[daemon] startup error:', err.message));
}

app.listen(PORT, () => {
  console.log(`\n  VEN-M Comms System`);
  console.log(`  ─────────────────────────────────────`);
  console.log(`  Port:    ${PORT}`);
  console.log(`  From:    ${process.env.ZOHO_FROM_ADDRESS || '(not set)'}`);
  console.log(`  Token:   ${process.env.ZOHO_REFRESH_TOKEN ? 'READY' : 'MISSING — run: npm run oauth'}`);
  console.log(`  Health:  http://localhost:${PORT}/health`);
  console.log(`  Pipeline:http://localhost:${PORT}/pipeline`);
  console.log(`  ─────────────────────────────────────\n`);
});

module.exports = app;

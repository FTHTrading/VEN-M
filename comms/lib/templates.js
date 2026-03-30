'use strict';
/**
 * templates.js — All HTML email templates for VEN-M correspondence
 *
 * Every function returns { subject, html } ready for zoho.sendEmail()
 */

require('dotenv').config();

const FROM_NAME    = process.env.ZOHO_FROM_NAME    || 'Kevan Burns | UnyKorn';
const FROM_ADDRESS = process.env.ZOHO_FROM_ADDRESS || 'kevan@unykorn.org';
const FROM_PHONE   = process.env.KEVAN_PHONE        || '+1 (321) 278-8323';

// ── Shared layout ─────────────────────────────────────────────────────────────
function layout(bodyContent) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  body{margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;color:#f5f5f5;}
  .wrap{max-width:640px;margin:0 auto;background:#111111;border:1px solid #2a2a2a;}
  .header{background:#111111;border-bottom:2px solid #c9a84c;padding:28px 36px 20px;}
  .header-title{font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#c9a84c;margin-bottom:6px;}
  .header-logo{font-size:20px;font-weight:800;color:#f5f5f5;letter-spacing:0.05em;}
  .body{padding:32px 36px;}
  .salutation{font-size:16px;color:#f5f5f5;margin-bottom:20px;}
  p{font-size:14px;line-height:1.7;color:#cccccc;margin:0 0 14px;}
  .gold{color:#c9a84c;}
  .table{width:100%;border-collapse:collapse;margin:20px 0;}
  .table th{background:#161616;border:1px solid #2a2a2a;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#c9a84c;text-align:left;}
  .table td{border:1px solid #2a2a2a;padding:8px 12px;font-size:13px;color:#cccccc;}
  .btn{display:inline-block;background:#c9a84c;color:#0a0a0a;font-weight:700;padding:12px 28px;text-decoration:none;font-size:13px;border-radius:4px;margin-top:12px;}
  .divider{border:none;border-top:1px solid #2a2a2a;margin:24px 0;}
  .footer{background:#0a0a0a;border-top:1px solid #2a2a2a;padding:20px 36px;font-size:11px;color:#666666;}
  .footer a{color:#c9a84c;text-decoration:none;}
  .badge{display:inline-block;background:rgba(201,168,76,0.12);border:1px solid #c9a84c;color:#c9a84c;font-size:10px;padding:2px 8px;border-radius:3px;letter-spacing:0.08em;}
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <div class="header-title">VEN-M Portfolio</div>
    <div class="header-logo">CB ORIENTE</div>
  </div>
  <div class="body">${bodyContent}</div>
  <div class="footer">
    <strong style="color:#f5f5f5;font-size:12px;">${FROM_NAME}</strong><br/>
    <span style="color:#999;font-size:11px;">Portfolio Correspondent &mdash; CB Oriente / VEN-M</span><br/>
    <span style="color:#888;font-size:11px;">UnyKorn &mdash; Institutional portfolio management and fintech infrastructure platform specializing in structured finance, real-world asset coordination, and cross-border credit facility correspondence.</span><br/>
    <span style="font-size:11px;">
      <a href="mailto:${FROM_ADDRESS}">${FROM_ADDRESS}</a>
      &nbsp;&bull;&nbsp; ${FROM_PHONE}
      &nbsp;&bull;&nbsp; <a href="https://unykorn.org" style="color:#c9a84c;">unykorn.org</a>
    </span>
    <div style="border-top:1px solid #1e1e1e;margin:12px 0 10px;"></div>
    <span style="color:#555;font-size:10px;">On behalf of: <strong style="color:#888;">Miguel Silva</strong>, Principal &mdash; Investments Danath Inc.<br/>
    390 N Orange Ave Suite 2300, Orlando FL 32801 &nbsp;&bull;&nbsp; investment.danath@gmail.com &nbsp;&bull;&nbsp; +1 (407) 705 7884</span><br/><br/>
    <span style="color:#3a3a3a;font-size:10px;">This email and any attachments are confidential and intended solely for the named recipient. &nbsp;
    XRPL Evidence Anchor: CID bafybeihhqpgxb2lia2i6zwduk4mcqxtz37uzlnu73xwxinrkymwwhfkxny</span>
  </div>
</div>
</body>
</html>`;
}

// ── Template 1: Initial Lender Outreach ───────────────────────────────────────
function outreach({ recipientName, organization, lenderCategory = 'specialty asset' }) {
  const body = `
    <p class="salutation">Dear ${recipientName},</p>
    <p>I am writing on behalf of <strong class="gold">Miguel Silva</strong>, Principal of Investments Danath Inc., to introduce the <strong class="gold">CB Oriente Portfolio</strong> — a $15–21M senior secured credit facility backed by a <strong>$42,000,000 appraised rough alexandrite chrysoberyl</strong> from Bahia, Brazil, with three producing Venezuelan resource businesses as operational collateral.</p>
    <p>Given ${organization}'s focus in the ${lenderCategory} lending space, I believe this facility warrants your review.</p>
    <p><strong>At a glance:</strong></p>
    <table class="table">
      <tr><th>Item</th><th>Detail</th></tr>
      <tr><td>Primary Collateral</td><td class="gold">2 kg Alexandrite Chrysoberyl — $42M appraised</td></tr>
      <tr><td>Facility Size</td><td>$15,000,000 – $21,000,000</td></tr>
      <tr><td>LTV at $15M</td><td>35.7% (well below 50% threshold)</td></tr>
      <tr><td>Portfolio EBITDA (Yr 2)</td><td>$9,744,000</td></tr>
      <tr><td>DSCR at $19M</td><td>1.99x</td></tr>
      <tr><td>Appraisal</td><td>Prof. Norman Michael Rodi, G.G. (GIA #7535333)</td></tr>
      <tr><td>Evidence Chain</td><td>DocuSign + SHA-256 + IPFS + XRPL</td></tr>
    </table>
    <p>Five independent lender protections are in place: (1) physical vault custody, (2) $42M all-risk specie insurance with first-position loss payee clause, (3) UCC-1 first-priority lien, (4) bank account control agreement, and (5) XRPL on-chain attestation for tamper-evident document verification.</p>
    <p>I would welcome the opportunity to provide our full diligence packet upon execution of a mutual NDA. The complete package is indexed and ready to deliver within 24 hours of NDA execution.</p>
    <p>Please reply to this email or reach me directly at <strong class="gold">+1 (321) 278-8323</strong>. I look forward to your feedback.</p>
    <hr class="divider"/>
    <p style="font-size:12px;color:#888;">Appraisal SHA-256: <span class="gold" style="font-family:monospace;font-size:11px;">59B634D41C1B0913D63457955688AD4063CA7DDC73F6E5B25E7F18B7F57628BE</span></p>`;

  return {
    subject: `Senior Secured Credit Facility — $42M Alexandrite Collateral | CB Oriente Portfolio`,
    html: layout(body),
  };
}

// ── Template 2: NDA Transmittal ───────────────────────────────────────────────
function ndaTransmittal({ recipientName, organization }) {
  const body = `
    <p class="salutation">Dear ${recipientName},</p>
    <p>Thank you for your interest in the <strong class="gold">CB Oriente Portfolio</strong>. As discussed, I am pleased to transmit our standard mutual Non-Disclosure Agreement for your review.</p>
    <p>The NDA is attached to this email in PDF format. Once executed by both parties, we will deliver the full diligence packet — a 49-item indexed package covering:</p>
    <ul style="color:#cccccc;font-size:14px;line-height:2;margin:0 0 14px 20px;">
      <li>Full appraisal report (Prof. Norman Michael Rodi, GIA #7535333)</li>
      <li>IPFS-pinned and XRPL-anchored evidence chain</li>
      <li>Individual project dossiers (Carbonatos, Curaoil, Fila Maestra)</li>
      <li>LTV model, DSCR analysis, and use-of-proceeds</li>
      <li>Proposed Credit Facility structure and term framework</li>
      <li>SPV structure and legal documentation</li>
    </ul>
    <p>Please execute and return the NDA to <a href="mailto:${FROM_ADDRESS}" style="color:#c9a84c;">${FROM_ADDRESS}</a>. Once received, we will send the full package within 24 hours.</p>
    <p>Thank you, ${recipientName}. I look forward to your partnership.</p>`;

  return {
    subject: `NDA — CB Oriente Portfolio / ${organization} | Mutual Non-Disclosure Agreement`,
    html: layout(body),
  };
}

// ── Template 3: Diligence Packet Delivery ─────────────────────────────────────
function diligencePacket({ recipientName, organization }) {
  const body = `
    <p class="salutation">Dear ${recipientName},</p>
    <p>Thank you for executing the NDA. I am pleased to deliver the <strong class="gold">CB Oriente Portfolio — Full Diligence Package</strong>.</p>
    <p>The complete package is available at our secure document portal (attached / linked below) and contains all 49 indexed items, organized by section:</p>
    <table class="table">
      <tr><th>Section</th><th>Contents</th><th>Status</th></tr>
      <tr><td>A — Portfolio Summary</td><td>Executive Portal, Master Record, README</td><td class="gold">Complete</td></tr>
      <tr><td>B — Collateral Evidence</td><td>Appraisal, DocuSign, SHA-256, IPFS, XRPL</td><td class="gold">Complete</td></tr>
      <tr><td>C — Project Dossiers</td><td>Alexandrite, Carbonatos, Curaoil, Fila Maestra</td><td class="gold">Complete</td></tr>
      <tr><td>D — Asset Records</td><td>Individual asset records (4)</td><td class="gold">Complete</td></tr>
      <tr><td>E — Legal</td><td>SPV guide, board resolution, ACA, risk register</td><td class="gold">Complete</td></tr>
      <tr><td>F — Financial</td><td>LTV model, facility structure, use-of-proceeds, waterfall</td><td class="gold">Complete</td></tr>
      <tr><td>G — Custody &amp; Insurance</td><td>Vault criteria, insurance specs</td><td class="gold">Complete</td></tr>
      <tr><td>H — Diagrams</td><td>Portfolio overview, fund flow, trust boundaries</td><td class="gold">Complete</td></tr>
    </table>
    <p><strong>GitHub Repository:</strong> <a href="https://github.com/FTHTrading/VEN-M" style="color:#c9a84c;">https://github.com/FTHTrading/VEN-M</a></p>
    <p>Please do not hesitate to reach out with any questions. We are prepared to arrange a management call, project site review, or independent gemological inspection at your request.</p>`;

  return {
    subject: `Full Diligence Package — CB Oriente Portfolio | VEN-M / ${organization}`,
    html: layout(body),
  };
}

// ── Template 4: Follow-Up ─────────────────────────────────────────────────────
function followUp({ recipientName, organization, daysSinceLast, stage }) {
  const body = `
    <p class="salutation">Dear ${recipientName},</p>
    <p>I wanted to follow up on our <strong class="gold">CB Oriente Portfolio</strong> correspondence${daysSinceLast ? ` from ${daysSinceLast} days ago` : ''}. We are actively managing our lender process and wanted to check in to see if you have had a chance to complete your initial review.</p>
    <p>Current stage with ${organization}: <span class="badge">${stage || 'Under Review'}</span></p>
    <p>We remain very open to a call at your convenience to walk through any questions on the:</p>
    <ul style="color:#cccccc;font-size:14px;line-height:2;margin:0 0 14px 20px;">
      <li>Gemological appraisal and methodology</li>
      <li>Venezuelan project financials and operations</li>
      <li>Proposed facility structure and security package</li>
      <li>XRPL attestation and evidence chain</li>
    </ul>
    <p>Please reply to this email or call <strong class="gold">+1 (407) 705 7884</strong>.</p>`;

  return {
    subject: `Follow-Up — CB Oriente Portfolio | ${organization}`,
    html: layout(body),
  };
}

// ── Template 5: Term Sheet Acknowledgment ────────────────────────────────────
function termSheetAck({ recipientName, organization, facilityAmount, rate }) {
  const body = `
    <p class="salutation">Dear ${recipientName},</p>
    <p>Thank you for providing the term sheet regarding the <strong class="gold">CB Oriente Portfolio</strong> credit facility. We have received ${organization}'s proposal and are currently reviewing it against our framework requirements.</p>
    ${facilityAmount ? `<p>Proposed facility amount: <strong class="gold">${facilityAmount}</strong></p>` : ''}
    ${rate ? `<p>Proposed rate: <strong class="gold">${rate}</strong></p>` : ''}
    <p>We will revert with any questions or negotiations within <strong>5 business days</strong>. If we have any immediate questions, we will reach out by phone.</p>
    <p>Thank you again for your engagement, ${recipientName}. We look forward to a successful partnership.</p>`;

  return {
    subject: `Term Sheet Received — CB Oriente Portfolio | ${organization}`,
    html: layout(body),
  };
}

// ── Template 6: General Correspondence ───────────────────────────────────────
function general({ recipientName, organization, subject: subjectLine, bodyText }) {
  const body = `
    <p class="salutation">Dear ${recipientName},</p>
    ${bodyText.split('\n').map(l => `<p>${l}</p>`).join('\n')}`;

  return {
    subject: subjectLine || `CB Oriente Portfolio — ${organization}`,
    html: layout(body),
  };
}

// ── Template 7: Intake Confirmation (to new client) ──────────────────────────
function intakeConfirmation({ name, type, assignedTo, product }) {
  const typeLabels = {
    lender:   'Lender / Investor',
    client:   'Business / Service Client',
    ai_agent: 'AI Agent (Apostle Chain)',
    sales:    'Sales Inquiry',
  };
  const assigneeNames = { buck: 'Buck Vaughan', kevan: 'Kevan Burns' };
  const assigneeEmails = { buck: 'buckvaughan3636@gmail.com', kevan: 'kevan@unykorn.org' };
  const label = typeLabels[type] || type;
  const handler = assigneeNames[assignedTo] || assignedTo;
  const handlerEmail = assigneeEmails[assignedTo] || FROM_ADDRESS;

  const body = `
    <p class="salutation">Hi ${name},</p>
    <p>Thank you for your inquiry. We have received your request and your intake record has been created in our system.</p>
    <table class="table">
      <tr><th>Field</th><th>Detail</th></tr>
      <tr><td>Client Type</td><td class="gold">${label}</td></tr>
      ${product ? `<tr><td>Product / Service</td><td>${product}</td></tr>` : ''}
      <tr><td>Assigned To</td><td>${handler}</td></tr>
      <tr><td>Expected Response</td><td>Within 2 business days</td></tr>
    </table>
    <p>Your point of contact is <strong class="gold">${handler}</strong> at
       <a href="mailto:${handlerEmail}" style="color:#c9a84c;">${handlerEmail}</a>.
       Please feel free to reach out directly if you have any questions in the meantime.</p>
    <p>We look forward to working with you.</p>`;

  return {
    subject: `We have received your inquiry — UnyKorn / FTH Pay`,
    html: layout(body),
  };
}

// ── Template 8: Buck Operations Brief ────────────────────────────────────────
function buckOpsBrief() {
  const body = `
    <p class="salutation">Buck,</p>
    <p>This is your full operational brief for <strong class="gold">UnyKorn / FTH Pay</strong>. Please read this carefully — it covers everything you need to know to onboard clients, manage the intake pipeline, handle contracts, and operate effectively within our infrastructure.</p>

    <hr class="divider"/>
    <h3 style="color:#c9a84c;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px;">1. Your Role</h3>
    <p>You are the <strong>Client Relations & Sales Lead</strong> for UnyKorn. You own two client pipelines:</p>
    <table class="table">
      <tr><th>Pipeline</th><th>System</th><th>Your Job</th></tr>
      <tr><td class="gold">Sales Leads</td><td>FTH Pay</td><td>Qualify, pitch, close new merchants + product customers</td></tr>
      <tr><td class="gold">Service Clients</td><td>UnyKorn OS</td><td>Onboard businesses using our platform/API — collect docs, execute agreements</td></tr>
    </table>
    <p><strong>Operating lanes:</strong></p>
    <table class="table">
      <tr><th>Lane</th><th>Scope</th><th>Owner</th></tr>
      <tr><td class="gold">core_system</td><td>Lenders, service clients, sales, contracts, onboarding</td><td>Buck + Kevan</td></tr>
      <tr><td class="gold">ai_system</td><td>Apostle Chain AI agents, agent agreements, AI compliance</td><td>Kevan only</td></tr>
    </table>
    <p><strong>Kevan owns:</strong> Lender pipeline (CB Oriente / VEN-M) and AI Agent registrations (Apostle Chain). Do not advance those pipelines without Kevan's authorization.</p>

    <hr class="divider"/>
    <h3 style="color:#c9a84c;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px;">2. The Four Client Types</h3>
    <table class="table">
      <tr><th>Type</th><th>Label</th><th>Owner</th><th>System</th><th>Example</th></tr>
      <tr><td><code style="color:#c9a84c;">sales</code></td><td>Sales Lead</td><td>Buck</td><td>FTH Pay</td><td>Restaurant chain wanting payment processing</td></tr>
      <tr><td><code style="color:#c9a84c;">client</code></td><td>Service Client</td><td>Buck</td><td>UnyKorn OS</td><td>Company using our API / platform features</td></tr>
      <tr><td><code style="color:#c9a84c;">lender</code></td><td>Lender / Investor</td><td>Kevan</td><td>Lender Pipeline</td><td>Institutional capital provider for CB Oriente</td></tr>
      <tr><td><code style="color:#c9a84c;">ai_agent</code></td><td>AI Agent</td><td>Kevan</td><td>Apostle Chain</td><td>Autonomous AI agent doing settlements on Chain 7332</td></tr>
    </table>

    <hr class="divider"/>
    <h3 style="color:#c9a84c;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px;">3. Your Sales Pipeline (for <code style="color:#c9a84c;">sales</code> type)</h3>
    <table class="table">
      <tr><th>#</th><th>Stage</th><th>What it means</th></tr>
      <tr><td>1</td><td class="gold">lead</td><td>Name/email captured — no contact yet</td></tr>
      <tr><td>2</td><td class="gold">qualified</td><td>Confirmed they have a relevant need + budget</td></tr>
      <tr><td>3</td><td class="gold">discovery</td><td>Full discovery call / demo completed</td></tr>
      <tr><td>4</td><td class="gold">proposal</td><td>Formal proposal + pricing sent</td></tr>
      <tr><td>5</td><td class="gold">negotiation</td><td>Active back-and-forth on terms</td></tr>
      <tr><td>6</td><td class="gold">closed_won</td><td>Deal closed — migrate to service client</td></tr>
      <tr><td>7</td><td class="gold">closed_lost</td><td>Not proceeding — log reason in notes</td></tr>
    </table>

    <hr class="divider"/>
    <h3 style="color:#c9a84c;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px;">4. Required Documents — By Client Type</h3>
    <p><strong>For ALL clients:</strong> No confidential platform info is shared before NDA is signed. No platform access before agreement is signed.</p>
    <table class="table">
      <tr><th>Client Type</th><th>Required Before Platform Access</th></tr>
      <tr><td>Sales Lead</td><td>NDA (if sharing platform details) · Discovery notes · Proposal</td></tr>
      <tr><td>Service Client</td><td>NDA · KYC/AML · Signed Master Service Agreement (MSA) · Statement of Work (SOW)</td></tr>
    </table>
    <p>Contract templates are in the <code style="color:#c9a84c;">/legal/</code> folder of the VEN-M repo:
       <a href="https://github.com/FTHTrading/VEN-M/tree/main/legal" style="color:#c9a84c;">github.com/FTHTrading/VEN-M/legal</a></p>

    <hr class="divider"/>
    <h3 style="color:#c9a84c;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px;">5. Intake Process — Step by Step</h3>
    <p><strong>Step 1:</strong> Capture the lead. Collect: full name, email, company, phone, interested product, source.</p>
    <p><strong>Step 2:</strong> Create intake record via the comms API (or contact Kevan to do it):</p>
    <pre style="background:#0a0a0a;border:1px solid #2a2a2a;padding:12px;font-size:11px;color:#c9a84c;overflow:auto;border-radius:4px;">POST https://comms.unykorn.org/api/intake
X-Comms-Secret: ven-m-comms-2026
{
  "type": "sales",
  "name": "John Doe",
  "email": "john@company.com",
  "organization": "Acme Inc.",
  "phone": "+1 555 000 0000",
  "product": "fth_pay_merchants",
  "source": "inbound",
  "notes": "Reached out via LinkedIn. Wants FTH Pay for restaurant chain."
}</pre>
    <p><strong>Step 3:</strong> System auto-sends confirmation email to the client and assigns the record to you.</p>
    <p><strong>Step 4:</strong> Make initial contact within 48 hours. Send intro + NDA if needed.</p>
    <p><strong>Step 5:</strong> Advance stages as milestones are met. Update notes in the record.</p>
    <p><strong>Step 6:</strong> Collect required docs. Mark them received via API. No advancing past <strong>proposal</strong> without NDA signed.</p>
    <p><strong>Step 7:</strong> For deals &gt; $50K — loop in Kevan before sending agreements.</p>
    <p><strong>Step 8:</strong> On close — advance to <code class="gold">closed_won</code> and coordinate with Kevan for platform provisioning.</p>

    <hr class="divider"/>
    <h3 style="color:#c9a84c;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px;">6. Non-Negotiable Rules</h3>
    <table class="table">
      <tr><th>#</th><th>Rule</th></tr>
      <tr><td>1</td><td><strong>No NDA, no access.</strong> No confidential details shared before NDA is signed.</td></tr>
      <tr><td>2</td><td><strong>No platform access before signed agreement.</strong> MSA or SOW must be executed first.</td></tr>
      <tr><td>3</td><td><strong>$50K+ requires Kevan.</strong> All deals over $50,000 need Kevan's approval and co-signature.</td></tr>
      <tr><td>4</td><td><strong>Every contact gets an intake record.</strong> No exceptions — even casual referrals get logged.</td></tr>
      <tr><td>5</td><td><strong>All comms go through the system.</strong> No off-books deals via personal email or text.</td></tr>
      <tr><td>6</td><td><strong>KYC/AML required for financial products.</strong> Any FTH Pay wallet user must complete identity verification.</td></tr>
      <tr><td>7</td><td><strong>Flag anything suspicious.</strong> Pressure to skip docs, unusual requests, red flags → pause and escalate to Kevan immediately.</td></tr>
    </table>

    <hr class="divider"/>
    <h3 style="color:#c9a84c;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px;">7. Systems Overview</h3>
    <table class="table">
      <tr><th>System</th><th>What it is</th><th>Your Role</th></tr>
      <tr><td class="gold">FTH Pay</td><td>Digital payment gateway. Multi-currency merchant processing. UNY/ATP settlement.</td><td>Sign merchants. Qualify sales leads.</td></tr>
      <tr><td class="gold">UnyKorn OS</td><td>Platform API — vault, RWA, namespace, trading on UnyKorn L1 (Chain 7331).</td><td>Onboard API clients. Collect docs.</td></tr>
      <tr><td class="gold">VEN-M / CB Oriente</td><td>Lender pipeline + correspondence system. $42M alexandrite credit facility.</td><td>Referrals only — Kevan manages.</td></tr>
      <tr><td class="gold">Apostle Chain</td><td>AI-to-AI settlement network. Chain ID 7332. ATP token. Autonomous agent registration.</td><td>Forward inquiries to Kevan.</td></tr>
    </table>
    <p>Comms portal: <a href="https://comms.unykorn.org" style="color:#c9a84c;">comms.unykorn.org</a> — API secret provided separately.</p>

    <hr class="divider"/>
    <h3 style="color:#c9a84c;font-size:13px;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 12px;">8. What I Need From You</h3>
    <table class="table">
      <tr><th>#</th><th>Item</th></tr>
      <tr><td>1</td><td>Any existing sales contacts or leads you already have — send me name, email, company, product interest</td></tr>
      <tr><td>2</td><td>Your crypto wallet address (for UnyKorn OS / FTH Pay onboarding and any ATP allocation)</td></tr>
      <tr><td>3</td><td>Your preferred working hours / availability for client calls</td></tr>
      <tr><td>4</td><td>Any existing client relationships that should be imported into the system</td></tr>
    </table>

    <hr class="divider"/>
    <p><strong>Primary escalation:</strong> Anything involving lenders, AI agents, deals over $50K, legal questions, technical setup, or red flags — escalate to Kevan immediately.</p>
    <p>Kevan Burns &nbsp;·&nbsp; <a href="mailto:kevan@unykorn.org" style="color:#c9a84c;">kevan@unykorn.org</a> &nbsp;·&nbsp; +1 (321) 278-8323</p>
    <p>Full SOP and contract templates: <a href="https://github.com/FTHTrading/VEN-M/tree/main/legal" style="color:#c9a84c;">github.com/FTHTrading/VEN-M/legal</a></p>`;

  return {
    subject: `Buck — UnyKorn / FTH Pay Ops Brief | Your Role, Systems & Intake Process`,
    html: layout(body),
  };
}

module.exports = { outreach, ndaTransmittal, diligencePacket, followUp, termSheetAck, general, intakeConfirmation, buckOpsBrief, layout };

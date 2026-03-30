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

module.exports = { outreach, ndaTransmittal, diligencePacket, followUp, termSheetAck, general, layout };

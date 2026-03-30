'use strict';
/**
 * send-miguel-briefing.js
 *
 * Sends Miguel Silva the full portfolio briefing email:
 *   - Portal site link for review
 *   - All downloadable document links (GitHub)
 *   - Full action checklist with what he needs to do
 *   - Lender pipeline overview (who we're approaching)
 *   - Facility structure summary
 *
 * Usage:  node scripts/send-miguel-briefing.js
 */

require('dotenv').config();
const zoho = require('../lib/zoho');
const templates = require('../lib/templates');

const MIGUEL_EMAIL = 'investment.danath@gmail.com';
const PORTAL_URL   = 'https://comms.unykorn.org';
const GITHUB_BASE  = 'https://github.com/FTHTrading/VEN-M/blob/main';

// ── Build the HTML ─────────────────────────────────────────────────────────────
function buildEmail() {
  const now = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const body = `
    <p class="salutation">Dear Miguel,</p>

    <p>I am writing to give you a complete picture of where the <strong class="gold">CB Oriente Portfolio — VEN-M</strong> credit facility process stands today, what is fully ready, and exactly what you need to action to unlock the funding process.</p>

    <p>Your portfolio management and correspondence system is live at the link below. Bookmark this — it is your real-time dashboard for the full process:</p>

    <div style="text-align:center;margin:28px 0;">
      <a href="${PORTAL_URL}" style="display:inline-block;background:#c9a84c;color:#0a0a0a;font-weight:700;padding:14px 36px;text-decoration:none;font-size:14px;border-radius:4px;letter-spacing:0.05em;">VIEW PORTFOLIO PORTAL →</a>
      <div style="margin-top:10px;font-size:11px;color:#555;letter-spacing:1px;">${PORTAL_URL}</div>
    </div>

    <hr style="border:none;border-top:1px solid #2a2a2a;margin:28px 0;"/>

    <!-- ── SECTION 1: Facility Summary ── -->
    <p style="font-size:10px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;margin-bottom:12px;">01 — CREDIT FACILITY SUMMARY</p>

    <table class="table">
      <tr><th>Term</th><th>Detail</th></tr>
      <tr><td>Facility Type</td><td>Senior Secured Term Loan</td></tr>
      <tr><td>Borrower</td><td>[SPV Name] Asset Holdings LLC (Florida — to be formed)</td></tr>
      <tr><td>Guarantor</td><td>Investments Danath Inc. / Miguel Silva</td></tr>
      <tr><td>Facility Amount</td><td class="gold">USD $15,000,000 – $21,000,000</td></tr>
      <tr><td>Term</td><td>36–60 months</td></tr>
      <tr><td>Primary Collateral</td><td>2 kg Alexandrite — GIA Appraised $42,000,000</td></tr>
      <tr><td>LTV at $15M draw</td><td>35.7% (well protected)</td></tr>
      <tr><td>DSCR (Year 2)</td><td>1.99x (across 3 Venezuelan projects)</td></tr>
      <tr><td>Disbursement</td><td>4 tranches over 12 months ($5M / $5M / $5M / up to $6M)</td></tr>
      <tr><td>Governing Law</td><td>State of Florida, USA</td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #2a2a2a;margin:28px 0;"/>

    <!-- ── SECTION 2: Use of Proceeds ── -->
    <p style="font-size:10px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;margin-bottom:12px;">02 — USE OF PROCEEDS ($19M BASE CASE)</p>

    <table class="table">
      <tr><th>Project</th><th>Amount</th><th>Purpose</th></tr>
      <tr><td>Carbonatos de Oriente, C.A.</td><td class="gold">$4,500,000</td><td>Crushers, screening plant, kiln, haul trucks → 600,000 MT/yr</td></tr>
      <tr><td>Distribuidora Curaoil</td><td class="gold">$7,000,000</td><td>12.5-Ha API/NFPA fuel storage facility — Sucre</td></tr>
      <tr><td>Fila Maestra Coal (Phase 1)</td><td class="gold">$5,500,000</td><td>JORC reserve cert + engineering + 2 excavators + access road</td></tr>
      <tr><td>Working Capital Reserve</td><td>$1,000,000</td><td>6-month reserve across all projects</td></tr>
      <tr><td>Transaction Costs</td><td>$1,000,000</td><td>Legal, vault custody, insurance, SPV formation</td></tr>
      <tr><td style="font-weight:700;">Total</td><td style="color:#c9a84c;font-weight:700;">$19,000,000</td><td></td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #2a2a2a;margin:28px 0;"/>

    <!-- ── SECTION 3: Lender Pipeline (27 firms) ── -->
    <p style="font-size:10px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;margin-bottom:12px;">03 — LENDER PIPELINE (27 NAMED FIRMS — READY TO CONTACT)</p>

    <p>We have identified and loaded <strong class="gold">27 qualified institutional lenders</strong> across four categories into the pipeline system. Below is a breakdown:</p>

    <table class="table">
      <tr><th>#</th><th>Category</th><th>Key Targets</th><th>Firms</th></tr>
      <tr>
        <td class="gold">10</td>
        <td><strong>Specialty Asset / Hard Asset</strong></td>
        <td>Sotheby's SFS, Christie's Art Finance, Athena (Yieldstreet), Malca-Amit Finance, Julius Baer, Pictet, Lombard Odier, EFG International, The Fine Art Group, Falcon Fine Art</td>
        <td>PRIORITY 1 — send immediately once vault + insurance confirmed</td>
      </tr>
      <tr>
        <td class="gold">7</td>
        <td><strong>Trade Finance / Commodity</strong></td>
        <td>BNP Paribas, ING Capital, Natixis CIB, Crédit Agricole CIB, Standard Chartered, Itaú BBA, Banco Sabadell</td>
        <td>Focus on Venezuelan project revenue basis</td>
      </tr>
      <tr>
        <td class="gold">6</td>
        <td><strong>Private Credit / Family Office</strong></td>
        <td>Golub Capital, Blue Owl Capital, Cerberus, Monroe Capital, Churchill Asset Mgmt, Stonehage Fleming</td>
        <td>Flexible underwriting — need full model spreadsheet</td>
      </tr>
      <tr>
        <td class="gold">4</td>
        <td><strong>Development Finance (DFI)</strong></td>
        <td>IDB Invest, CAF, DFC (US Gov), Proparco</td>
        <td>6–12 month process — strongest for Venezuelan infra</td>
      </tr>
    </table>

    <p style="font-size:12px;color:#888;">The system is ready to send professional outreach emails to all 27 firms the moment you confirm the 3 blocking items below are in order.</p>

    <hr style="border:none;border-top:1px solid #2a2a2a;margin:28px 0;"/>

    <!-- ── SECTION 4: Miguel's Action Checklist ── -->
    <p style="font-size:10px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;margin-bottom:12px;">04 — YOUR ACTION CHECKLIST (MIGUEL — REQUIRED BEFORE OUTREACH)</p>

    <p>These are the items that are <strong style="color:#e74c3c;">blocking outreach today</strong> — lenders will ask for these on the first call:</p>

    <table class="table">
      <tr><th>#</th><th>Action Required</th><th>Priority</th><th>Why Lenders Require This</th></tr>
      <tr>
        <td style="color:#e74c3c;font-weight:700;">1</td>
        <td><strong>Engage vault / custodian</strong><br/><span style="font-size:11px;color:#888;">Contact Malca-Amit NYC: +1 (212) 972-6242<br/>or Brinks Global Services — request custody agreement for 2kg rough alexandrite</span></td>
        <td style="color:#e74c3c;">URGENT</td>
        <td style="font-size:11px;color:#888;">Specialty asset lenders cannot advance without confirmed vault. Malca-Amit is also on our lender list — one call may solve both.</td>
      </tr>
      <tr>
        <td style="color:#e74c3c;font-weight:700;">2</td>
        <td><strong>Bind all-risk specie insurance</strong><br/><span style="font-size:11px;color:#888;">Engage Chubb, Lloyd's, or ask Malca-Amit for their insurance referral.<br/>Must be minimum $42,000,000 with lender named as loss payee.</span></td>
        <td style="color:#e74c3c;">URGENT</td>
        <td style="font-size:11px;color:#888;">UCC-1 lien and custody agreement both reference the insurance policy. No insurance = no close.</td>
      </tr>
      <tr>
        <td style="color:#c9a84c;font-weight:700;">3</td>
        <td><strong>Form the SPV (Florida LLC)</strong><br/><span style="font-size:11px;color:#888;">File Articles of Organization with Florida Division of Corporations. Name suggestion: Danath Asset Holdings LLC. ~$125 filing fee + attorney review.</span></td>
        <td style="color:#c9a84c;">HIGH</td>
        <td style="font-size:11px;color:#888;">Borrower must be an SPV. Asset must be transferred from Investments Danath Inc. into the SPV via Asset Contribution Agreement.</td>
      </tr>
      <tr>
        <td style="color:#c9a84c;font-weight:700;">4</td>
        <td><strong>Complete XRPL Attestation Ceremony</strong><br/><span style="font-size:11px;color:#888;">Full step-by-step guide: <a href="${GITHUB_BASE}/xrpl/01-Attestation-Ceremony.md" style="color:#c9a84c;">xrpl/01-Attestation-Ceremony.md</a></span></td>
        <td style="color:#c9a84c;">HIGH</td>
        <td style="font-size:11px;color:#888;">Provides tamper-evident, publicly verifiable on-chain evidence of the appraisal — a key differentiator vs. other borrowers.</td>
      </tr>
      <tr>
        <td style="color:#888;font-weight:700;">5</td>
        <td><strong>Provide Venezuelan corporate documents</strong><br/><span style="font-size:11px;color:#888;">Certified copies of: Carbonatos de Oriente registration (Mercantil No. 71), Curaoil entity docs, all 3 Fila Maestra mining concession certificates. Certified English translations needed.</span></td>
        <td style="color:#888;">NEEDED FOR B/D LENDERS</td>
        <td style="font-size:11px;color:#888;">Trade finance and DFI lenders require legal ownership proof of each project entity.</td>
      </tr>
      <tr>
        <td style="color:#888;font-weight:700;">6</td>
        <td><strong>Write 1-page management bio</strong><br/><span style="font-size:11px;color:#888;">Background on Miguel Silva — track record, prior transactions, relevant expertise. To be added to the diligence packet.</span></td>
        <td style="color:#888;">IMPORTANT</td>
        <td style="font-size:11px;color:#888;">Every lender credit committee asks: "who is the borrower?" This is often the deciding factor alongside the collateral.</td>
      </tr>
      <tr>
        <td style="color:#888;font-weight:700;">7</td>
        <td><strong>Engage LATAM legal counsel</strong><br/><span style="font-size:11px;color:#888;">Venezuelan attorney to provide legal opinion: (1) validity of mining concession pledge under Venezuelan law, (2) Curaoil equity pledge enforceability.</span></td>
        <td style="color:#888;">NEEDED FOR CLOSE</td>
        <td style="font-size:11px;color:#888;">Required before executing the Credit Agreement. Can run in parallel with early lender conversations.</td>
      </tr>
    </table>

    <hr style="border:none;border-top:1px solid #2a2a2a;margin:28px 0;"/>

    <!-- ── SECTION 5: The Collateral Evidence Chain ── -->
    <p style="font-size:10px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;margin-bottom:12px;">05 — ALEXANDRITE COLLATERAL — EVIDENCE CHAIN (CONFIRMED)</p>

    <table class="table">
      <tr><th>Evidence Layer</th><th>Detail</th><th>Status</th></tr>
      <tr><td>GIA Appraisal</td><td>Prof. Norman Michael Rodi, GIA #7535333 — Aug 18, 2025 — $42,000,000</td><td class="gold">✓ Confirmed</td></tr>
      <tr><td>Seal</td><td>D00289944 (original seal on appraisal)</td><td class="gold">✓ Confirmed</td></tr>
      <tr><td>Report ID</td><td>IDH11022025-5432-2KG</td><td class="gold">✓ Confirmed</td></tr>
      <tr><td>DocuSign Envelope</td><td>98840EC3-C71B-4647-B2FD-0DD80EC4C7F1</td><td class="gold">✓ Executed</td></tr>
      <tr><td>SHA-256 Hash</td><td style="font-family:monospace;font-size:10px;">59B634D41C1B0913...57628BE</td><td class="gold">✓ Locked</td></tr>
      <tr><td>IPFS CID</td><td style="font-family:monospace;font-size:10px;">bafybeihhqpgxb2lia2i6zwduk4mcqxtz37uzlnu73xwxinrkymwwhfkxny</td><td class="gold">✓ Pinned</td></tr>
      <tr><td>XRPL On-Chain Attestation</td><td>Canonical ledger anchor for tamper-evident verification</td><td style="color:#e74c3c;">⏳ Pending — see Action #4</td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #2a2a2a;margin:28px 0;"/>

    <!-- ── SECTION 6: Downloadable Documents ── -->
    <p style="font-size:10px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;margin-bottom:12px;">06 — FULL DILIGENCE PACKAGE — DOWNLOADABLE DOCUMENTS</p>

    <p>All documents are in the secure repository. Click any link to view or download:</p>

    <table class="table">
      <tr><th>Section</th><th>Document</th><th>Link</th></tr>

      <tr><td colspan="3" style="background:#0d0d0d;color:#c9a84c;font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:8px 12px;">A — PORTFOLIO OVERVIEW</td></tr>
      <tr><td>A-1</td><td>Executive Portal</td><td><a href="${GITHUB_BASE}/00-EXECUTIVE-PORTAL.md" style="color:#c9a84c;">00-EXECUTIVE-PORTAL.md</a></td></tr>
      <tr><td>A-2</td><td>Master Portfolio Record (all 4 assets)</td><td><a href="${GITHUB_BASE}/asset/04-Master-Portfolio-Record.md" style="color:#c9a84c;">asset/04-Master-Portfolio-Record.md</a></td></tr>
      <tr><td>A-3</td><td>README / Overview</td><td><a href="https://github.com/FTHTrading/VEN-M" style="color:#c9a84c;">github.com/FTHTrading/VEN-M</a></td></tr>

      <tr><td colspan="3" style="background:#0d0d0d;color:#c9a84c;font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:8px 12px;">B — ALEXANDRITE COLLATERAL EVIDENCE</td></tr>
      <tr><td>B-1</td><td>Alexandrite Appraisal Record</td><td><a href="${GITHUB_BASE}/asset/01-Alexandrite-Appraisal-Record.md" style="color:#c9a84c;">asset/01-Alexandrite-Appraisal-Record.md</a></td></tr>
      <tr><td>B-2</td><td>Original Appraisal PDF (IPFS)</td><td><a href="https://ipfs.io/ipfs/bafybeihhqpgxb2lia2i6zwduk4mcqxtz37uzlnu73xwxinrkymwwhfkxny" style="color:#c9a84c;">View on IPFS →</a></td></tr>
      <tr><td>B-3</td><td>XRPL Evidence Anchor Record</td><td><a href="${GITHUB_BASE}/xrpl/02-Evidence-Anchor-Record.md" style="color:#c9a84c;">xrpl/02-Evidence-Anchor-Record.md</a></td></tr>
      <tr><td>B-4</td><td>XRPL Attestation Ceremony (step-by-step)</td><td><a href="${GITHUB_BASE}/xrpl/01-Attestation-Ceremony.md" style="color:#c9a84c;">xrpl/01-Attestation-Ceremony.md</a></td></tr>

      <tr><td colspan="3" style="background:#0d0d0d;color:#c9a84c;font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:8px 12px;">C — PROJECT DOSSIERS</td></tr>
      <tr><td>C-1</td><td>Alexandrite RWA Project Dossier</td><td><a href="${GITHUB_BASE}/projects/01-Alexandrite-RWA.md" style="color:#c9a84c;">projects/01-Alexandrite-RWA.md</a></td></tr>
      <tr><td>C-2</td><td>Carbonatos de Oriente Project</td><td><a href="${GITHUB_BASE}/projects/02-Carbonatos-Oriente.md" style="color:#c9a84c;">projects/02-Carbonatos-Oriente.md</a></td></tr>
      <tr><td>C-3</td><td>Distribuidora Curaoil Fuel Base</td><td><a href="${GITHUB_BASE}/projects/03-Curaoil-Fuel-Base.md" style="color:#c9a84c;">projects/03-Curaoil-Fuel-Base.md</a></td></tr>
      <tr><td>C-4</td><td>Fila Maestra Coal Concessions</td><td><a href="${GITHUB_BASE}/projects/04-Fila-Maestra-Coal.md" style="color:#c9a84c;">projects/04-Fila-Maestra-Coal.md</a></td></tr>

      <tr><td colspan="3" style="background:#0d0d0d;color:#c9a84c;font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:8px 12px;">D — ASSET RECORDS</td></tr>
      <tr><td>D-2</td><td>Carbonatos de Oriente Asset Record</td><td><a href="${GITHUB_BASE}/asset/02-Carbonatos-Oriente-Asset-Record.md" style="color:#c9a84c;">asset/02-Carbonatos-Oriente-Asset-Record.md</a></td></tr>
      <tr><td>D-3</td><td>Fila Maestra Coal Asset Record</td><td><a href="${GITHUB_BASE}/asset/03-Fila-Maestra-Coal-Asset-Record.md" style="color:#c9a84c;">asset/03-Fila-Maestra-Coal-Asset-Record.md</a></td></tr>

      <tr><td colspan="3" style="background:#0d0d0d;color:#c9a84c;font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:8px 12px;">E — LEGAL DOCUMENTS</td></tr>
      <tr><td>E-1</td><td>SPV Formation Guide (Florida LLC)</td><td><a href="${GITHUB_BASE}/legal/01-SPV-Formation-Guide.md" style="color:#c9a84c;">legal/01-SPV-Formation-Guide.md</a></td></tr>
      <tr><td>E-2</td><td>Board Resolution Template</td><td><a href="${GITHUB_BASE}/legal/02-Board-Resolution-Template.md" style="color:#c9a84c;">legal/02-Board-Resolution-Template.md</a></td></tr>
      <tr><td>E-3</td><td>Asset Contribution Agreement</td><td><a href="${GITHUB_BASE}/legal/03-Asset-Contribution-Agreement.md" style="color:#c9a84c;">legal/03-Asset-Contribution-Agreement.md</a></td></tr>
      <tr><td>E-4</td><td>Risk Register</td><td><a href="${GITHUB_BASE}/legal/04-Risk-Register.md" style="color:#c9a84c;">legal/04-Risk-Register.md</a></td></tr>

      <tr><td colspan="3" style="background:#0d0d0d;color:#c9a84c;font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:8px 12px;">F — FINANCE</td></tr>
      <tr><td>F-1</td><td>Credit Facility Structure (full term framework)</td><td><a href="${GITHUB_BASE}/finance/02-Credit-Facility-Structure.md" style="color:#c9a84c;">finance/02-Credit-Facility-Structure.md</a></td></tr>
      <tr><td>F-2</td><td>Use of Proceeds (line-by-line per project)</td><td><a href="${GITHUB_BASE}/finance/03-Use-of-Proceeds.md" style="color:#c9a84c;">finance/03-Use-of-Proceeds.md</a></td></tr>

      <tr><td colspan="3" style="background:#0d0d0d;color:#c9a84c;font-size:10px;letter-spacing:2px;text-transform:uppercase;padding:8px 12px;">G — OPERATIONS (LENDER PROCESS)</td></tr>
      <tr><td>G-1</td><td>Funding Playbook (8–16 week close sequence)</td><td><a href="${GITHUB_BASE}/ops/01-Funding-Playbook.md" style="color:#c9a84c;">ops/01-Funding-Playbook.md</a></td></tr>
      <tr><td>G-2</td><td>Lender Target List (27 named firms + requirements)</td><td><a href="${GITHUB_BASE}/ops/04-Lender-Target-List.md" style="color:#c9a84c;">ops/04-Lender-Target-List.md</a></td></tr>
      <tr><td>G-3</td><td>Diligence Packet Index (49 items)</td><td><a href="${GITHUB_BASE}/ops/03-Diligence-Packet-Index.md" style="color:#c9a84c;">ops/03-Diligence-Packet-Index.md</a></td></tr>
      <tr><td>G-4</td><td>Lender Outreach Templates</td><td><a href="${GITHUB_BASE}/ops/02-Lender-Outreach-Template.md" style="color:#c9a84c;">ops/02-Lender-Outreach-Template.md</a></td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #2a2a2a;margin:28px 0;"/>

    <!-- ── SECTION 7: Next Steps / Timeline ── -->
    <p style="font-size:10px;letter-spacing:3px;color:#c9a84c;text-transform:uppercase;margin-bottom:12px;">07 — RECOMMENDED SEQUENCE OF EVENTS</p>

    <table class="table">
      <tr><th>Week</th><th>Action</th><th>Owner</th></tr>
      <tr><td class="gold">Now</td><td>Call Malca-Amit NYC (+1 212 972 6242) — request custody agreement + ask about their lending desk</td><td>Miguel</td></tr>
      <tr><td class="gold">Now</td><td>Contact Chubb or Lloyd's broker for $42M all-risk specie insurance quote</td><td>Miguel</td></tr>
      <tr><td class="gold">Now</td><td>Confirm appraisal PDF accessible on IPFS, run SHA-256 check</td><td>Miguel</td></tr>
      <tr><td>Week 1</td><td>File Florida LLC Articles of Organization (Danath Asset Holdings LLC)</td><td>Miguel + FL counsel</td></tr>
      <tr><td>Week 1</td><td>Complete XRPL attestation ceremony — 1-hour process</td><td>Miguel / tech support</td></tr>
      <tr><td>Week 1</td><td>Write 1-page management bio</td><td>Miguel → send to us to format</td></tr>
      <tr><td>Week 2</td><td>Send outreach emails to 10 specialty asset lenders (system fires all 10 in one command)</td><td>System — kevan@unykorn.org</td></tr>
      <tr><td>Week 2</td><td>Send outreach to 6 private credit lenders in parallel</td><td>System</td></tr>
      <tr><td>Week 3</td><td>Gather Venezuelan corporate registration documents + certified translations</td><td>Miguel</td></tr>
      <tr><td>Week 3</td><td>Engage LATAM counsel for Venezuelan legal opinion</td><td>Miguel</td></tr>
      <tr><td>Week 4+</td><td>NDA execution → diligence packet delivery → management calls with shortlisted lenders</td><td>Both</td></tr>
      <tr><td>Week 8–12</td><td>Target: first term sheet received</td><td></td></tr>
      <tr><td>Week 12–16</td><td>Target: close + tranche 1 disbursement ($5M)</td><td></td></tr>
    </table>

    <hr style="border:none;border-top:1px solid #2a2a2a;margin:28px 0;"/>

    <p>Miguel, the institutional infrastructure for this raise is fully built and operational. The correspondence system, lender pipeline with 27 named firms, all documents, and email automation are ready to deploy. The moment the vault, insurance, and SPV items are confirmed, we can begin outreach within 24 hours.</p>

    <p>Please review the portal at <a href="${PORTAL_URL}" style="color:#c9a84c;">${PORTAL_URL}</a> and call or email with any questions. I am available to walk through any section in detail.</p>

    <p style="color:#c9a84c;font-weight:600;">Let's get this closed, Miguel.</p>

    <p>Warm regards,</p>`;

  return templates.layout(body);
}

// ── Send ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n  VEN-M — Miguel Silva Briefing Send');
  console.log('  ─────────────────────────────────────');
  console.log(`  To:   ${MIGUEL_EMAIL}`);
  console.log(`  From: ${process.env.ZOHO_FROM_ADDRESS}`);

  const subject = 'CB Oriente Portfolio — Complete Briefing, Action Plan & Full Document Package';

  console.log(`  Subj: ${subject}`);
  console.log('\n  Building email and refreshing Zoho token...');

  const html = buildEmail();
  await zoho.sendEmail({ to: MIGUEL_EMAIL, subject, html });

  console.log('\n  ✓ Email sent successfully to investment.danath@gmail.com');
  console.log(`  ✓ Portal link included: ${PORTAL_URL}`);
  console.log('  ✓ All document GitHub links included');
  console.log('  ✓ 7-item action checklist included');
  console.log('  ✓ 27-lender pipeline overview included');
  console.log('  ✓ Full timeline table included');
  console.log();
}

main().catch(err => {
  console.error('\n  ERROR:', err.message);
  process.exit(1);
});

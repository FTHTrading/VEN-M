# DILIGENCE PACKET INDEX — CB ORIENTE PORTFOLIO

**Purpose:** Complete index of all due diligence materials for lender review  
**Package Version:** 1.0 — March 30, 2026  
**Classification:** Confidential — Share under NDA only

---

## How to Use This Index

This document serves as the table of contents for the CB Oriente institutional diligence package. Each line item describes what the material is, where it lives, and its current status.

**Lender reviewers:** Use the status column to confirm completeness before proceeding to credit committee.

**Borrower team:** Use the completeness column to track what still needs to be obtained or created.

---

## Section A — Portfolio Summary

| # | Document | Location in Repo | Status | Notes |
|---|----------|-----------------|--------|-------|
| A-1 | Executive Portal (1-page overview with navigation) | `00-EXECUTIVE-PORTAL.md` | ✅ Complete | Best starting point for lenders |
| A-2 | README (GitHub portfolio landing page) | `README.md` | ✅ Complete | Full overview |
| A-3 | Master Portfolio Record (canonical summary of all 4 assets) | `asset/04-Master-Portfolio-Record.md` | ✅ Complete | Committee-ready |

---

## Section B — Collateral Evidence (Alexandrite)

| # | Document | Location in Repo | Status | Notes |
|---|----------|-----------------|--------|-------|
| B-1 | Alexandrite Appraisal Record | `asset/01-Alexandrite-Appraisal-Record.md` | ✅ Complete | All appraisal specifics |
| B-2 | Original Appraisal PDF | IPFS — CID `bafybeihhqpgxb2lia2i6zwduk4mcqxtz37uzlnu73xwxinrkymwwhfkxny` | ✅ Accessible | Retrieve from IPFS |
| B-3 | DocuSign Envelope | DocuSign ID `98840EC3-C71B-4647-B2FD-0DD80EC4C7F1` | ✅ Confirmed | Verify via DocuSign |
| B-4 | SHA-256 Hash | `59B634D41C1B0913D63457955688AD4063CA7DDC73F6E5B25E7F18B7F57628BE` | ✅ Recorded | Compute from PDF to verify |
| B-5 | XRPL Attestation TX | `xrpl/02-Evidence-Anchor-Record.md` | ⚠️ PENDING | Must complete before close |
| B-6 | Evidence Anchor Record (combines B-3 through B-5) | `xrpl/02-Evidence-Anchor-Record.md` | ⚠️ 90% Complete | XRPL TX hash pending |
| B-7 | Attestation Ceremony Procedure | `xrpl/01-Attestation-Ceremony.md` | ✅ Complete | Full step-by-step |

---

## Section C — Project Dossiers

| # | Document | Location in Repo | Status | Notes |
|---|----------|-----------------|--------|-------|
| C-1 | Alexandrite RWA Project | `projects/01-Alexandrite-RWA.md` | ✅ Complete | Collateral mechanics |
| C-2 | Carbonatos de Oriente Project | `projects/02-Carbonatos-Oriente.md` | ✅ Complete | Full dossier |
| C-3 | Distribuidora Curaoil Project | `projects/03-Curaoil-Fuel-Base.md` | ✅ Complete | Full dossier |
| C-4 | Fila Maestra Coal Project | `projects/04-Fila-Maestra-Coal.md` | ✅ Complete | Full dossier |

---

## Section D — Asset Records

| # | Document | Location in Repo | Status | Notes |
|---|----------|-----------------|--------|-------|
| D-1 | Alexandrite Appraisal Record | `asset/01-Alexandrite-Appraisal-Record.md` | ✅ Complete | |
| D-2 | Carbonatos Oriente Asset Record | `asset/02-Carbonatos-Oriente-Asset-Record.md` | ✅ Complete | |
| D-3 | Fila Maestra Coal Asset Record | `asset/03-Fila-Maestra-Coal-Asset-Record.md` | ✅ Complete | |
| D-4 | Master Portfolio Record | `asset/04-Master-Portfolio-Record.md` | ✅ Complete | |

---

## Section E — Legal Documents

| # | Document | Location in Repo | Status | Notes |
|---|----------|-----------------|--------|-------|
| E-1 | SPV Formation Guide | `legal/01-SPV-Formation-Guide.md` | ✅ Complete | Florida LLC recommended |
| E-2 | Board Resolution Template | `legal/02-Board-Resolution-Template.md` | ✅ Template ready | Must be executed by CB Orientes |
| E-3 | Asset Contribution Agreement | `legal/03-Asset-Contribution-Agreement.md` | ✅ Template ready | Must be reviewed + executed by counsel |
| E-4 | Risk Register | `legal/04-Risk-Register.md` | ✅ Complete | Full risk matrix |
| E-5 | SPV Articles of Organization (actual) | ⚠️ Not yet obtained | | Form Florida LLC first |
| E-6 | SPV Operating Agreement (executed) | ⚠️ Not yet obtained | | Prepare with FL counsel |
| E-7 | Venezuelan corporate documents (all companies) | ⚠️ Must be provided | | Copies with certified translations |
| E-8 | Mining concession certificates (Fila Maestra) | ⚠️ Must be provided | | 3 concession certificates |
| E-9 | Venezuelan legal opinion on pledges | ⚠️ Not yet obtained | | Require LATAM counsel |

---

## Section F — Financial Documents

| # | Document | Location in Repo | Status | Notes |
|---|----------|-----------------|--------|-------|
| F-1 | Portfolio LTV Model | `finance/01-Portfolio-LTV-Model.md` | ✅ Complete | 25/35/50% LTV tables |
| F-2 | Credit Facility Structure | `finance/02-Credit-Facility-Structure.md` | ✅ Complete | Full term framework |
| F-3 | Use of Proceeds | `finance/03-Use-of-Proceeds.md` | ✅ Complete | Per-project breakdown |
| F-4 | Waterfall & Disbursement | `finance/04-Waterfall-Disbursement.md` | ✅ Complete | Priority stack |
| F-5 | Historical financial statements (CB Orientes) | ⚠️ Must be provided | | 3 years preferred |
| F-6 | Historical financial statements (Curaoil) | ⚠️ Must be provided | | Or startup docs |
| F-7 | Fila Maestra production records (1987–1993 CAVOVEN) | ⚠️ Partial — in project dossier | | Government records from MENPET |

---

## Section G — Custody and Insurance

| # | Document | Location in Repo | Status | Notes |
|---|----------|-----------------|--------|-------|
| G-1 | Vault Selection Criteria | `custody/01-Vault-Selection-Criteria.md` | ✅ Complete | Brinks / Malca-Amit recommended |
| G-2 | Insurance Requirements | `custody/02-Insurance-Requirements.md` | ✅ Complete | $42M all-risk specie |
| G-3 | Custody Control Agreement (executed) | ⚠️ Not yet executed | | Must be executed at close |
| G-4 | Vault Receipt (issued upon delivery) | ⚠️ Not yet issued | | Issued by custodian at delivery |
| G-5 | Insurance Binder / Certificate of Insurance | ⚠️ Not yet obtained | | Bind at close |

---

## Section H — Diagrams and Process

| # | Document | Location in Repo | Status | Notes |
|---|----------|-----------------|--------|-------|
| H-1 | Portfolio Overview Diagram (Mermaid) | `diagrams/00-Portfolio-Overview.md` | ✅ Complete | Visual summary |
| H-2 | Fund Flow Diagram | `diagrams/01-Fund-Flow.md` | ✅ Complete | Money flow |
| H-3 | Trust Boundaries Diagram | `diagrams/02-Trust-Boundaries.md` | ✅ Complete | Legal/custody domains |

---

## Section I — Operational / Repo

| # | Document | Location in Repo | Status | Notes |
|---|----------|-----------------|--------|-------|
| I-1 | Funding Playbook | `ops/01-Funding-Playbook.md` | ✅ Complete | Step-by-step to close |
| I-2 | Lender Outreach Templates | `ops/02-Lender-Outreach-Template.md` | ✅ Complete | 3 email templates |
| I-3 | This Diligence Index | `ops/03-Diligence-Packet-Index.md` | ✅ Complete | — |

---

## Completeness Summary

| Section | Complete | Pending |
|---------|----------|---------|
| A — Portfolio Summary | 3 / 3 | 0 |
| B — Collateral Evidence | 6 / 7 | XRPL TX hash |
| C — Project Dossiers | 4 / 4 | 0 |
| D — Asset Records | 4 / 4 | 0 |
| E — Legal | 4 / 9 | SPV formation; CB Oriente docs; concession certs; Venezuelan legal opinion |
| F — Financial | 4 / 7 | Historical financials (Venezuela); production records |
| G — Custody & Insurance | 2 / 5 | Custody agreement; vault receipt; insurance binder |
| H — Diagrams | 3 / 3 | 0 |
| I — Operational | 3 / 3 | 0 |
| **TOTAL** | **33 / 49** | **16 items pending** |

---

## Priority Items Before First Lender Presentation

**These 5 items significantly improve lender confidence:**

1. ⚠️ **XRPL attestation TX** — Execute ceremony and update xrpl/02  
2. ⚠️ **SPV formation** — Florida LLC (1–5 days via Sunbiz.org)  
3. ⚠️ **Insurance quotation** — Even a non-binding quote shows the coverage is obtainable  
4. ⚠️ **Custody proposal** — Email from Brinks or Malca-Amit confirming they can accept the consignment  
5. ⚠️ **Executed board resolution** — CB Orientes needs to adopt resolution per legal/02 template  

---

*Update this index as items are completed. Provide updated copy to each lender as the packet evolves.*

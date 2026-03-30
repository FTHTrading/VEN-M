# EVIDENCE ANCHOR RECORD — CB ORIENTE PORTFOLIO

**Purpose:** Authoritative record of all cryptographic evidence anchors for the Alexandrite appraisal  
**Status:** PARTIALLY COMPLETE — XRPL attestation pending execution  
**Date:** March 30, 2026

---

## Primary Asset

| Field | Value |
|-------|-------|
| **Description** | Rough Chrysoberyl (Var. Alexandrite), 2 kg |
| **Origin** | Bahia, Brazil |
| **Appraisal Value** | USD $42,000,000 |
| **Report Number** | IDH11022025-5432-2KG |
| **Appraiser** | Prof. Norman Michael Rodi, G.G. — GIA #7535333 |
| **Appraisal Date** | August 18, 2025 |
| **Appraisal Seal** | D00289944 |
| **Owner** | Investments Danath Inc. / Miguel Silva |

---

## Layer 1 — DocuSign Envelope (Professional Electronic Signature)

| Field | Value |
|-------|-------|
| **Platform** | DocuSign |
| **Envelope ID** | `98840EC3-C71B-4647-B2FD-0DD80EC4C7F1` |
| **Signer/Status** | Appraiser Prof. Norman Michael Rodi, G.G. — signed |
| **Verification** | Log in to DocuSign / verify via DocuSign verification portal |
| **Effect** | Legally binding electronic signature under ESIGN Act / 21 CFR Part 11 |

---

## Layer 2 — Cryptographic Hash (Document Fingerprint)

| Field | Value |
|-------|-------|
| **Algorithm** | SHA-256 |
| **Hash** | `59B634D41C1B0913D63457955688AD4063CA7DDC73F6E5B25E7F18B7F57628BE` |
| **Document** | Appraisal report PDF as signed by appraiser |
| **How to verify** | Compute SHA-256 of the appraisal PDF file and compare to the above |
| **Windows PowerShell** | `Get-FileHash appraisal.pdf -Algorithm SHA256` |
| **Linux/Mac** | `sha256sum appraisal.pdf` |

---

## Layer 3 — IPFS Pinned Content Identifier

| Field | Value |
|-------|-------|
| **Protocol** | IPFS (InterPlanetary File System) |
| **CID** | `bafybeihhqpgxb2lia2i6zwduk4mcqxtz37uzlnu73xwxinrkymwwhfkxny` |
| **Public Gateway URL** | `https://ipfs.io/ipfs/bafybeihhqpgxb2lia2i6zwduk4mcqxtz37uzlnu73xwxinrkymwwhfkxny` |
| **Cloudflare Gateway** | `https://cloudflare-ipfs.com/ipfs/bafybeihhqpgxb2lia2i6zwduk4mcqxtz37uzlnu73xwxinrkymwwhfkxny` |
| **How to verify** | Retrieve the file from IPFS and compute SHA-256 — must match Layer 2 above |
| **Pinning Status** | Active — must maintain pinning or content could become unavailable |

**IPFS pinning note:** Content on IPFS is only available as long as at least one node is "pinning" it. To ensure long-term availability:
- Use Pinata, nft.storage, or web3.storage to maintain persistent pinning
- Recommended: maintain pinning on at least 2 services

---

## Layer 4 — XRPL On-Ledger Attestation (Pending)

| Field | Value |
|-------|-------|
| **Network** | XRP Ledger Mainnet |
| **Transaction Hash** | **`[PENDING — TO BE COMPLETED]`** |
| **XRPL Account** | **`[PENDING — TO BE CONFIRMED]`** |
| **Ledger Index** | **`[PENDING]`** |
| **Attestation Timestamp** | **`[PENDING]`** |
| **Explorer URL** | `https://livenet.xrpl.org/transactions/[TX_HASH]` |
| **Memo Type** | `application/vnd.cbOriente.attestation.v1` |
| **Memo Content** | JSON: sha256, ipfs CID, appraiser, value, seal, docusign ref |

**Status:** Attestation ceremony has not yet been performed. See [xrpl/01-Attestation-Ceremony.md](01-Attestation-Ceremony.md) for complete procedure.

**Priority:** HIGH — Complete before facility close. Lender should be present or co-verify.

---

## Full Verification Chain

```
Any Party Can Verify:

1. DocuSign Envelope 98840EC3-...
   ↓ Confirms appraiser's signature is genuine
   
2. Download appraisal PDF (from DocuSign or IPFS CID)
   ↓
   
3. Compute SHA-256 of PDF
   ↓ Must match: 59B634D4...F57628BE
   
4. Retrieve from IPFS CID: bafybeih...fkxny
   ↓ Content must hash to same SHA-256
   
5. Look up XRPL TX [PENDING]
   ↓ Must contain SHA-256 + IPFS CID in Memo data
   ↓ Timestamp proves document existed AS OF that ledger index

CONCLUSION: The document is authentic, unaltered, and existed before the attestation date.
```

---

## What This Evidence Chain Proves to a Lender

| Question | Answer |
|----------|--------|
| Is the appraisal real? | DocuSign envelope with appraiser's signature — verifiable |
| Has the appraisal been altered? | SHA-256 hash — any alteration changes the hash |
| Is the appraisal document accessible? | IPFS CID — retrievable by any party globally |
| When did this document exist? | XRPL attestation timestamp — immutable, ledger-verified |
| Can this be forged? | SHA-256 collision-resistant — practically impossible to forge |
| Can anyone verify independently? | Yes — all elements are public and verifiable without SPV involvement |

---

## Pending Actions to Complete This Record

| Action | Priority | Owner |
|--------|----------|-------|
| Execute XRPL attestation ceremony per xrpl/01 | **CRITICAL** | Borrower + Lender witness |
| Record XRPL TX hash in this document | High | Borrower |
| Confirm IPFS pinning on 2+ pinning services | High | Borrower |
| Provide full evidence package to Lender | High | Borrower counsel |
| Obtain Lender written acknowledgment of evidence chain | Medium | Both counsels |

---

*This evidence anchor record is a living document — update XRPL fields upon ceremony completion.*

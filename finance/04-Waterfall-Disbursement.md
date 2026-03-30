# WATERFALL & DISBURSEMENT — CB ORIENTE PORTFOLIO

**Purpose:** Payment priority order and distribution rules for the CB Oriente credit facility.  
**Governing Principle:** Exact waterfall derives from executed facility documents — this is conceptual framework only.  
**Date:** March 30, 2026 | **Classification:** Confidential

---

## 1) Payment Events

Payment events that trigger a waterfall distribution:

| Event | Trigger |
|-------|---------|
| **Facility close / initial draw** | Lender funds are released to SPV per tranche schedule |
| **Project revenue receipts** | Monthly/quarterly revenue from Carbonatos, Curaoil, Fila Maestra flows to SPV |
| **Refinancing event** | If facility is refinanced or extended |
| **Liquidation/realization** | Sale of Alexandrite collateral or project asset sale |

---

## 2) Waterfall (Priority Order)

```
FIRST — Taxes and mandatory government payments
        (Venezuelan + US obligations; VAT, withholding, mining royalties)

SECOND — Third-party operating costs
         (Custody fees, vault storage, insurance premiums, 
          legal/admin, repair and maintenance)

THIRD — Required reserves
        (Debt service reserve — maintain 6 months interest;
         Working capital minimum — $500K floor per facility covenant)

FOURTH — Lender: interest payments
          (Per facility agreement schedule; no grace period)

FIFTH — Lender: principal amortization
         (Per facility amortization schedule; begins Month 13-19)

SIXTH — Project operating expenses
         (Labor, fuel, consumables, raw materials across all 3 projects)

SEVENTH — Program fees and sponsor compensation
           (Agreed percentage — operator/sponsor compensation per Exhibit A of facility)

EIGHTH — Investor / holder distributions (if applicable)
          (If tokenized instrument or co-investors participate)

NINTH — Residual to borrower / principal
         (Profit distributions after all senior obligations satisfied)
```

---

## 3) Controls (Why This Is Bankable)

| Control | Function |
|---------|----------|
| **Custody control agreement** | Governs who can move the Alexandrite and under what conditions; lender consent required for disposition |
| **XRPL evidence anchor** | Immutable on-ledger reference to appraisal document; reduces disputes; provides audit trail |
| **Disbursement account control** | SPV-controlled bank account; lender approval required for draws above threshold |
| **Insurance loss payee** | Lender named as loss payee; insurance proceeds flow to lender first |
| **Waterfall execution** | All revenue and proceeds flow through SPV account; lender has priority claim via security agreement |
| **Milestone draws** | Project funding released only upon milestone verification; prevents capital misuse |
| **Monthly reporting** | SPV submits financial statements and project updates monthly; lender has visibility |

---

## 4) Revenue Flow Diagram

```
[Carbonatos Revenue] ──┐
[Curaoil Revenue]      ├──→ [SPV Account] → [Waterfall Priority Stack]
[Fila Maestra Revenue] ┘             ↑
                               [Lender Oversight
                               + Approval for 
                                major items]
```

---

## 5) Distribution Conditions

Before any Seventh-level (sponsor/operator) or Ninth-level (residual) distribution, the following must be confirmed:

- [ ] All taxes and regulatory obligations paid current
- [ ] Insurance premiums paid; coverage confirmed
- [ ] Debt service reserve is funded at 6-month minimum
- [ ] Working capital floor ($500K) is intact
- [ ] No Event of Default exists (or has been cured)
- [ ] Lender has received quarterly financial report
- [ ] LTV ratio is within permitted range (≤ 50%)

---

## 6) Lender Verification Access

To verify any element of this waterfall and control system:

| What to Verify | Where to Look |
|---------------|--------------|
| Appraisal integrity | SHA-256 match + IPFS CID + XRPL attestation tx |
| Custody status | Vault receipt + custody control agreement |
| Insurance | Insurance binder / certificate of insurance |
| SPV bank account | Monthly account statement (provided to lender) |
| Project financials | Quarterly financial reports per covenant |
| XRPL tx record | XRPL explorer — search attestation tx hash |

---

## 7) Disbursement Approval Matrix

| Amount | Approval Required |
|--------|------------------|
| < $50,000 | SPV Manager (Miguel Silva) |
| $50,000 – $500,000 | SPV Manager + Lender Notice |
| > $500,000 | SPV Manager + Lender Written Approval |
| Collateral disposition | Lender Written Approval + Independent Director |
| Insurance proceeds | Lender Written Approval (loss payee controls flow) |

---

## 8) Exit / Termination

When the facility matures or is repaid:

1. Lender releases security interest (UCC-3 termination statement filed)
2. Lender releases as loss payee on insurance policy
3. Custody control agreement terminates; Alexandrite reverts to full SPV/owner control
4. XRPL attestation record remains (permanent, immutable — this is a feature, not a liability)
5. Venezuelan project interests released from pledge
6. SPV may be dissolved or repurposed for next facility

---

*This waterfall framework is conceptual. Binding waterfall and disbursement control terms are governed by the executed Credit Agreement, Security Agreement, and Custody Control Agreement. All disputes subject to the governing law specified in the facility documents.*

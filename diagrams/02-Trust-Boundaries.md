# TRUST BOUNDARIES DIAGRAM

**Purpose:** Legal, custody, XRPL, and finance domain boundaries  
**Context:** Shows which entity controls what, and where lender protections are enforced

```mermaid
graph TB
    subgraph PHYSICAL["🌎 Physical World"]
        GEM_PHYSICAL["Rough Alexandrite — 2 kg<br/>Physical Stone"]
        PROJECTS_PHYSICAL["Venezuelan Projects<br/>(Real land, equipment, operations)"]
    end

    subgraph CUSTODY_DOMAIN["🔒 Custody Domain (Lender-Controlled)"]
        direction TB
        VAULT["Approved Vault<br/>(Brinks / Malca-Amit)"]
        CAA["Custody Control Agreement<br/>SPV + Lender + Custodian<br/>Lender consent required for release"]
        VAULT_RECEIPT["Vault Receipt<br/>(Custodian → SPV + Lender copy)"]
        INS_DOMAIN["Insurance Policy<br/>$42M all-risk specie<br/>Loss Payee: LENDER FIRST"]
    end

    subgraph LEGAL_DOMAIN["⚖️ Legal Domain"]
        SPV["[SPV Name] Asset Holdings LLC<br/>Florida — legal owner of record"]
        UCC["UCC-1 Financing Statement<br/>(Florida Secretary of State)<br/>Perfected security interest"]
        CONTRIB_AGREE["Asset Contribution Agreement<br/>(Danath Inc. → SPV)"]
        CREDIT_AGREE["Credit Agreement<br/>(SPV ↔ Lender)"]
        PLEDGE["Pledge of Venezuelan<br/>Project Interests<br/>(per Venezuelan law)"]
    end

    subgraph DIGITAL_DOMAIN["🔗 Digital Evidence Domain (Public, Immutable)"]
        DOCUSIGN["DocuSign<br/>Appraiser Signature<br/>Envelope 98840EC3-..."]
        SHA256["SHA-256 Hash<br/>59B634D4...7628BE<br/>(Appraisal Fingerprint)"]
        IPFS["IPFS CID<br/>bafybeih...fkxny<br/>(Content-Addressed Storage)"]
        XRPL["XRP Ledger TX<br/>[PENDING — to be recorded]<br/>Immutable Timestamp + Hash"]
    end

    subgraph FINANCE_DOMAIN["💵 Finance Domain"]
        ACCOUNT["SPV Controlled Account<br/>(Lender approval for large draws)"]
        WATERFALL["Waterfall Priority<br/>Taxes → Costs → Reserve →<br/>Interest → Principal → Ops → Fees → Distrib"]
        MILESTONE["Milestone Disbursement<br/>(Lender verification required)"]
    end

    subgraph LENDER_RIGHTS["🏦 Lender Enforcement Rights"]
        LDR["Lender = Secured Party<br/>Multiple control points"]
        R1["Right: custody control<br/>(direct asset access on default)"]
        R2["Right: insurance loss payee<br/>(first claims on $42M)"]
        R3["Right: UCC enforcement<br/>(levy + sell collateral)"]
        R4["Right: account control<br/>(freeze / redirect on default)"]
        R5["Right: XRPL verification<br/>(independently verify evidence)"]
    end

    GEM_PHYSICAL --> VAULT
    VAULT --> CAA
    CAA --> VAULT_RECEIPT
    VAULT --> INS_DOMAIN
    
    CONTRIB_AGREE --> SPV
    SPV --> UCC
    SPV --> CREDIT_AGREE
    PROJECTS_PHYSICAL --> PLEDGE
    PLEDGE --> CREDIT_AGREE
    
    DOCUSIGN --> SHA256
    SHA256 --> IPFS
    IPFS --> XRPL
    
    CREDIT_AGREE --> ACCOUNT
    ACCOUNT --> WATERFALL
    ACCOUNT --> MILESTONE
    
    LDR --> R1
    LDR --> R2
    LDR --> R3
    LDR --> R4
    LDR --> R5
    
    R1 -->|"enforces"| CAA
    R2 -->|"enforces"| INS_DOMAIN
    R3 -->|"enforces"| UCC
    R4 -->|"enforces"| ACCOUNT
    R5 -->|"verifies"| XRPL
```

---

## Domain Summary Table

| Domain | Who Controls | What Happens on Default |
|--------|-------------|----------------------|
| **Physical Custody** | Custodian (under Lender control agreement) | Lender takes direct custody control |
| **Insurance** | Insurer / Insurance Broker | Lender collects insurance proceeds as loss payee |
| **Legal (SPV + UCC)** | Lender (via UCC-1 security interest) | Lender enforces security interest; may sell collateral |
| **Venezuelan Projects** | SPV / operator under Venezuelan law | Pledge of interests enforced per Venezuelan law |
| **Digital Evidence** | Public / immutable (no one controls) | Lender independently verifies — cannot be manipulated by either party |
| **Finance / Accounts** | SPV Manager + Lender approval | Lender freezes / redirects account per security agreement |

---

## Why This Structure Is Lender-Safe

```
Before Default:          After Default:
─────────────          ──────────────
SPV manages ops        Lender controls:
Operator runs          → Custody (asset)
  projects             → Insurance (cash)
Lender monitors        → UCC (title)
  + receives           → Account (funds)
  payments             → Can sell all
```

The lender has **five independent enforcement paths** — if any one fails, the others remain. This is belt-and-suspenders design.

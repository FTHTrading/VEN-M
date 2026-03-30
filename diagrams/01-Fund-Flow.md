# FUND FLOW DIAGRAM

**Purpose:** Money flow from lender through facility to projects and waterfall repayment  
**Framework:** Senior secured credit facility — milestone disbursements + waterfall repayment

```mermaid
flowchart LR
    subgraph LENDER["🏦 Lender"]
        L1["Credit Committee<br/>Approval"]
        L2["Facility Funding<br/>$15M–$21M"]
    end

    subgraph SPV["⚖️ SPV (Florida LLC)"]
        SPV_IN["Receive Funds"]
        SPV_CTRL["Controlled Account<br/>(Milestone Gated)"]
        WATERFALL["Waterfall Engine"]
    end

    subgraph RESERVES["🛡️ Required Reserves"]
        DSR["Debt Service Reserve<br/>(6 months interest)"]
        WCR["Working Capital Floor<br/>($500K minimum)"]
    end

    subgraph TRANCHE["📦 Milestone Draws"]
        T1["Tranche 1 — Close<br/>~$3.5M<br/>Legal + Custody + Insurance<br/>+ Initial Project Deposits"]
        T2["Tranche 2 — Month 3<br/>~$5.5M<br/>Equipment + Curaoil Phase 1<br/>+ Fila Maestra Reserve Study"]
        T3["Tranche 3 — Month 6<br/>~$4.5M<br/>Commissioning + Phase 2"]
        T4["Tranche 4 — Month 12<br/>~$5.5M<br/>Final draws on milestones"]
    end

    subgraph PROJECTS["🏗️ Projects"]
        CB["Carbonatos de Oriente<br/>$4.5M → Expand to 600K MT/yr"]
        CUR["Curaoil Fuel Base<br/>$7M → Build & Commission"]
        FM["Fila Maestra Coal<br/>$5.5M → Phase 1+2 Start"]
    end

    subgraph REVENUE["💵 Revenue Streams"]
        R1["Carbonatos Revenue<br/>Yr 2: ~$8.4M / EBITDA $3.4M"]
        R2["Curaoil Revenue<br/>Yr 2: ~$3.5M / EBITDA $1.2M"]
        R3["Fila Maestra Revenue<br/>Yr 2: ~$14.7M / EBITDA $5.2M"]
    end

    subgraph WATERFALL_OUT["⬇️ Waterfall Priority"]
        W1["① Taxes & Regulatory"]
        W2["② Operating Costs & Custody/Insurance"]
        W3["③ Reserve Maintenance"]
        W4["④ Lender INTEREST"]
        W5["⑤ Lender PRINCIPAL"]
        W6["⑥ Project OpEx"]
        W7["⑦ Operator Fees"]
        W8["⑧ Distributions"]
    end

    L1 --> L2
    L2 --> SPV_IN
    SPV_IN --> SPV_CTRL
    SPV_CTRL --> DSR
    SPV_CTRL --> WCR
    SPV_CTRL --> T1
    SPV_CTRL --> T2
    SPV_CTRL --> T3
    SPV_CTRL --> T4
    T1 --> CB
    T1 --> CUR
    T2 --> CB
    T2 --> CUR
    T2 --> FM
    T3 --> CB
    T3 --> CUR
    T3 --> FM
    T4 --> CUR
    T4 --> FM
    CB --> R1
    CUR --> R2
    FM --> R3
    R1 --> WATERFALL
    R2 --> WATERFALL
    R3 --> WATERFALL
    WATERFALL --> W1
    W1 --> W2
    W2 --> W3
    W3 --> W4
    W4 --> W5
    W5 --> W6
    W6 --> W7
    W7 --> W8
    W4 -->|"Pay"| LENDER
    W5 -->|"Amortize"| LENDER
```

---

## Repayment Math (Base Case — $19M Facility)

| Year | Portfolio EBITDA | Debt Service | DSCR | Cumulative Repaid |
|------|-----------------|-------------|------|------------------|
| Year 1 (ramp) | $2.5M | $1.5M (interest only) | 1.67x | $1.5M |
| Year 2 | $9.7M | $4.9M | 1.98x | $6.4M |
| Year 3 | $12.8M | $4.9M | 2.61x | $11.3M |
| Year 4 | $14.5M | $4.9M | 2.96x | $16.2M |
| Year 5 | $15.0M | $4.9M | 3.06x | $21.1M → **Paid off** |

*At 8% interest, 5-year term with 12-month interest-only period, $19M principal.*

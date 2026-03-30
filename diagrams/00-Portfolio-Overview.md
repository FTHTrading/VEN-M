# PORTFOLIO OVERVIEW DIAGRAM

**Purpose:** End-to-end portfolio structure in Mermaid flowchart  
**Scope:** All four assets, legal structure, evidence chain

```mermaid
graph TB
    subgraph OWNER["🏢 Investments Danath Inc. (Orlando, FL)"]
        MS["Miguel Silva — Principal<br/>investment.danath@gmail.com"]
    end

    subgraph SPV["⚖️ [SPV Name] Asset Holdings LLC (Florida)"]
        SPV_MGR["SPV Manager"]
        SPV_ACCT["SPV Bank Account<br/>(Controlled Disbursement)"]
    end

    subgraph COLLATERAL["💎 Primary Collateral"]
        GEM["Rough Alexandrite — 2 kg<br/>Appraised: USD $42,000,000<br/>Report IDH11022025-5432-2KG<br/>Seal D00289944"]
    end

    subgraph CUSTODY["🔒 Institutional Custody"]
        VAULT["Approved Vault<br/>(Brinks / Malca-Amit)<br/>Lender Control Agreement"]
        INS["All-Risk Specie Insurance<br/>$42M — Loss Payee: Lender<br/>(Lloyd's / Chubb / AXA)"]
    end

    subgraph EVIDENCE["🔗 Evidence Chain"]
        DOCUSIGN["DocuSign<br/>98840EC3-C71B-..."]
        SHA["SHA-256<br/>59B634D4...7628BE"]
        IPFS["IPFS CID<br/>bafybeih...fkxny"]
        XRPL["XRPL Attestation<br/>TX: [PENDING]"]
    end

    subgraph LENDER["🏦 Senior Secured Lender"]
        LDR["Specialty Asset Lender<br/>/ Private Credit Fund<br/>/ DFI"]
        FACILITY["Facility: $15M–$21M<br/>Term: 36–60 months<br/>LTV: 35–50% on $42M"]
    end

    subgraph PROJECTS["🏗️ Venezuelan Projects"]
        CB["Carbonatos de Oriente<br/>Sucre State<br/>Limestone — 600K MT/yr<br/>Capital: $4.5M"]
        CUR["Distribuidora Curaoil<br/>Sucre State<br/>Fuel Infrastructure<br/>Capital: $7M"]
        FM["Fila Maestra<br/>Anzoátegui State<br/>Thermal Coal — 500K MT/yr<br/>Capital: $5.5M"]
    end

    OWNER --> SPV
    SPV --> COLLATERAL
    COLLATERAL --> CUSTODY
    COLLATERAL --> EVIDENCE
    LENDER --> FACILITY
    FACILITY -->|"Secured by"| COLLATERAL
    FACILITY -->|"Controls"| CUSTODY
    FACILITY -->|"Verifies"| EVIDENCE
    FACILITY -->|"Funds (milestone draws)"| SPV_ACCT
    SPV_ACCT -->|"Tranche 1"| CB
    SPV_ACCT -->|"Tranche 2"| CUR
    SPV_ACCT -->|"Tranche 3"| FM
    CB -->|"Revenue → Waterfall"| SPV_ACCT
    CUR -->|"Revenue → Waterfall"| SPV_ACCT
    FM -->|"Revenue → Waterfall"| SPV_ACCT
    SPV_ACCT -->|"Priority repayment"| LENDER
```

---

## Portfolio Quick Reference

| | Alexandrite | Carbonatos | Curaoil | Fila Maestra |
|-|-------------|-----------|---------|-------------|
| **Type** | Gemstone RWA | Limestone Mine | Fuel Infrastructure | Coal Mine |
| **Location** | Bahia, Brazil (custody: USA) | Sucre, Venezuela | Sucre, Venezuela | Anzoátegui, Venezuela |
| **Value / Capacity** | $42M appraised | 600K MT/yr | 12.5 Ha facility | 500K MT/yr |
| **Capital Needed** | (is collateral) | $4.5M | $7.0M | $5.5M |
| **Role in Facility** | Primary collateral | Secondary / revenue | Secondary / revenue | Secondary / revenue |
| **Year 2 EBITDA** | — | $3.4M | $1.2M | $5.2M |

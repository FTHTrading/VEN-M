# XRPL ATTESTATION CEREMONY — CB ORIENTE PORTFOLIO

**Purpose:** Step-by-step procedure for anchoring the Alexandrite appraisal on the XRP Ledger  
**Asset:** 2kg Rough Alexandrite — Report IDH11022025-5432-2KG  
**Framework:** Based on Y3KDigital/axlusd XRPL evidence attestation model  
**Date:** March 30, 2026

---

## Why XRPL?

The XRP Ledger provides:
- **Immutable timestamped record** — once a transaction is confirmed, the memo data cannot be altered
- **Public verifiability** — any party can independently verify the attestation using the XRPL explorer
- **Cost effective** — XRPL transactions cost fractions of a cent (drops of XRP)
- **Low energy** — Federated consensus; not proof-of-work
- **Financial institution compatibility** — XRPL is used by central banks and financial institutions worldwide

---

## What the Attestation Does

The attestation does NOT put the Alexandrite "on the blockchain." It anchors a cryptographic fingerprint (SHA-256 hash) of the appraisal document on the XRP Ledger, so that:

1. Any third party can verify that the appraisal document exists unchanged
2. The timestamp of the attestation is permanently recorded
3. If the document is ever altered, the hash will not match — proving tampering
4. The XRPL transaction hash becomes a permanent, court-admissible reference

---

## Pre-Ceremony Checklist

Before running the ceremony:

- [ ] Confirm SHA-256 hash of appraisal document:  
  `59B634D41C1B0913D63457955688AD4063CA7DDC73F6E5B25E7F18B7F57628BE`
- [ ] Confirm IPFS CID is pinned and accessible:  
  `bafybeihhqpgxb2lia2i6zwduk4mcqxtz37uzlnu73xwxinrkymwwhfkxny`
- [ ] Confirm XRPL account has ≥ 5 XRP (for transaction reserve plus fees)
- [ ] Confirm appraisal document matches DocuSign envelope `98840EC3-C71B-4647-B2FD-0DD80EC4C7F1`
- [ ] Lender or lender's representative present (or co-verifies hash independently)

---

## Ceremony Steps

### Step 1 — Prepare the Memo Data

The XRPL Memo field supports UTF-8 hex-encoded arbitrary data. Prepare the following JSON payload (compressed to fit XRPL memo constraints):

```json
{
  "asset": "Alexandrite-2kg-IDH11022025-5432-2KG",
  "sha256": "59B634D41C1B0913D63457955688AD4063CA7DDC73F6E5B25E7F18B7F57628BE",
  "ipfs": "bafybeihhqpgxb2lia2i6zwduk4mcqxtz37uzlnu73xwxinrkymwwhfkxny",
  "appraiser": "GIA-7535333",
  "value_usd": 42000000,
  "seal": "D00289944",
  "docusign": "98840EC3-C71B-4647-B2FD-0DD80EC4C7F1",
  "owner": "Investments-Danath-Inc",
  "ts": "2026-03-30T00:00:00Z"
}
```

Convert this JSON to HEX for the MemoData field.

### Step 2 — Set MemoType

Set `MemoType` to the hex encoding of:  
`application/vnd.cbOriente.attestation.v1`

This identifies the memo type for future programmatic querying.

### Step 3 — Construct the Transaction

```json
{
  "TransactionType": "Payment",
  "Account": "[XRPL_ATTESTATION_ACCOUNT]",
  "Destination": "[XRPL_ATTESTATION_ACCOUNT]",
  "Amount": "1",
  "Memos": [
    {
      "Memo": {
        "MemoType": "6170706c69636174696f6e2f766e642e63624f5579656e74652e617474657374...",
        "MemoData": "[HEX_ENCODED_JSON_ABOVE]"
      }
    }
  ],
  "Fee": "12",
  "Sequence": [CURRENT_ACCOUNT_SEQUENCE]
}
```

> **Self-payment of 1 drop:** Sending 1 drop to your own address is the canonical XRPL attestation pattern. It costs only the transaction fee (12 drops ≈ 0.000012 XRP).

### Step 4 — Sign and Submit

Submit to the XRPL Mainnet via:
- **XRPL Developer Tools** — https://xrpl.org/resources/dev-tools/websocket-api-tool
- **xrpl.js** library (JavaScript/Node.js):

```js
const xrpl = require("xrpl");

async function attest() {
  const client = new xrpl.Client("wss://xrplcluster.com");
  await client.connect();

  const wallet = xrpl.Wallet.fromSeed("YOUR_SEED_HERE");
  
  const memoData = {
    asset: "Alexandrite-2kg-IDH11022025-5432-2KG",
    sha256: "59B634D41C1B0913D63457955688AD4063CA7DDC73F6E5B25E7F18B7F57628BE",
    ipfs: "bafybeihhqpgxb2lia2i6zwduk4mcqxtz37uzlnu73xwxinrkymwwhfkxny",
    appraiser: "GIA-7535333",
    value_usd: 42000000,
    seal: "D00289944",
    docusign: "98840EC3-C71B-4647-B2FD-0DD80EC4C7F1",
    owner: "Investments-Danath-Inc",
    ts: new Date().toISOString()
  };

  const tx = {
    TransactionType: "Payment",
    Account: wallet.address,
    Destination: wallet.address,
    Amount: "1",
    Memos: [{
      Memo: {
        MemoType: Buffer.from("application/vnd.cbOriente.attestation.v1").toString("hex").toUpperCase(),
        MemoData: Buffer.from(JSON.stringify(memoData)).toString("hex").toUpperCase()
      }
    }]
  };

  const prepared = await client.autofill(tx);
  const signed = wallet.sign(prepared);
  const result = await client.submitAndWait(signed.tx_blob);
  
  console.log("Attestation TX Hash:", result.result.hash);
  await client.disconnect();
}

attest();
```

### Step 5 — Record the Transaction Hash

Once the transaction is confirmed (look for `"validated": true` in the response), record:

- **XRPL TX Hash:** `[RECORD HERE — 64-char hex]`
- **XRPL Account:** `[ATTESTATION_ACCOUNT_ADDRESS]`
- **Ledger Index:** `[LEDGER_INDEX_AT_CONFIRMATION]`
- **Timestamp (UTC):** `[UTC_TIMESTAMP]`

→ Record all of the above in [xrpl/02-Evidence-Anchor-Record.md](xrpl/02-Evidence-Anchor-Record.md)

### Step 6 — Verify on Public Explorer

Verify the transaction at:  
`https://xrpl.org/transactions/[TX_HASH]`  
or  
`https://livenet.xrpl.org/transactions/[TX_HASH]`

Confirm:
- Transaction is validated on ledger
- Memo data matches the expected JSON payload
- SHA-256 hash in the memo matches: `59B634D41C1B0913D63457955688AD4063CA7DDC73F6E5B25E7F18B7F57628BE`

### Step 7 — Independently Verify the Appraisal Document

Any third party can verify the appraisal independently:

1. Retrieve the appraisal document from IPFS:  
   `https://ipfs.io/ipfs/bafybeihhqpgxb2lia2i6zwduk4mcqxtz37uzlnu73xwxinrkymwwhfkxny`

2. Compute SHA-256 of the downloaded file (Linux/Mac):  
   `sha256sum appraisal.pdf`  
   (Windows PowerShell):  
   `Get-FileHash appraisal.pdf -Algorithm SHA256`

3. Confirm output matches:  
   `59B634D41C1B0913D63457955688AD4063CA7DDC73F6E5B25E7F18B7F57628BE`

4. Open the XRPL TX and confirm the hash in the MemoData matches.

**If all three match, the document is authentic and has not been altered since attestation.**

---

## Ceremony Completion Record

| Field | Value |
|-------|-------|
| Ceremony Date | `[DATE]` |
| Conducted By | `[NAME + ROLE]` |
| Witnessed By | `[LENDER REP OR NOTARY NAME]` |
| XRPL TX Hash | `[TO BE RECORDED]` |
| XRPL Account | `[TO BE RECORDED]` |
| SHA-256 Confirmed | ☐ Yes |
| IPFS CID Confirmed | ☐ Yes |
| Explorer Verification | ☐ Yes — URL: `[TO BE RECORDED]` |

---

*This attestation procedure is modeled on the Y3KDigital/axlusd XRPL evidence anchoring framework. The XRPL ledger provides permanent, tamper-resistant evidence anchoring without requiring custody or control of the physical asset.*

# AI AGENT SERVICE AGREEMENT
## Apostle Chain — Autonomous Agent Onboarding & Operation

**Agreement Date:** [DATE]
**Operator:** UnyKorn LLC (Apostle Chain) — "Platform"
  Contact: Kevan Burns · kevan@unykorn.org · +1 (321) 278-8323
**Agent Operator:** [COMPANY / INDIVIDUAL NAME] — "Operator"
  Contact: [NAME] · [EMAIL] · [PHONE]

---

> **IMPORTANT:** This Agreement governs the registration and operation of AI Agents on the Apostle Chain permissioned settlement network (Chain ID: 7332). All Operators must fully execute this Agreement prior to agent activation. Non-compliant agents will be suspended immediately and without notice.

---

### 1. DEFINITIONS

| Term | Definition |
|------|-----------|
| **Agent** | An autonomous software process registered on Apostle Chain with a unique AgentID and ATP wallet |
| **AgentID** | The unique UUID assigned upon registration (format: `agent:UUID`) |
| **ATP Token** | The native settlement asset of Apostle Chain (18 decimal precision) |
| **UNY Token** | Cross-chain utility token bridgeable to Apostle Chain |
| **Operator** | The entity legally responsible for an Agent's behavior |
| **Settlement** | Final recording of an ATP transfer on the Apostle Chain ledger |
| **Heartbeat** | Periodic liveness signal required from active Agents |

### 2. AGENT REGISTRATION

a) To register an Agent, Operator must provide:
   - Intended agent name / label
   - Primary use-case declaration (must be specific — e.g., "invoice settlement," "data purchase," "autonomous trading")
   - Operator identity verification (KYC documentation)
   - Signed copy of this Agreement

b) Upon approval, Platform will:
   - Register the Agent via `/v1/agents/register`
   - Assign a unique AgentID and ATP wallet address
   - Issue initial ATP funding (if approved for airdrop)
   - Provide private key (Ed25519) — **Operator must store securely**

c) Private keys are generated once and never stored by Platform. If lost, Agent must be re-registered.

### 3. PERMITTED USE CASES

Agents may only operate for the declared use case. Permitted general categories:

- Autonomous invoice settlement between AI agents
- Data marketplace transactions (buying/selling structured data)
- API service micropayments
- Cross-chain bridge operations (XRPL/Stellar settlement via ATP)
- Treasury rebalancing and sweep operations
- Agent-to-agent product/service exchange

**Prohibited uses (any of these result in immediate suspension):**
- Money laundering or structuring transactions to avoid reporting thresholds
- Operating on behalf of sanctioned entities (OFAC, EU, UN lists)
- Sending ATP to wallets controlled by unauthorized third parties
- Circumventing Platform monitoring or rate limits
- Using Apostle Chain for speculative trading without declared purpose

### 4. OPERATOR RESPONSIBILITIES

**The Operator is fully responsible for:**

a) All transactions submitted by Operator's Agent(s) to the Apostle Chain mempool.

b) Compliance with all applicable laws including AML/KYC, FinCEN MSB rules (if applicable), and securities regulations in Operator's jurisdiction.

c) Securing Agent private keys. Platform is not liable for loss due to key compromise.

d) Ensuring Agents maintain a valid heartbeat signal. Agents silent for 72+ hours may be suspended.

e) Accurate declaration of use-case. Material misrepresentation voids this Agreement immediately.

f) Not exceeding the transaction rate limits set by Platform (default: 100 tx/min per Agent).

### 5. APOSTLE CHAIN TECHNICAL REQUIREMENTS

**Transaction format (TxEnvelope — POST /v1/tx):**
```json
{
  "hash": "<64-char hex, no 0x prefix>",
  "from": "<bare UUID (no agent: prefix)>",
  "nonce": <u64>,
  "chain_id": 7332,
  "payload": {
    "type": "transfer",
    "to": "<recipient UUID>",
    "asset": "ATP",
    "amount": "<string — e.g. '1000000000000000000'>"
  },
  "signature": "<128-char hex Ed25519 signature>",
  "timestamp": "<ISO 8601>"
}
```

**Key technical rules:**
- All ATP amounts are in **attoAPO** (1 ATP = 10^18 attoAPO)
- Amounts must be sent as JSON **strings** (not numbers) due to u128 precision
- `chain_id` must always be `7332`
- Nonce must be monotonically increasing per Agent
- Signatures must be valid Ed25519 over the canonical tx fields

### 6. FEES AND ECONOMICS

a) **Registration:** No fee for initial registration during beta period.

b) **Network fees:** Transaction fees are denominated in ATP and deducted from sender's balance automatically.

c) **ATP funding:** Initial airdrops are at Platform's sole discretion and do not constitute a financial obligation.

d) **Bridge fees:** XRPL and Stellar bridge operations have fees set by respective settlement protocols.

e) ATP is a utility token for settlement purposes only. It is not an investment contract and Platform makes no representations about its market value.

### 7. MONITORING AND SUSPENSION

Platform reserves the right to:

a) Monitor all Agent transactions for compliance with this Agreement.

b) **Immediately suspend** any Agent that: violates prohibited use cases, exhibits anomalous transaction patterns, fails to maintain heartbeat for 72+ hours, or is associated with sanctioned activity.

c) Permanently revoke an Agent's registration for material violations.

d) Report suspicious activity to relevant regulatory authorities.

Operator will be notified of suspension via the email on file. Appeals may be submitted within 14 days.

### 8. PLATFORM UPTIME AND LIABILITY

a) Platform targets 99.5% uptime but does not guarantee it.

b) Platform is not liable for settlement delays, chain downtime, or bridge failures.

c) Platform's total liability to Operator is capped at ATP amounts deposited by Operator in the 30 days preceding a claim.

d) Platform is not liable for losses due to Operator's key mismanagement or deployment errors.

### 9. TERM AND TERMINATION

a) This Agreement is effective upon Agent registration and continues until terminated.

b) Operator may close an Agent at any time by submitting a written termination notice.

c) Platform may terminate immediately upon violation of Section 3 (prohibited uses) or Section 4 (operator responsibilities).

d) Upon termination, remaining ATP balance will be returned to a destination wallet specified by Operator within 30 days (subject to compliance review).

### 10. GOVERNING LAW

Florida law governs. Orange County, Florida jurisdiction.

---

### AGENT REGISTRATION DATA (complete before signing)

| Field | Value |
|-------|-------|
| Agent Label | [AGENT NAME / LABEL] |
| Declared Use Case | [SPECIFIC PURPOSE] |
| Expected Transaction Volume | [TX/DAY estimate] |
| Expected ATP Volume | [ATP/month estimate] |
| Integration Method | [Direct API / SDK / Proxy] |
| Operator Legal Jurisdiction | [STATE/COUNTRY] |
| Operator Business Type | [Company / Individual / DAO] |

**Operator KYC Documents Provided:**
- [ ] Government-issued ID (passport or driver's license)
- [ ] Proof of business registration (if entity)
- [ ] Intended use-case description (1 page minimum)
- [ ] Technical integration description

---

### SIGNATURES

**UnyKorn LLC / Apostle Chain (Platform)**

Signature: _________________________________ Date: _____________
Name: Kevan Burns — CEO / Chain Operator
Email: kevan@unykorn.org

---

**Agent Operator**

Signature: _________________________________ Date: _____________
Name: [FULL NAME]
Title: [TITLE]
Organization: [COMPANY]
Email: [EMAIL]
Phone: [PHONE]

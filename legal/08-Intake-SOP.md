# CLIENT INTAKE — STANDARD OPERATING PROCEDURES (SOP)
## UnyKorn LLC — Internal Operations Manual

**Effective:** 2026
**Owner:** Kevan Burns (CEO), Buck Vaughan (Client Relations)
**Version:** 1.0

---

## OVERVIEW

Every new person, business, or AI agent entering the UnyKorn / FTH Pay ecosystem must go through a structured intake process. No one gets platform access, executes contracts, or receives funds without completing their assigned intake pipeline.

This document defines:
1. The four client types and how they're separated
2. The intake pipeline stages for each type
3. Required documents before advancement
4. Who owns each type (Buck vs Kevan)
5. Non-negotiable rules

---

## 1. CLIENT TYPE DEFINITIONS

| Type | Label | System | Default Owner | Description |
|------|-------|--------|---------------|-------------|
| `lender` | Lender / Investor | `lender_pipeline` | **Kevan** | CB Oriente lenders, institutional investors, capital providers |
| `client` | Business / Service Client | `unykorn_os` | **Buck** | Companies / individuals using FTH Pay, UnyKorn OS API, platform features |
| `ai_agent` | AI Agent | `apostle_chain` | **Kevan** | Autonomous AI agents being onboarded to Apostle Chain (Chain 7332) |
| `sales` | Sales Lead | `fth_pay` | **Buck** | Inbound or outbound sales prospects for any UnyKorn product |

**Rule:** When in doubt about type, default to `sales`. Kevan will reclassify if needed.

---

## 2. PIPELINE STAGES BY TYPE

### 2a. LENDER PIPELINE (Kevan owns)
```
prospect → outreach_sent → nda_sent → nda_signed → packet_sent
         → term_sheet_received → term_sheet_signed → credit_agreement_sent
         → funded | declined | stalled
```
- **Buck's role:** Can input referrals as `prospect`. Kevan manages from there.
- **NOT Buck's pipeline.** Do not advance lender stages without Kevan's authorization.

---

### 2b. SERVICE CLIENT PIPELINE (Buck owns)
```
lead → discovery → proposal_sent → agreement_sent → onboarded → active
     → paused | churned
```

**Stage definitions:**
| Stage | Description |
|-------|-------------|
| `lead` | Name + email captured — no contact yet |
| `discovery` | Initial call / meeting completed |
| `proposal_sent` | Scope + pricing proposal sent — awaiting response |
| `agreement_sent` | MSA or SOW sent for signature |
| `onboarded` | Signed agreement received, account provisioned |
| `active` | Client is using the platform |
| `paused` | Temporarily inactive — check monthly |
| `churned` | Client relationship ended |

---

### 2c. AI AGENT PIPELINE (Kevan owns)
```
pending_registration → registered → provisioned → funded → active
                     → suspended | terminated
```
- **Buck's role:** Buck may receive AI agent inquiries but must forward to Kevan immediately.
- Kevan handles all Apostle Chain technical onboarding.

---

### 2d. SALES PIPELINE (Buck owns)
```
lead → qualified → discovery → proposal → negotiation
     → closed_won | closed_lost
```

**Stage definitions:**
| Stage | Description |
|-------|-------------|
| `lead` | Unqualified — just a name / email |
| `qualified` | Confirmed they have a relevant need + budget |
| `discovery` | Detailed call / demo completed |
| `proposal` | Formal proposal sent |
| `negotiation` | Active back-and-forth on terms |
| `closed_won` | Deal closed — migrate to `client` type |
| `closed_lost` | Not proceeding — record reason in notes |

---

## 3. REQUIRED DOCUMENTS BY CLIENT TYPE

### 3a. Lender
- [ ] **NDA** (Lender NDA — `legal/03-NDA-Template.md`)
- [ ] **Investor Profile** (broker sheet or institutional profile)
- [ ] **Source of Funds Declaration**
- [ ] **LOI** (if advancing after initial review)
- [ ] **Term Sheet** (when terms are agreed)
- [ ] **Credit Agreement** (at closing)

### 3b. Service Client
- [ ] **General NDA** (`legal/05-General-NDA-Template.md`)
- [ ] **KYC/AML** (government ID + business reg for entities)
- [ ] **Master Service Agreement** (`legal/06-Service-Agreement-MSA.md`)
- [ ] **Statement of Work (SOW)** (attached to MSA for each engagement)
- [ ] **Use Case Description** (what they plan to use the platform for)

### 3c. AI Agent
- [ ] **Agent Registration Form** (operator name, use case, expected volume)
- [ ] **Operator Identity** (government ID or company registration)
- [ ] **Intended Use Declaration** (1-page minimum — specific use case)
- [ ] **AI Agent Service Agreement** (`legal/07-AI-Agent-Agreement.md`)
- [ ] **Data Processing Addendum** (if agent processes personal data)

### 3d. Sales Lead
- [ ] **Discovery Call Notes** (summary logged in intake record)
- [ ] **Proposal / Quote** (scope + pricing)
- [ ] **NDA** (if sharing confidential platform details during sales process)

---

## 4. INTAKE INTAKE PROCESS — STEP BY STEP

### Step 1: Capture the Lead
Collect minimum required info for intake record creation:
- Full name (required)
- Email address (required)
- Company / organization (if applicable)
- Phone number
- Interested product or service
- Source (inbound / referral / outbound / api)
- Client type (lender / client / ai_agent / sales)

**POST to comms API:**
```bash
curl -X POST https://comms.unykorn.org/api/intake \
  -H "Content-Type: application/json" \
  -H "X-Comms-Secret: ven-m-comms-2026" \
  -d '{
    "type": "sales",
    "name": "John Doe",
    "email": "john@company.com",
    "organization": "Acme Inc.",
    "phone": "+1 555 000 0000",
    "product": "fth_pay_merchants",
    "source": "inbound",
    "notes": "Reached out via LinkedIn. Wants FTH Pay for restaurant chain."
  }'
```

On creation:
- Record is saved to `comms/data/clients.json`
- Confirmation email is automatically sent to the client
- Record is assigned to default owner (Buck or Kevan per type)

---

### Step 2: Initial Contact (within 48 hours)
- Buck handles: `client` + `sales` types
- Kevan handles: `lender` + `ai_agent` types
- Introduction email (use `general` template if no specific one applies)
- Advance stage via API: `PATCH /api/intake/:id/stage` with `{ "stage": "discovery" }`

---

### Step 3: Collect Required Docs
- Send NDA first (always before sharing confidential platform details)
- Mark docs received via: `POST /api/intake/:id/doc` with `{ "doc": "nda" }`
- **No proposal, no SOW, no platform access until NDA is signed**

---

### Step 4: Advance Through Pipeline
- Update stage as milestones are hit
- Log key updates in `notes` via PATCH
- For proposals/agreements > $50K — Kevan must sign off before sending
- Link contract records via `contractIds` (use `/api/contracts` endpoint)

---

### Step 5: Onboarding (when agreement is signed)
- Advance stage to `onboarded` or `active`
- Provision platform access (coordinate with Kevan for technical setup)
- For AI agents: Kevan will trigger Apostle Chain agent registration
- Log onboardedAt date (auto-set when stage = onboarded/active/funded)

---

### Step 6: Ongoing Management
- Active clients checked monthly minimum
- Paused clients checked every 2 weeks
- Send updates, check-ins using `followUp` email template
- Log all correspondence in comms system

---

## 5. OPERATING RULES — NON-NEGOTIABLE

1. **No NDA = No access.** No confidential platform info, API keys, or pricing shared before NDA is signed.

2. **No platform access before signed agreement.** MSA, SOW, or AI Agent Agreement must be fully executed before any account is provisioned.

3. **No commitments over $50K without Kevan.** All deals over $50,000 require Kevan's approval and co-signature.

4. **Every contact gets an intake record.** No exceptions — even referrals get logged.

5. **Buck owns sales + service client pipelines.** Kevan owns lender + AI agent pipelines. Do not cross manage without explicit authorization.

6. **Declined contacts stay in the system.** Set status to `declined`. Never delete — used for reporting and future reference.

7. **All communications go through comms system.** No "off-the-books" deals via personal email/text.

8. **KYC/AML required for financial products.** Any client using FTH Pay wallet / treasury features must complete identity verification.

9. **AI agents require operator identity.** We don't register anonymous agents. Period.

10. **Suspicious activity = pause + escalate.** If anything feels off (regulatory red flags, pressure to skip docs, unusual requests), pause the intake and escalate to Kevan immediately.

---

## 6. CONTACT & ESCALATION

| Person | Role | Contact |
|--------|------|---------|
| **Buck Vaughan** | Client Relations & Sales | buckvaughan3636@gmail.com · +1 (678) 687-2855 |
| **Kevan Burns** | CEO / Tech + Lender Lead | kevan@unykorn.org · +1 (321) 278-8323 |

**When to escalate to Kevan:**
- Any deal > $50K
- Anything involving lenders or AI agents
- Legal ambiguity or anything requiring contract modification
- Regulatory / compliance questions
- Technical platform integration questions
- Any client that feels off / red flags

---

## 7. COMMS API QUICK REFERENCE

**Base URL:** `https://comms.unykorn.org`
**Auth Header:** `X-Comms-Secret: ven-m-comms-2026`

| Action | Method | Endpoint |
|--------|--------|----------|
| List all | GET | `/api/intake` |
| Filter by type | GET | `/api/intake?type=sales` |
| Filter by assignee | GET | `/api/intake?assignedTo=buck` |
| Get summary | GET | `/api/intake/summary` |
| Get record | GET | `/api/intake/:id` |
| Create new | POST | `/api/intake` |
| Update fields | PATCH | `/api/intake/:id` |
| Advance stage | PATCH | `/api/intake/:id/stage` |
| Mark doc received | POST | `/api/intake/:id/doc` |

---

*This document governs all client intake operations for UnyKorn LLC and FTH Pay. Last reviewed: 2026.*

# VEN-M Correspondence & Contract Management System

All outbound and inbound correspondence for the **CB Oriente Portfolio** routes through **kevan@unykorn.com** via the Zoho Mail API. Every email is logged, every contract has a lifecycle, and every lender has a tracked stage in the funding pipeline.

---

## Architecture

```
comms/
├── index.js                  Express API server (port 4080)
├── package.json
├── .env                      Secrets — never committed
├── .env.example              Template
├── lib/
│   ├── zoho.js               Zoho Mail API client (OAuth2 auto-refresh)
│   ├── db.js                 JSON file database (no external DB needed)
│   ├── contacts.js           Lender CRM (stage machine)
│   ├── contracts.js          Contract lifecycle management
│   ├── correspondence.js     Email audit log
│   └── templates.js          All branded HTML email templates
├── routes/
│   ├── email.js              Email send API
│   ├── contacts.js           Contact CRUD API
│   └── contracts.js          Contract CRUD + send API
├── scripts/
│   ├── oauth-init.js         One-time Zoho OAuth setup wizard
│   ├── send-nda.js           CLI: send NDA to new lender
│   ├── status.js             CLI: view full pipeline status
│   └── zoho-test.js          CLI: verify Zoho API connection
└── data/
    ├── contacts.json         Lender database
    ├── contracts.json        Contract registry
    └── correspondence.json   Email audit trail
```

---

## First-Time Setup

### 1. Install dependencies
```powershell
cd comms
npm install
```

### 2. Authorize Zoho (one-time)
```powershell
npm run oauth
```
This opens a browser, walks you through Zoho OAuth consent for `kevan@unykorn.com`, and saves the refresh token to `.env` automatically.

### 3. Test the connection
```powershell
node scripts/zoho-test.js
```
Sends a test email to yourself. If it arrives, you're ready.

### 4. Start the server
```powershell
npm start
```
Server runs on `http://localhost:4080`

---

## Lender Pipeline Stages

| Stage | Meaning |
|-------|---------|
| `prospect` | Identified, not yet contacted |
| `outreach_sent` | Initial introduction email sent |
| `nda_sent` | NDA delivered, awaiting signature |
| `nda_signed` | NDA executed — diligence ready |
| `packet_sent` | Full 49-item diligence packet delivered |
| `term_sheet_received` | Lender returned a term sheet |
| `term_sheet_signed` | Term sheet executed |
| `credit_agreement_sent` | Final docs delivered |
| `funded` | ✅ Facility closed |
| `declined` | Lender passed |
| `stalled` | No response after follow-ups |

---

## API Reference

All endpoints require the header `X-Comms-Secret: ven-m-comms-2026` (set in `.env`).

### Email

| Method | Endpoint | Action |
|--------|----------|--------|
| `POST` | `/api/email/outreach` | Send initial outreach to contact |
| `POST` | `/api/email/nda` | Send NDA cover email |
| `POST` | `/api/email/packet` | Send diligence packet |
| `POST` | `/api/email/follow-up` | Send follow-up |
| `POST` | `/api/email/general` | Free-form email to contact |
| `POST` | `/api/email/send` | Raw HTML send |
| `GET`  | `/api/email/inbox` | View Zoho inbox |
| `GET`  | `/api/email/log` | View outbound log |

All workflow endpoints take `{ "contactId": "..." }` in the request body. They advance the contact stage, log the correspondence, and send via Zoho.

### Contacts

| Method | Endpoint | Action |
|--------|----------|--------|
| `GET`  | `/api/contacts` | List all (filter: `?stage=nda_sent`) |
| `POST` | `/api/contacts` | Create new contact |
| `GET`  | `/api/contacts/:id` | Get contact |
| `PATCH`| `/api/contacts/:id` | Update contact fields |
| `PATCH`| `/api/contacts/:id/stage` | Manually advance stage |
| `DELETE`| `/api/contacts/:id` | Remove contact |

### Contracts

| Method | Endpoint | Action |
|--------|----------|--------|
| `GET`  | `/api/contracts` | List all |
| `GET`  | `/api/contracts/summary` | Type/status counts |
| `POST` | `/api/contracts` | Create contract record |
| `PATCH`| `/api/contracts/:id/status` | Transition status |
| `PATCH`| `/api/contracts/:id/file` | Attach file path/URL |
| `POST` | `/api/contracts/:id/send-nda-cover` | Send NDA email + mark as sent |

### Dashboard

| Method | Endpoint | Action |
|--------|----------|--------|
| `GET`  | `/health` | System health |
| `GET`  | `/pipeline` | Full pipeline summary (JSON) |

---

## CLI Quickstart

### Add a lender and send NDA in one command
```powershell
node scripts/send-nda.js `
  --name "John Smith" `
  --email "j.smith@alphaassetlending.com" `
  --org "Alpha Asset Lending" `
  --category specialty_asset
```

### View pipeline status
```powershell
node scripts/status.js
```

### Add a lender via API
```powershell
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:4080/api/contacts" `
  -Headers @{"X-Comms-Secret"="ven-m-comms-2026";"Content-Type"="application/json"} `
  -Body '{"name":"Jane Doe","email":"jane@lender.com","organization":"XYZ Capital","category":"private_credit"}'
```

### Send outreach to that contact
```powershell
Invoke-RestMethod -Method POST `
  -Uri "http://localhost:4080/api/email/outreach" `
  -Headers @{"X-Comms-Secret"="ven-m-comms-2026";"Content-Type"="application/json"} `
  -Body '{"contactId":"<id from above>"}'
```

---

## Contract Lifecycle

```
draft → sent → under_review → negotiation → signed → executed
                                                    ↘ voided
```

### Example: NDA flow
```
POST /api/contracts         { type: "nda", contactId: "...", contactName: "..." }
POST /api/contracts/:id/send-nda-cover   ← sends email + marks sent + advances contact stage
PATCH /api/contracts/:id/status          { status: "signed", note: "Received signed PDF 2026-04-01" }
POST /api/email/packet      { contactId: "..." }   ← send diligence packet
```

---

## Email Templates

All emails are styled in the VEN-M dark-gold brand theme (`#c9a84c`). Templates:

1. **`outreach`** — Initial introduction to a new lender
2. **`ndaTransmittal`** — NDA cover letter
3. **`diligencePacket`** — Full package delivery with 8-section index
4. **`followUp`** — Days-since-last-contact follow-up
5. **`termSheetAck`** — Term sheet receipt acknowledgment
6. **`general`** — Free-form branded email

---

## Contact

**Miguel Silva** — Investments Danath Inc.  
kevan@unykorn.com | +1 (407) 705 7884  
390 N Orange Ave Suite 2300, Orlando FL 32801

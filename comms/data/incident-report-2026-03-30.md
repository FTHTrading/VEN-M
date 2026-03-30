# Incident Report — Email Freeze / Delivery Risk Review

Date: 2026-03-30
Prepared by: Copilot
System: VEN-M Comms (`comms.unykorn.org`)

## Executive Summary
No active Zoho account suspension was found today, but there is a historical Zoho enforcement event showing outbound mail was blocked previously due to rate-limit policy. Current startup failures are primarily operational (wrong directory launch and port collision), not account suspension.

## Evidence Collected

1) Historical Zoho block notice found in inbox
- Subject: `Zoho : Email Outgoing Blocked`
- From: `noreply@zoho.com`
- Received: `2025-12-05T23:48:42.817Z`
- Message metadata summary:
  - "Email outgoing ... has been blocked because your email outgoing rate has exceeded the allowed limit ... in accordance with Zoho Mail Usage policy"
  - Affected account: `kevan@unykorn.org`

2) Current process lock status
- `comms/data/process-lock.json` currently has:
  - `locked: true`
  - `enforceApprovalForMutations: true`
  - `strictIntegrity: true`
  - `outboundFreeze.enabled: false` (currently OFF)
- Integrity check result on protected files: `changedCount = 0`
- Conclusion: process lock is healthy and not currently freezing normal operations.

3) Policy audit log findings
- Freeze mode was enabled briefly during test and then disabled (same session).
- Log confirms one test block and one approved bypass during validation only.

4) Startup/runtime issues observed now
- Running `node index.js` from `C:\Users\Kevan` fails with `MODULE_NOT_FOUND` for `C:\Users\Kevan\index.js`.
- Running from correct comms folder can fail with `EADDRINUSE` when port `4080` is already in use.
- Port 4080 listener detected at time of test.

## Root Cause Analysis

Primary historical freeze cause:
- Zoho rate-limit violation in the past (high outbound rate), resulting in temporary outgoing block.

Current confusion source (today):
- Mixed operational failures made it look like a freeze:
  - Wrong working directory launches.
  - Port already in use (duplicate server instance).
  - Process lock behavior misunderstood as provider freeze.

## What We Did Wrong (Do Not Repeat)

1. Do not mass-send or rapid-loop emails without throttling.
2. Do not run server commands from the wrong directory (`C:\Users\Kevan`).
3. Do not start duplicate server instances on the same port.
4. Do not mutate protected APIs without explicit approval header in locked mode.
5. Do not disable logs/warehousing for inbound events.

## Permanent Prevention Rules

1. Launch discipline
- Always start from `C:\Users\Kevan\cb-oriente-portfolio\comms`.
- Preferred start command: `npm start` in comms directory.

2. Port hygiene
- Check listener before restart:
  - `Get-NetTCPConnection -LocalPort 4080 -State Listen`
- If needed, stop prior instance before relaunch.

3. Outbound safety
- Use freeze mode for review windows.
- Keep allowlist minimal during sensitive periods.
- Add paced sending (batch + delay) for large outreach campaigns.

4. Approval controls
- Keep `process-lock.json` locked with approval-required mutations.
- Require `X-Process-Approval` for all protected writes.

5. Monitoring
- Review `comms/data/policy-audit.log` daily.
- Review Zoho system emails weekly for policy/rate notices.

## Immediate Action Plan

1. Confirm a single active server instance on port 4080.
2. Keep outbound freeze OFF for normal operations, ON for controlled windows.
3. Add outbound rate limiter for batch send scripts (next hardening task).
4. Keep all inbound warehousing enabled to prevent client-loss/disorganization.

## Status
- Active provider-side freeze detected now: **No**
- Internal freeze mode currently active: **No** (`outboundFreeze.enabled=false`)
- System lock and integrity: **Healthy**

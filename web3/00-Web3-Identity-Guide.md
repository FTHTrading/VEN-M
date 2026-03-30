# UnyKorn Web3 Identity — `.unykorn` Registration Guide

**Brand:** UnyKorn (`unykorn.org`)  
**Web3 Handle:** `@unykorn`  
**Operator:** Kevan Burns — `kevan@unykorn.org`

---

## Layer 1 — Handshake TLD: `.unykorn`

Handshake (HNS) lets you **own the TLD itself** — `.unykorn` — meaning
you can issue `kevan.unykorn`, `pay.unykorn`, `api.unykorn` etc. with
zero ongoing registrar fees once the TLD is won.

### Register Steps

1. **Create a Namebase account** → [namebase.io](https://www.namebase.io)
2. **Search for `unykorn`** → [namebase.io/domains/unykorn](https://www.namebase.io/domains/unykorn)
3. **Fund your Namebase wallet** with HNS tokens (buy via Namebase directly with BTC or USD)
4. **Place a bid** — opening bids on unclaimed names are often $0–$5 USD equiv in HNS
5. **Auction period:** 720 blocks (~5 days) — highest bid after reveal wins
6. **After winning:** Set DNS records in Namebase dashboard

### DNS Records to Set on `.unykorn`

| Type | Name | Value |
|------|------|-------|
| A | @ | `[unykorn.org server IP]` |
| CNAME | comms | `comms.unykorn.org` |
| TXT | @ | `v=spf1 include:zoho.com ~all` |
| TXT | web3 | `evm=0x7d9a65d06dcc435a52D5880C6310Bd6E96c156DB` |
| TXT | xrpl | `xrpl=rsJ3PGGDH4vPpedjfVRe9YKTCf9BWu6TDC` |

### Sub-names to Register After TLD Win

| Name | Purpose |
|------|---------|
| `kevan.unykorn` | Kevan Burns identity / portfolio address |
| `pay.unykorn` | FTH Pay gateway |
| `api.unykorn` | API endpoint |
| `comms.unykorn` | Correspondence system |
| `ven-m.unykorn` | VEN-M portfolio portal |

---

## Layer 2 — ENS: `unykorn.eth`

ENS (Ethereum Name Service) for EVM ecosystem identity and payment routing.

### Register Steps

1. Go to [app.ens.domains/unykorn.eth](https://app.ens.domains/unykorn.eth)
2. Connect wallet: `0x7d9a65d06dcc435a52D5880C6310Bd6E96c156DB`
3. Check availability → Register (2-step process, ~$20–$40 USD in ETH)
4. Set records:
   - ETH address: `0x7d9a65d06dcc435a52D5880C6310Bd6E96c156DB`
   - Email: `kevan@unykorn.org`
   - URL: `https://unykorn.org`
   - Twitter: `@unykorn`
5. Set as primary name on the wallet

---

## Layer 3 — Unstoppable Domains: `unykorn.crypto`

Fallback/secondary Web3 domain for broader wallet compatibility.

1. Go to [unstoppabledomains.com](https://unstoppabledomains.com)
2. Search `unykorn` — pick a TLD (`.crypto`, `.nft`, `.x`, `.wallet`)
3. Mint (one-time fee, no renewal) — connects to EVM wallet
4. Set payout addresses for all chains

---

## Current Wallet Addresses (for Web3 Domain Resolution)

| Chain | Address |
|-------|---------|
| EVM (ETH/Polygon/Avalanche/Base) | `0x7d9a65d06dcc435a52D5880C6310Bd6E96c156DB` |
| XRPL | `rsJ3PGGDH4vPpedjfVRe9YKTCf9BWu6TDC` |
| Stellar | `GBJF54FBYPBVHR6Z3OKWWEMPF6QYPNH3RZZYX3E4V7AUMUWIEV7Z3DPX` |
| Apostle Chain (ATP/UNY) | Chain ID 7332 |

---

## Web3 Identity — Resolving `.unykorn` Locally

Until Handshake resolvers are widespread, configure clients to use HNS DNS:

**NextDNS (recommended):**  
Add `103.196.38.38` and `103.196.38.39` as custom DNS in your OS/browser.

**HNS-compatible browsers:**  
- [Impervious Browser](https://impervious.com) — native HNS support
- Firefox + NextDNS profile — add HNS resolver to the profile

---

## Integration with VEN-M Comms

The system already references Web3 identity:
- `comms/data/web3-identity.json` — full machine-readable identity config
- Portal page (`comms.unykorn.org`) includes Web3 identity block
- XRPL evidence anchor CID embedded in every outbound email footer

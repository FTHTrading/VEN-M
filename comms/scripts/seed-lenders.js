'use strict';
/**
 * seed-lenders.js — Idempotent seeder for all named lender prospects
 *
 * Usage:
 *   node scripts/seed-lenders.js
 *   node scripts/seed-lenders.js --dry-run   (shows what would be added)
 *   node scripts/seed-lenders.js --reset     (clears all existing then re-seeds)
 *
 * Idempotent: checks by email before inserting. Safe to run multiple times.
 */

require('dotenv').config();
const contacts = require('../lib/contacts');

const DRY_RUN = process.argv.includes('--dry-run');
const RESET   = process.argv.includes('--reset');

// ─────────────────────────────────────────────────────────────────────────────
// NAMED LENDER TARGETS — sourced from ops/04-Lender-Target-List.md
// ─────────────────────────────────────────────────────────────────────────────

const LENDERS = [

  // ── Category A: Specialty Asset / Hard Asset Lenders ──────────────────────
  {
    name:         'Lending Division — Sotheby\'s Financial Services',
    email:        'financialservices@sothebys.com',
    organization: 'Sotheby\'s Financial Services',
    role:         'Managing Director, Secured Lending',
    phone:        '+1 (212) 606 7000',
    category:     'specialty_asset',
    notes:        'Category A1. Art/gem Lombard lender. Contact MD of secured lending. Reference gemstone LTV + appraisal. sothebys.com/financial-services',
  },
  {
    name:         'Art Finance Team — Christie\'s',
    email:        'artfinance@christies.com',
    organization: 'Christie\'s Art Finance',
    role:         'Head of Art Finance',
    phone:        '+1 (212) 636 2000',
    category:     'specialty_asset',
    notes:        'Category A2. Accepts gemstone/collectible collateral. Contact Regional Director Americas. christies.com/services/art-finance',
  },
  {
    name:         'Originations — Athena Art Finance',
    email:        'originations@athenaartfinance.com',
    organization: 'Athena Art Finance (Yieldstreet)',
    role:         'Director of Originations',
    phone:        '+1 (212) 390 0551',
    category:     'specialty_asset',
    notes:        'Category A3. Now part of Yieldstreet. Specialty collateral loans. Submit via portal and follow with call. Lead with appraisal + SHA-256 chain.',
  },
  {
    name:         'Lending Team — The Fine Art Group',
    email:        'lending@thefineartgroup.com',
    organization: 'The Fine Art Group',
    role:         'Managing Director',
    phone:        '+44 20 7399 0700',
    category:     'specialty_asset',
    notes:        'Category A4. Hard asset advisory and lending. London + NY. Will review gem collateral with strong appraisal documentation.',
  },
  {
    name:         'Principal — Falcon Fine Art',
    email:        'info@falconfineart.com',
    organization: 'Falcon Fine Art',
    role:         'Managing Principal',
    phone:        '',
    category:     'specialty_asset',
    notes:        'Category A5. Specialist gemstone and art lender. Direct email to principal. Small firm — very responsive to well-documented files.',
  },
  {
    name:         'Lombard Desk — Julius Baer',
    email:        'lombard@juliusbaer.com',
    organization: 'Julius Baer Private Bank',
    role:         'Lombard Lending, Private Banking',
    phone:        '+41 58 888 11 11',
    category:     'specialty_asset',
    notes:        'Category A6. Classic Lombard lending against physical assets. Refer through private banker introduction. juliusbaer.com. USD-denominated facility possible.',
  },
  {
    name:         'Asset-Backed Lending — Pictet',
    email:        'contact@pictet.com',
    organization: 'Pictet & Cie',
    role:         'Head of Wealth Management Lending',
    phone:        '+41 22 704 10 00',
    category:     'specialty_asset',
    notes:        'Category A7. Geneva-based private bank. Lombard loans against physical assets including gemstones. Best approached through WM referral.',
  },
  {
    name:         'Collateral Lending — Lombard Odier',
    email:        'newbusiness@lombardodier.com',
    organization: 'Lombard Odier',
    role:         'Head of Collateral Finance',
    phone:        '+41 22 709 21 11',
    category:     'specialty_asset',
    notes:        'Category A8. Classic Lombard collateral loans. Geneva. Well-structured Alexandrite custody + insurance = strong application.',
  },
  {
    name:         'Private Banking — EFG International',
    email:        'efgbanking@efginternational.com',
    organization: 'EFG International',
    role:         'Private Banking — Americas',
    phone:        '+1 (305) 372 2000',
    category:     'specialty_asset',
    notes:        'Category A9. Miami office. Lombard lending. Florida-domiciled SPV meets their criteria. Good fit for Latin American principal.',
  },
  {
    name:         'Finance Services — Malca-Amit',
    email:        'info@malca-amit.com',
    organization: 'Malca-Amit Global',
    role:         'Director of Finance Services',
    phone:        '+1 (212) 972 6242',
    category:     'specialty_asset',
    notes:        'Category A10. Primary vault candidate AND has finance arm that does gemstone lending. NYC. Can combine vault + lender in one relationship. Very strong fit.',
  },

  // ── Category B: Trade Finance / Commodity Lenders ─────────────────────────
  {
    name:         'Latin America Desk — BNP Paribas Trade Finance',
    email:        'americas.tradefi@bnpparibas.com',
    organization: 'BNP Paribas',
    role:         'Head of Latin America Structured Trade Finance',
    phone:        '+1 (212) 471 8000',
    category:     'trade_finance',
    notes:        'Category B1. Major trade finance bank. Focus on Venezuelan project EBITDA + concession rights. NYC/Miami Latin America desk.',
  },
  {
    name:         'Structured Finance — ING Capital',
    email:        'ingcapital@ing.com',
    organization: 'ING Capital LLC',
    role:         'Head of Structured Commodity Finance',
    phone:        '+1 (212) 547 3000',
    category:     'trade_finance',
    notes:        'Category B2. Structured commodity + mining finance. Lead with limestone and coal revenue basis + Alexandrite as bridge collateral.',
  },
  {
    name:         'Latin America Coverage — Natixis CIB',
    email:        'latam@natixis.com',
    organization: 'Natixis CIB',
    role:         'Head of Latin America Corporate Finance',
    phone:        '+1 (212) 891 6100',
    category:     'trade_finance',
    notes:        'Category B3. Strong LatAm exposure. Energy and commodity specialist. Lead with Curaoil fuel infra + Fila Maestra coal export to Guyana.',
  },
  {
    name:         'Americas Desk — Crédit Agricole CIB',
    email:        'americas@ca-cib.com',
    organization: 'Crédit Agricole CIB',
    role:         'Structured Commodity Finance, Americas',
    phone:        '+1 (212) 261 7000',
    category:     'trade_finance',
    notes:        'Category B4. Strong commodity finance. NY Americas desk. ca-cib.com. Lead with mineral concession rights as secondary collateral.',
  },
  {
    name:         'Trade Finance Americas — Standard Chartered',
    email:        'tradefinance.americas@sc.com',
    organization: 'Standard Chartered Bank',
    role:         'Head of Trade Finance, Americas',
    phone:        '+1 (212) 667 0700',
    category:     'trade_finance',
    notes:        'Category B5. Emerging markets trade finance specialist. Strong in Latin American mining and energy. sc.com.',
  },
  {
    name:         'Corporate Banking — Itaú BBA International',
    email:        'itaubba.miami@itaubba.com',
    organization: 'Itaú BBA International',
    role:         'Head of Corporate Banking, Americas',
    phone:        '+1 (305) 755 4000',
    category:     'trade_finance',
    notes:        'Category B6. Largest LatAm investment bank. Miami desk. Mining and energy = core business. Spanish-language intro preferred. Strong Venezuela market coverage.',
  },
  {
    name:         'Latin America Operations — Banco Sabadell',
    email:        'americas@grupbancsabadell.com',
    organization: 'Banco Sabadell',
    role:         'Head of Americas Operations',
    phone:        '+1 (305) 375 0800',
    category:     'trade_finance',
    notes:        'Category B7. Miami office. Spanish-language intro. Latin American focus. SME-friendly for Venezuelan operational projects.',
  },

  // ── Category C: Private Credit Funds / Family Offices ─────────────────────
  {
    name:         'Originations — Golub Capital',
    email:        'originations@golubcapital.com',
    organization: 'Golub Capital',
    role:         'Director of Originations',
    phone:        '+1 (212) 750 6060',
    category:     'private_credit',
    notes:        'Category C1. Direct lending specialist. Asset-based focus. Chicago/NY. Submit 1-page executive summary first. Full model requested at NDA.',
  },
  {
    name:         'Direct Lending — Blue Owl Capital',
    email:        'directlending@blueowlcapital.com',
    organization: 'Blue Owl Capital',
    role:         'Head of Direct Lending Originations',
    phone:        '+1 (212) 668 8500',
    category:     'private_credit',
    notes:        'Category C2. Asset-based lending. $150B+ AUM. Submit via web origination portal. Hard asset + revenue basis = good fit.',
  },
  {
    name:         'Special Situations — Cerberus Capital',
    email:        'newbusiness@cerberuscapital.com',
    organization: 'Cerberus Capital Management',
    role:         'Managing Director, Special Situations',
    phone:        '+1 (212) 891 2100',
    category:     'private_credit',
    notes:        'Category C3. Special situations and hard assets. Will underwrite non-standard collateral. Lead with appraisal + Venezuelan project cash flows.',
  },
  {
    name:         'Originations — Monroe Capital',
    email:        'deals@monroecap.com',
    organization: 'Monroe Capital',
    role:         'Director of Originations',
    phone:        '+1 (312) 523 2360',
    category:     'private_credit',
    notes:        'Category C4. Asset-based direct lender. Chicago/Miami. Mid-market sweet spot ($10–50M). Good size fit for our $15–21M facility.',
  },
  {
    name:         'Portfolio — Churchill Asset Management',
    email:        'portfolio@churchillam.com',
    organization: 'Churchill Asset Management',
    role:         'Managing Director, Portfolio',
    phone:        '+1 (646) 432 2400',
    category:     'private_credit',
    notes:        'Category C5. Direct credit. Nuveen affiliate. Sector-agnostic lending with strong portfolio review. Submit executive summary to originations.',
  },
  {
    name:         'Family Office Relations — Stonehage Fleming',
    email:        'contact@stonehagefleming.com',
    organization: 'Stonehage Fleming',
    role:         'Director, Alternative Investments',
    phone:        '+44 20 7016 7000',
    category:     'family_office',
    notes:        'Category C8. Multi-family office with global hard asset appetite. UK-based. Private introduction preferred. Alexandrite as RWA well-positioned.',
  },

  // ── Category D: Development Finance Institutions ───────────────────────────
  {
    name:         'Venezuela/Mining Desk — IDB Invest',
    email:        'idbinvest@iadb.org',
    organization: 'IDB Invest (Inter-American Development Bank)',
    role:         'Investment Officer — Energy & Mining',
    phone:        '+1 (202) 623 1000',
    category:     'dfi',
    notes:        'Category D1. IADB private sector arm. Venezuela experience. Carbonatos + Fila Maestra = natural fit. Expect 6–12 month process. Concept note required first.',
  },
  {
    name:         'Latin America Projects — CAF',
    email:        'infocaf@caf.com',
    organization: 'CAF — Development Bank of Latin America',
    role:         'Investment Officer — Venezuela/Anzoátegui',
    phone:        '+58 212 209 2111',
    category:     'dfi',
    notes:        'Category D2. Strongest LatAm DFI for Venezuela. Sucre and Anzoátegui state projects align with CAF mandate. Formal project concept note required.',
  },
  {
    name:         'Concept Note Desk — DFC',
    email:        'info@dfc.gov',
    organization: 'US International Development Finance Corporation',
    role:         'Investment Officer — Latin America',
    phone:        '+1 (202) 336 8400',
    category:     'dfi',
    notes:        'Category D3. US government DFI. Florida-domiciled SPV = eligible borrower. dfc.gov. Apply through online portal. Energy infrastructure priority.',
  },
  {
    name:         'Latin America Desk — Proparco',
    email:        'contact@proparco.fr',
    organization: 'Proparco',
    role:         'Senior Investment Officer — Latin America',
    phone:        '+33 1 53 44 31 00',
    category:     'dfi',
    notes:        'Category D4. French DFI. Active in LatAm energy and infrastructure. Paris-based but LatAm deal experience. Submit concept note in English/French.',
  },
];

// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n  VEN-M Lender Seeder');
  console.log('  ─────────────────────────────────────');

  if (DRY_RUN) {
    console.log(`  DRY RUN — ${LENDERS.length} lenders would be seeded:\n`);
    LENDERS.forEach((l, i) => {
      console.log(`  ${String(i + 1).padStart(2)}. [${l.category.padEnd(16)}] ${l.organization}`);
    });
    console.log();
    return;
  }

  if (RESET) {
    const existing = contacts.list();
    existing.forEach(c => { try { contacts.remove(c.id); } catch (_) {} });
    console.log(`  Reset: removed ${existing.length} existing contact(s)`);
  }

  const existing = contacts.list();
  const existingEmails = new Set(existing.map(c => c.email.toLowerCase()));

  let added = 0;
  let skipped = 0;

  for (const lender of LENDERS) {
    if (existingEmails.has(lender.email.toLowerCase())) {
      console.log(`  SKIP  ${lender.organization} (already exists)`);
      skipped++;
      continue;
    }

    const contact = contacts.create(lender);
    console.log(`  ADD   [${lender.category.padEnd(16)}] ${lender.organization}  →  ${contact.id}`);
    added++;
  }

  console.log();
  console.log(`  ─────────────────────────────────────`);
  console.log(`  Added: ${added}  |  Skipped: ${skipped}  |  Total prospects: ${contacts.list().filter(c => c.stage === 'prospect').length}`);
  console.log();
  console.log('  Next steps:');
  console.log('    node scripts/status.js                          — view full pipeline');
  console.log('    node scripts/send-outreach-batch.js --dry-run  — preview outreach queue');
  console.log('    node scripts/send-outreach-batch.js            — send to all prospects');
  console.log();
}

seed().catch(err => { console.error('\nERROR:', err.message); process.exit(1); });

'use strict';
/**
 * send-nda.js — CLI script to send an NDA package to a lender contact
 *
 * Usage:
 *   node scripts/send-nda.js --name "John Smith" --email "john@lender.com" \
 *        --org "Acme Capital" --category specialty_asset
 *
 * Or interactively if no flags provided.
 */

require('dotenv').config();
const contacts  = require('../lib/contacts');
const templates = require('../lib/templates');
const zoho      = require('../lib/zoho');
const corr      = require('../lib/correspondence');

const args = process.argv.slice(2);
function arg(name) {
  const i = args.indexOf(`--${name}`);
  return i !== -1 ? args[i + 1] : null;
}

async function main() {
  let name     = arg('name');
  let email    = arg('email');
  let org      = arg('org') || '';
  let role     = arg('role') || '';
  let category = arg('category') || 'other';
  let existing = arg('contact-id');

  // Find or create contact
  let contact;
  if (existing) {
    contact = contacts.get(existing);
    if (!contact) { console.error(`Contact ${existing} not found`); process.exit(1); }
  } else {
    if (!name || !email) {
      console.error('Usage: node scripts/send-nda.js --name "..." --email "..." [--org "..." --category specialty_asset]');
      process.exit(1);
    }
    contact = contacts.create({ name, email, organization: org, role, category });
    console.log(`\n  Contact created: ${contact.id}`);
  }

  console.log(`\n  Sending NDA to: ${contact.name} <${contact.email}>`);

  const { subject, html } = templates.ndaTransmittal({
    recipientName: contact.name,
    organization:  contact.organization || '—',
  });

  await zoho.sendEmail({ to: contact.email, subject, html });

  contacts.advanceStage(contact.id, 'nda_sent');
  contacts.recordContact(contact.id);
  corr.log({
    direction:   'outbound',
    contactId:   contact.id,
    contactName: contact.name,
    to:          contact.email,
    from:        process.env.ZOHO_FROM_ADDRESS,
    subject,
    type:        'nda',
  });

  console.log(`  ✓ NDA email sent and stage advanced to 'nda_sent'\n`);
  console.log(`  Contact ID: ${contact.id}`);
  console.log(`  Subject:    ${subject}\n`);
}

main().catch(err => { console.error('\nERROR:', err.message); process.exit(1); });

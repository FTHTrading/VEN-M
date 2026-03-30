'use strict';
/**
 * send-buck-ops-brief.js
 * Sends the comprehensive operational briefing email to Buck Vaughan.
 * Run: node scripts/send-buck-ops-brief.js
 */
require('dotenv').config();
const zoho = require('../lib/zoho');
const tmpl = require('../lib/templates');
const corr = require('../lib/correspondence');

async function main() {
  console.log('Preparing Buck Vaughan ops brief...');

  const { subject, html } = tmpl.buckOpsBrief();

  await zoho.sendEmail({
    to:      'buckvaughan3636@gmail.com',
    subject,
    html,
  });

  corr.log({
    direction:   'outbound',
    contactName: 'Buck Vaughan',
    to:          'buckvaughan3636@gmail.com',
    from:        process.env.ZOHO_FROM_ADDRESS,
    subject,
    type:        'ops_brief',
  });

  console.log('Buck ops brief sent to buckvaughan3636@gmail.com');
}

main().catch(err => {
  console.error('Failed to send Buck ops brief:', err.message);
  process.exit(1);
});

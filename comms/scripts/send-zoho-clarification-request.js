'use strict';

require('dotenv').config();
const zoho = require('../lib/zoho');
const corr = require('../lib/correspondence');

async function main() {
  const to = ['pemchuila.rs@zohocorp.com', 'ebenezer.mohan@zohocorp.com'];
  const cc = 'support@zohomail.com';
  const subject = 'Request: Clarification on Outgoing Block + Full Team Pricing (kevan@unykorn.org)';

  const html = `
    <p>Hello Zoho Team,</p>
    <p>I am writing from <strong>kevan@unykorn.org</strong> to request clarification regarding a prior account event and to evaluate bringing our full operating group onto Zoho.</p>

    <p><strong>1) Outgoing Block Clarification</strong><br/>
    We received a notice: <em>"Zoho : Email Outgoing Blocked"</em> for our account. Please provide a detailed explanation of:</p>
    <ul>
      <li>The exact trigger(s) that caused the block (rate, pattern, policy category)</li>
      <li>The applicable sending thresholds/limits for our current plan (per hour/day/burst)</li>
      <li>Best-practice sending profile to avoid future blocks</li>
      <li>Any reputation/compliance actions you recommend on our side</li>
    </ul>

    <p><strong>2) Full Team Onboarding + Typical Fees</strong><br/>
    If we onboard our full team and operations through Zoho, please share typical pricing and setup guidance for:</p>
    <ul>
      <li>Mailboxes/users and role-based admin setup</li>
      <li>Shared inboxes/groups/aliases for operations and client communications</li>
      <li>Domain email best practices (SPF/DKIM/DMARC)</li>
      <li>Any volume or deliverability add-ons</li>
      <li>Implementation/onboarding support options and fees</li>
      <li>Any discounts for annual billing or team bundles</li>
    </ul>

    <p>We want to run this correctly and compliantly at scale. Please include recommended plan options and estimated monthly and annual totals for a small-to-mid team deployment.</p>

    <p>Thank you,<br/>
    Kevan Burns<br/>
    UnyKorn<br/>
    kevan@unykorn.org<br/>
    +1 (321) 278-8323</p>
  `;

  await zoho.sendEmail({ to, cc, subject, html });

  corr.log({
    direction: 'outbound',
    contactName: 'Zoho Team',
    to: to.join(','),
    from: process.env.ZOHO_FROM_ADDRESS,
    subject,
    type: 'vendor_escalation',
    notes: 'Requested block clarification + full team fee structure',
  });

  console.log('Zoho clarification request sent.');
}

main().catch((err) => {
  console.error('Failed to send Zoho clarification request:', err.message);
  process.exit(1);
});

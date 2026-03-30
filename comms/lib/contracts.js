'use strict';
/**
 * contracts.js — Contract lifecycle management
 *
 * Contract types:
 *   nda | loi | term_sheet | credit_agreement | asset_contribution |
 *   custody_control | insurance_certificate | security_agreement
 *
 * Contract statuses:
 *   draft → sent → under_review → negotiation → signed → executed | voided
 */

const { v4: uuid } = require('uuid');
const db = require('./db');

const COLLECTION = 'contracts';

const CONTRACT_TYPES = [
  'nda',
  'loi',
  'term_sheet',
  'credit_agreement',
  'asset_contribution',
  'custody_control',
  'insurance_certificate',
  'security_agreement',
  'board_resolution',
  'other',
];

const CONTRACT_STATUSES = [
  'draft',
  'sent',
  'under_review',
  'negotiation',
  'signed',
  'executed',
  'voided',
];

function list() {
  return db.readAll(COLLECTION);
}

function get(id) {
  return db.findById(COLLECTION, id);
}

/**
 * Create a new contract record.
 * @param {object} opts
 * @param {string} opts.type        - one of CONTRACT_TYPES
 * @param {string} opts.contactId   - counterparty contact ID
 * @param {string} opts.contactName - human-readable counterparty name
 * @param {string} [opts.notes]     - optional notes
 * @param {string} [opts.filePath]  - optional path/URL to document
 */
function create({ type, contactId, contactName, notes = '', filePath = '' }) {
  if (!CONTRACT_TYPES.includes(type)) throw new Error(`Unknown contract type: ${type}`);

  const contract = {
    id:           uuid(),
    type,
    contactId:    contactId || null,
    contactName:  contactName || '',
    status:       'draft',
    notes,
    filePath,
    sentAt:       null,
    signedAt:     null,
    executedAt:   null,
    voidedAt:     null,
    createdAt:    new Date().toISOString(),
    updatedAt:    new Date().toISOString(),
    history:      [{ status: 'draft', at: new Date().toISOString(), note: 'Created' }],
  };

  return db.insert(COLLECTION, contract);
}

function transition(id, status, note = '') {
  if (!CONTRACT_STATUSES.includes(status)) throw new Error(`Invalid status: ${status}`);

  const contract = db.findById(COLLECTION, id);
  if (!contract) return null;

  const now  = new Date().toISOString();
  const history = [...(contract.history || []), { status, at: now, note }];

  const patch = { status, history };
  if (status === 'sent')     patch.sentAt     = now;
  if (status === 'signed')   patch.signedAt   = now;
  if (status === 'executed') patch.executedAt = now;
  if (status === 'voided')   patch.voidedAt   = now;

  return db.update(COLLECTION, id, patch);
}

function setFile(id, filePath) {
  return db.update(COLLECTION, id, { filePath });
}

function byContact(contactId) {
  return db.query(COLLECTION, c => c.contactId === contactId);
}

function byStatus(status) {
  return db.query(COLLECTION, c => c.status === status);
}

function byType(type) {
  return db.query(COLLECTION, c => c.type === type);
}

function summary() {
  const all = db.readAll(COLLECTION);
  const byTypeCount = {};
  const byStatusCount = {};
  for (const c of all) {
    byTypeCount[c.type]     = (byTypeCount[c.type] || 0) + 1;
    byStatusCount[c.status] = (byStatusCount[c.status] || 0) + 1;
  }
  return { total: all.length, byType: byTypeCount, byStatus: byStatusCount };
}

module.exports = {
  list, get, create, transition, setFile, byContact, byStatus, byType, summary,
  CONTRACT_TYPES, CONTRACT_STATUSES,
};

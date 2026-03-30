'use strict';
/**
 * contacts.js — Lender / counterparty contact management
 *
 * Contact stages:
 *   prospect → outreach_sent → nda_sent → nda_signed →
 *   packet_sent → term_sheet_received → term_sheet_signed →
 *   credit_agreement_sent → funded | declined | stalled
 */

const { v4: uuid } = require('uuid');
const db = require('./db');

const COLLECTION = 'contacts';

const VALID_STAGES = [
  'prospect',
  'outreach_sent',
  'nda_sent',
  'nda_signed',
  'packet_sent',
  'term_sheet_received',
  'term_sheet_signed',
  'credit_agreement_sent',
  'funded',
  'declined',
  'stalled',
];

const LENDER_CATEGORIES = ['specialty_asset', 'trade_finance', 'private_credit', 'dfi', 'family_office', 'other'];

function list() {
  return db.readAll(COLLECTION);
}

function get(id) {
  return db.findById(COLLECTION, id);
}

function create({ name, email, organization, role, phone, category = 'other', notes = '' }) {
  if (!name || !email) throw new Error('name and email are required');
  if (!LENDER_CATEGORIES.includes(category)) throw new Error(`Unknown category: ${category}`);

  const contact = {
    id:           uuid(),
    name,
    email,
    organization: organization || '',
    role:         role || '',
    phone:        phone || '',
    category,
    stage:        'prospect',
    notes,
    createdAt:    new Date().toISOString(),
    updatedAt:    new Date().toISOString(),
    lastContactAt: null,
    correspondenceCount: 0,
  };

  return db.insert(COLLECTION, contact);
}

function advanceStage(id, stage) {
  if (!VALID_STAGES.includes(stage)) throw new Error(`Invalid stage: ${stage}`);
  return db.update(COLLECTION, id, { stage, lastContactAt: new Date().toISOString() });
}

function recordContact(id) {
  const contact = db.findById(COLLECTION, id);
  if (!contact) return null;
  return db.update(COLLECTION, id, {
    lastContactAt:       new Date().toISOString(),
    correspondenceCount: (contact.correspondenceCount || 0) + 1,
  });
}

function patch(id, fields) {
  const allowed = ['name', 'email', 'organization', 'role', 'phone', 'category', 'stage', 'notes'];
  const safe = Object.fromEntries(Object.entries(fields).filter(([k]) => allowed.includes(k)));
  return db.update(COLLECTION, id, safe);
}

function remove(id) {
  return db.remove(COLLECTION, id);
}

function byStage(stage) {
  return db.query(COLLECTION, c => c.stage === stage);
}

function byCategory(category) {
  return db.query(COLLECTION, c => c.category === category);
}

module.exports = {
  list, get, create, advanceStage, recordContact, patch, remove, byStage, byCategory,
  VALID_STAGES, LENDER_CATEGORIES,
};

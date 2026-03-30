'use strict';
/**
 * correspondence.js — Log all sent / received emails for audit trail
 */

const { v4: uuid } = require('uuid');
const db = require('./db');

const COLLECTION = 'correspondence';

function log({ direction, contactId, contactName, to, from, subject, type, contractId = null, notes = '' }) {
  const entry = {
    id:          uuid(),
    direction,   // 'outbound' | 'inbound'
    contactId:   contactId || null,
    contactName: contactName || '',
    to,
    from,
    subject,
    type,        // 'outreach' | 'nda' | 'packet' | 'follow_up' | 'term_sheet' | 'general'
    contractId:  contractId || null,
    notes,
    at:          new Date().toISOString(),
  };
  return db.insert(COLLECTION, entry);
}

function list()                  { return db.readAll(COLLECTION); }
function byContact(contactId)    { return db.query(COLLECTION, e => e.contactId === contactId); }
function byContract(contractId)  { return db.query(COLLECTION, e => e.contractId === contractId); }

module.exports = { log, list, byContact, byContract };

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

const CONTRACT_POLICY = {
  nda:                    { lane: 'core_system', system: 'unykorn_os',   owner: 'buck',  requiresKevanApproval: false, template: 'legal/05-General-NDA-Template.md' },
  loi:                    { lane: 'core_system', system: 'lender_pipeline', owner: 'kevan', requiresKevanApproval: true,  template: 'legal/09-Lender-LOI-Template.md' },
  term_sheet:             { lane: 'core_system', system: 'lender_pipeline', owner: 'kevan', requiresKevanApproval: true,  template: 'legal/10-Term-Sheet-Template.md' },
  credit_agreement:       { lane: 'core_system', system: 'lender_pipeline', owner: 'kevan', requiresKevanApproval: true,  template: 'legal/11-Credit-Agreement-Template.md' },
  asset_contribution:     { lane: 'core_system', system: 'lender_pipeline', owner: 'kevan', requiresKevanApproval: true,  template: '' },
  custody_control:        { lane: 'core_system', system: 'lender_pipeline', owner: 'kevan', requiresKevanApproval: true,  template: '' },
  insurance_certificate:  { lane: 'core_system', system: 'lender_pipeline', owner: 'kevan', requiresKevanApproval: true,  template: '' },
  security_agreement:     { lane: 'core_system', system: 'lender_pipeline', owner: 'kevan', requiresKevanApproval: true,  template: '' },
  board_resolution:       { lane: 'core_system', system: 'lender_pipeline', owner: 'kevan', requiresKevanApproval: true,  template: '' },
  service_agreement:      { lane: 'core_system', system: 'unykorn_os',   owner: 'buck',  requiresKevanApproval: true,  template: 'legal/12-Sales-Services-Agreement.md' },
  msa:                    { lane: 'core_system', system: 'unykorn_os',   owner: 'buck',  requiresKevanApproval: true,  template: 'legal/06-Service-Agreement-MSA.md' },
  sow:                    { lane: 'core_system', system: 'unykorn_os',   owner: 'buck',  requiresKevanApproval: true,  template: 'legal/06-Service-Agreement-MSA.md' },
  sales_agreement:        { lane: 'core_system', system: 'fth_pay',      owner: 'buck',  requiresKevanApproval: true,  template: 'legal/12-Sales-Services-Agreement.md' },
  ai_agent_agreement:     { lane: 'ai_system',   system: 'apostle_chain', owner: 'kevan', requiresKevanApproval: true,  template: 'legal/07-AI-Agent-Agreement.md' },
  data_processing_agreement: { lane: 'ai_system', system: 'apostle_chain', owner: 'kevan', requiresKevanApproval: true, template: 'legal/13-Data-Processing-Addendum.md' },
  other:                  { lane: 'core_system', system: 'unykorn_os',   owner: 'kevan', requiresKevanApproval: true,  template: '' },
};

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
  'service_agreement',
  'msa',
  'sow',
  'sales_agreement',
  'ai_agent_agreement',
  'data_processing_agreement',
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
function create({ type, contactId, contactName, clientType = '', lane = '', system = '', owner = '', notes = '', filePath = '' }) {
  if (!CONTRACT_TYPES.includes(type)) throw new Error(`Unknown contract type: ${type}`);

  const policy = CONTRACT_POLICY[type] || CONTRACT_POLICY.other;
  const resolvedLane = lane || (clientType === 'ai_agent' ? 'ai_system' : policy.lane);
  const resolvedSystem = system || (clientType === 'lender' ? 'lender_pipeline' : (clientType === 'sales' ? 'fth_pay' : policy.system));
  const resolvedOwner = owner || (clientType === 'lender' || clientType === 'ai_agent' ? 'kevan' : policy.owner);

  const contract = {
    id:           uuid(),
    type,
    operatingLane: resolvedLane,
    system:       resolvedSystem,
    owner:        resolvedOwner,
    requiresKevanApproval: policy.requiresKevanApproval,
    templatePath: policy.template,
    reviewStatus: 'pending_review',
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

function byOwner(owner) {
  return db.query(COLLECTION, c => c.owner === owner);
}

function bySystem(system) {
  return db.query(COLLECTION, c => c.system === system);
}

function byLane(lane) {
  return db.query(COLLECTION, c => c.operatingLane === lane);
}

function policyMatrix() {
  return Object.entries(CONTRACT_POLICY).map(([type, cfg]) => ({ type, ...cfg }));
}

function summary() {
  const all = db.readAll(COLLECTION);
  const byTypeCount = {};
  const byStatusCount = {};
  const byOwnerCount = {};
  const bySystemCount = {};
  const byLaneCount = {};
  for (const c of all) {
    byTypeCount[c.type]     = (byTypeCount[c.type] || 0) + 1;
    byStatusCount[c.status] = (byStatusCount[c.status] || 0) + 1;
    byOwnerCount[c.owner || 'unassigned'] = (byOwnerCount[c.owner || 'unassigned'] || 0) + 1;
    bySystemCount[c.system || 'unspecified'] = (bySystemCount[c.system || 'unspecified'] || 0) + 1;
    byLaneCount[c.operatingLane || 'unspecified'] = (byLaneCount[c.operatingLane || 'unspecified'] || 0) + 1;
  }
  return {
    total: all.length,
    byType: byTypeCount,
    byStatus: byStatusCount,
    byOwner: byOwnerCount,
    bySystem: bySystemCount,
    byLane: byLaneCount,
  };
}

module.exports = {
  list, get, create, transition, setFile, byContact, byStatus, byType, byOwner, bySystem, byLane, summary,
  CONTRACT_TYPES, CONTRACT_STATUSES, CONTRACT_POLICY, policyMatrix,
};

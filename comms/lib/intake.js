'use strict';
/**
 * intake.js — Unified client intake manager
 *
 * Client types:
 *   lender    → CB Oriente lender pipeline (system: lender_pipeline)
 *   client    → UnyKorn OS service clients (system: unykorn_os)
 *   ai_agent  → Apostle Chain AI agents (system: apostle_chain)
 *   sales     → Sales leads / prospects (system: fth_pay)
 *
 * Each type has its own stage pipeline, required docs, and default assignee.
 */

const { v4: uuid } = require('uuid');
const db = require('./db');

const COLLECTION = 'clients';

const CLIENT_TYPES = ['lender', 'client', 'ai_agent', 'sales'];

const OPERATING_LANE_BY_TYPE = {
  lender:   'core_system',
  client:   'core_system',
  sales:    'core_system',
  ai_agent: 'ai_system',
};

const SYSTEM_BY_TYPE = {
  lender:   'lender_pipeline',
  client:   'unykorn_os',
  ai_agent: 'apostle_chain',
  sales:    'fth_pay',
};

const DEFAULT_ASSIGNEE = {
  lender:   'kevan',
  client:   'buck',
  ai_agent: 'kevan',
  sales:    'buck',
};

const STAGES_BY_TYPE = {
  lender: [
    'prospect', 'outreach_sent', 'nda_sent', 'nda_signed',
    'packet_sent', 'term_sheet_received', 'term_sheet_signed',
    'credit_agreement_sent', 'funded', 'declined', 'stalled',
  ],
  client: [
    'lead', 'discovery', 'proposal_sent', 'agreement_sent',
    'onboarded', 'active', 'paused', 'churned',
  ],
  ai_agent: [
    'pending_registration', 'registered', 'provisioned',
    'funded', 'active', 'suspended', 'terminated',
  ],
  sales: [
    'lead', 'qualified', 'discovery', 'proposal',
    'negotiation', 'closed_won', 'closed_lost',
  ],
};

const REQUIRED_DOCS_BY_TYPE = {
  lender:   ['nda', 'investor_profile', 'source_of_funds', 'aml_kyc'],
  client:   ['nda', 'kyc_aml', 'service_agreement', 'use_case_description', 'company_registration'],
  ai_agent: ['agent_registration_form', 'operator_identity', 'intended_use_declaration', 'ai_agent_agreement'],
  sales:    ['discovery_call_notes', 'proposal'],
};

const CONTRACTS_BY_TYPE = {
  lender:   ['nda', 'loi', 'term_sheet', 'credit_agreement'],
  client:   ['nda', 'service_agreement', 'msa', 'sow'],
  ai_agent: ['ai_agent_agreement', 'data_processing_agreement'],
  sales:    ['nda', 'sales_agreement'],
};

// ── CRUD ─────────────────────────────────────────────────────────────────────

function list() { return db.readAll(COLLECTION); }
function get(id) { return db.findById(COLLECTION, id); }

/**
 * Create a new client intake record.
 * @param {object} opts
 * @param {'lender'|'client'|'ai_agent'|'sales'} opts.type
 * @param {string} opts.name
 * @param {string} opts.email
 * @param {string} [opts.organization]
 * @param {string} [opts.phone]
 * @param {string} [opts.product]            Which product/service they're interested in
 * @param {string} [opts.source]             'buck'|'kevan'|'inbound'|'api'|'referral'
 * @param {string} [opts.assignedTo]         Override default assignee
 * @param {string} [opts.notes]
 * @param {object} [opts.agentConfig]        For ai_agent: { label, purpose, operatorWallet }
 */
function create({ type, name, email, organization = '', phone = '', product = '', source = 'manual', assignedTo, notes = '', agentConfig = null }) {
  if (!CLIENT_TYPES.includes(type)) {
    throw new Error(`Unknown client type: "${type}". Valid: ${CLIENT_TYPES.join(', ')}`);
  }
  if (!name || !email) throw new Error('name and email are required');

  const record = {
    id:           uuid(),
    type,
    operatingLane: OPERATING_LANE_BY_TYPE[type],
    system:       SYSTEM_BY_TYPE[type],
    name,
    email,
    organization,
    phone,
    product,
    source,
    assignedTo:   assignedTo || DEFAULT_ASSIGNEE[type],
    stage:        STAGES_BY_TYPE[type][0],
    status:       'active',
    notes,
    requiredDocs: [...REQUIRED_DOCS_BY_TYPE[type]],
    docsReceived: [],
    contractIds:  [],
    agentConfig:  agentConfig || null,
    createdAt:    new Date().toISOString(),
    updatedAt:    new Date().toISOString(),
    onboardedAt:  null,
  };

  return db.insert(COLLECTION, record);
}

function advanceStage(id, stage) {
  const record = db.findById(COLLECTION, id);
  if (!record) return null;
  const valid = STAGES_BY_TYPE[record.type];
  if (!valid.includes(stage)) throw new Error(`Invalid stage '${stage}' for type '${record.type}'. Valid: ${valid.join(', ')}`);

  const patch = { stage, updatedAt: new Date().toISOString() };
  if (['onboarded', 'funded', 'active', 'closed_won'].includes(stage)) {
    patch.onboardedAt = new Date().toISOString();
  }
  return db.update(COLLECTION, id, patch);
}

function receiveDoc(id, doc) {
  const record = db.findById(COLLECTION, id);
  if (!record) return null;
  const docsReceived = [...(record.docsReceived || [])];
  if (!docsReceived.includes(doc)) docsReceived.push(doc);
  return db.update(COLLECTION, id, { docsReceived, updatedAt: new Date().toISOString() });
}

function linkContract(id, contractId) {
  const record = db.findById(COLLECTION, id);
  if (!record) return null;
  const contractIds = [...(record.contractIds || []), contractId];
  return db.update(COLLECTION, id, { contractIds, updatedAt: new Date().toISOString() });
}

function patch(id, fields) {
  const allowed = ['name', 'email', 'organization', 'phone', 'product', 'source',
                   'assignedTo', 'stage', 'status', 'notes', 'agentConfig'];
  const safe = Object.fromEntries(Object.entries(fields).filter(([k]) => allowed.includes(k)));
  safe.updatedAt = new Date().toISOString();
  return db.update(COLLECTION, id, safe);
}

function remove(id) { return db.remove(COLLECTION, id); }

// ── Queries ───────────────────────────────────────────────────────────────────

function byType(type)         { return db.query(COLLECTION, c => c.type === type); }
function byAssignee(who)      { return db.query(COLLECTION, c => c.assignedTo === who); }
function byStage(stage)       { return db.query(COLLECTION, c => c.stage === stage); }
function bySystem(system)     { return db.query(COLLECTION, c => c.system === system); }
function byLane(lane)         { return db.query(COLLECTION, c => c.operatingLane === lane); }

function summary() {
  const all = db.readAll(COLLECTION);
  const out = { total: all.length, byType: {}, bySystem: {}, byLane: {}, byAssignee: {}, active: 0 };
  const terminalStages = new Set(['funded', 'closed_won', 'closed_lost', 'churned', 'declined', 'stalled', 'terminated']);
  for (const c of all) {
    out.byType[c.type]         = (out.byType[c.type] || 0) + 1;
    out.bySystem[c.system]     = (out.bySystem[c.system] || 0) + 1;
    out.byLane[c.operatingLane] = (out.byLane[c.operatingLane] || 0) + 1;
    out.byAssignee[c.assignedTo] = (out.byAssignee[c.assignedTo] || 0) + 1;
    if (!terminalStages.has(c.stage)) out.active++;
  }
  return out;
}

module.exports = {
  list, get, create, advanceStage, receiveDoc, linkContract, patch, remove,
  byType, byAssignee, byStage, bySystem, byLane, summary,
  CLIENT_TYPES, STAGES_BY_TYPE, REQUIRED_DOCS_BY_TYPE, CONTRACTS_BY_TYPE,
  SYSTEM_BY_TYPE, DEFAULT_ASSIGNEE, OPERATING_LANE_BY_TYPE,
};

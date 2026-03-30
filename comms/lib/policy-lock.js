'use strict';

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.resolve(__dirname, '../data');
const LOCK_FILE = path.join(DATA_DIR, 'process-lock.json');
const DAEMON_RULES_FILE = path.join(DATA_DIR, 'daemon-instructions.json');
const AUDIT_LOG_FILE = path.join(DATA_DIR, 'policy-audit.log');

const DEFAULT_LOCK = {
  locked: true,
  enforceApprovalForMutations: true,
  strictIntegrity: true,
  approvalHeader: 'x-process-approval',
  protectedApiPrefixes: ['/api/email', '/api/contacts', '/api/contracts', '/api/intake'],
  protectedFiles: [
    'comms/data/intake-rules.json',
    'comms/lib/intake.js',
    'comms/lib/contracts.js',
    'comms/lib/templates.js',
    'comms/lib/daemon.js',
    'comms/routes/intake.js',
    'comms/routes/contracts.js',
    'legal/08-Intake-SOP.md',
  ],
  baselineHashes: {},
  updatedAt: new Date().toISOString(),
};

const DEFAULT_DAEMON_RULES = {
  mode: 'strict',
  autoProcessInbound: true,
  autoCreateInboundSalesLead: true,
  autoAdvanceKnownContactStages: true,
  requireInboundWarehouseLog: true,
  createSalesLeadAsType: 'sales',
  assignInboundSalesTo: 'buck',
  note: 'Change only with explicit approval from Kevan via process approval token.',
  updatedAt: new Date().toISOString(),
};

function sha256File(absPath) {
  const data = fs.readFileSync(absPath);
  return crypto.createHash('sha256').update(data).digest('hex');
}

function toAbsFromRepoRoot(repoRoot, relPath) {
  return path.resolve(repoRoot, relPath);
}

function appendAudit(message, meta = {}) {
  const line = JSON.stringify({ at: new Date().toISOString(), message, ...meta });
  fs.appendFileSync(AUDIT_LOG_FILE, line + '\n');
}

function ensureLockFiles(repoRoot) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  if (!fs.existsSync(LOCK_FILE)) {
    const initial = { ...DEFAULT_LOCK };
    const baselineHashes = {};
    for (const rel of initial.protectedFiles) {
      const abs = toAbsFromRepoRoot(repoRoot, rel);
      if (fs.existsSync(abs)) baselineHashes[rel] = sha256File(abs);
    }
    initial.baselineHashes = baselineHashes;
    fs.writeFileSync(LOCK_FILE, JSON.stringify(initial, null, 2));
    appendAudit('process lock created', { file: LOCK_FILE });
  }

  if (!fs.existsSync(DAEMON_RULES_FILE)) {
    fs.writeFileSync(DAEMON_RULES_FILE, JSON.stringify(DEFAULT_DAEMON_RULES, null, 2));
    appendAudit('daemon instructions created', { file: DAEMON_RULES_FILE });
  }
}

function readLock() {
  try {
    return JSON.parse(fs.readFileSync(LOCK_FILE, 'utf8'));
  } catch {
    return { ...DEFAULT_LOCK };
  }
}

function readDaemonRules() {
  try {
    return JSON.parse(fs.readFileSync(DAEMON_RULES_FILE, 'utf8'));
  } catch {
    return { ...DEFAULT_DAEMON_RULES };
  }
}

function refreshBaselineHashes(repoRoot) {
  const lock = readLock();
  const next = { ...lock, baselineHashes: {}, updatedAt: new Date().toISOString() };
  for (const rel of lock.protectedFiles || []) {
    const abs = toAbsFromRepoRoot(repoRoot, rel);
    if (fs.existsSync(abs)) next.baselineHashes[rel] = sha256File(abs);
  }
  fs.writeFileSync(LOCK_FILE, JSON.stringify(next, null, 2));
  appendAudit('baseline hashes refreshed', { count: Object.keys(next.baselineHashes).length });
  return next;
}

function integrityReport(repoRoot) {
  const lock = readLock();
  const report = [];
  for (const rel of lock.protectedFiles || []) {
    const abs = toAbsFromRepoRoot(repoRoot, rel);
    const exists = fs.existsSync(abs);
    const currentHash = exists ? sha256File(abs) : null;
    const baselineHash = (lock.baselineHashes || {})[rel] || null;
    const status = !exists ? 'missing' : (!baselineHash ? 'untracked' : (baselineHash === currentHash ? 'ok' : 'changed'));
    report.push({ file: rel, status, baselineHash, currentHash });
  }
  return report;
}

function hasIntegrityViolations(repoRoot) {
  return integrityReport(repoRoot).some((r) => r.status === 'changed' || r.status === 'missing');
}

function isProtectedMutation(req, lock) {
  const isMutation = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method);
  if (!isMutation) return false;
  const prefixes = lock.protectedApiPrefixes || [];
  return prefixes.some((p) => req.path.startsWith(p));
}

function enforceProcessLock(repoRoot) {
  return (req, res, next) => {
    const lock = readLock();
    if (!lock.locked) return next();

    if (!isProtectedMutation(req, lock)) return next();

    if (lock.strictIntegrity && hasIntegrityViolations(repoRoot)) {
      appendAudit('blocked mutation due to integrity violation', { method: req.method, path: req.path, ip: req.ip });
      return res.status(423).json({ error: 'Process lock active: integrity check failed. Mutations blocked.' });
    }

    if (!lock.enforceApprovalForMutations) return next();

    const headerName = (lock.approvalHeader || 'x-process-approval').toLowerCase();
    const provided = req.headers[headerName];
    const required = process.env.PROCESS_APPROVAL_CODE;

    if (!required || provided !== required) {
      appendAudit('blocked mutation missing approval', { method: req.method, path: req.path, ip: req.ip });
      return res.status(423).json({ error: `Process lock active: mutation requires ${headerName} approval.` });
    }

    appendAudit('approved mutation', { method: req.method, path: req.path, ip: req.ip });
    next();
  };
}

module.exports = {
  LOCK_FILE,
  DAEMON_RULES_FILE,
  AUDIT_LOG_FILE,
  ensureLockFiles,
  readLock,
  readDaemonRules,
  refreshBaselineHashes,
  integrityReport,
  hasIntegrityViolations,
  enforceProcessLock,
  appendAudit,
};

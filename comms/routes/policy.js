'use strict';

const express = require('express');
const path = require('path');
const router = express.Router();
const policy = require('../lib/policy-lock');

const REPO_ROOT = path.resolve(__dirname, '../..');

// GET /api/policy/status
router.get('/status', (req, res) => {
  const lock = policy.readLock();
  const report = policy.integrityReport(REPO_ROOT);
  const changed = report.filter((r) => r.status !== 'ok');
  res.json({
    ok: true,
    lock,
    integrity: {
      total: report.length,
      changedCount: changed.length,
      changed,
    },
  });
});

// GET /api/policy/daemon
router.get('/daemon', (req, res) => {
  const rules = policy.readDaemonRules();
  res.json({ ok: true, rules });
});

// POST /api/policy/refresh-baseline
router.post('/refresh-baseline', (req, res) => {
  const required = process.env.PROCESS_APPROVAL_CODE;
  const provided = req.headers['x-process-approval'];
  if (!required || provided !== required) {
    return res.status(403).json({ error: 'x-process-approval required' });
  }

  const lock = policy.refreshBaselineHashes(REPO_ROOT);
  return res.json({ ok: true, lock });
});

module.exports = router;

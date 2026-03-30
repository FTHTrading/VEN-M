'use strict';
/**
 * start-daemon.js
 *
 * Standalone launcher for the VEN-M inbound email polling daemon.
 * Run as a background process alongside the main server.
 *
 * Usage:  node scripts/start-daemon.js
 */

require('dotenv').config();
const daemon = require('../lib/daemon');

daemon.start().catch(err => {
  console.error('[daemon] Fatal startup error:', err.message);
  process.exit(1);
});

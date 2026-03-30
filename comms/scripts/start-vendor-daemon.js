'use strict';

const daemon = require('../lib/vendor-daemon');

daemon.start().catch((err) => {
  console.error('[vendor-daemon] startup error:', err.message);
  process.exit(1);
});

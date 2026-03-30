'use strict';
/**
 * db.js — lightweight JSON file database
 * Provides read/write/find/update/delete on any data/*.json collection.
 */

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.resolve(__dirname, '../data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function filePath(collection) {
  return path.join(DATA_DIR, `${collection}.json`);
}

function readAll(collection) {
  const fp = filePath(collection);
  if (!fs.existsSync(fp)) return [];
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
  catch { return []; }
}

function writeAll(collection, records) {
  fs.writeFileSync(filePath(collection), JSON.stringify(records, null, 2));
}

function findById(collection, id) {
  return readAll(collection).find(r => r.id === id) || null;
}

function insert(collection, record) {
  const all = readAll(collection);
  all.push(record);
  writeAll(collection, all);
  return record;
}

function update(collection, id, patch) {
  const all = readAll(collection);
  const idx = all.findIndex(r => r.id === id);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch, updatedAt: new Date().toISOString() };
  writeAll(collection, all);
  return all[idx];
}

function remove(collection, id) {
  const all = readAll(collection);
  const next = all.filter(r => r.id !== id);
  writeAll(collection, next);
  return next.length < all.length;
}

function query(collection, predicate) {
  return readAll(collection).filter(predicate);
}

module.exports = { readAll, writeAll, findById, insert, update, remove, query };

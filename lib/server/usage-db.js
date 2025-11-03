// Simple file-based usage DB for counting tool uses per client (IP + token)
// This is intentionally small and dependency-free. It stores a JSON map at
// `data/usage.json` keyed by `${ip}::${token}` with { count, lastUsed }.

import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'usage.json');

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
}

async function readDB() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (e) {
    return {};
  }
}

async function writeDB(db) {
  const tmp = DB_PATH + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), 'utf8');
  await fs.rename(tmp, DB_PATH);
}

function keyFor(ip, token) {
  const t = token ? String(token) : '';
  return `${ip}::${t}`;
}

export async function getUsage(ip, token) {
  await ensureDir();
  const db = await readDB();
  const k = keyFor(ip, token);
  return db[k] || { count: 0, lastUsed: null, ip, token };
}

export async function incrementUsage(ip, token) {
  await ensureDir();
  const db = await readDB();
  const k = keyFor(ip, token);
  const now = new Date().toISOString();
  const rec = db[k] || { count: 0, lastUsed: null, ip, token };
  rec.count = (rec.count || 0) + 1;
  rec.lastUsed = now;
  db[k] = rec;
  await writeDB(db);
  return rec;
}

export async function canUse(ip, token, limit = 5) {
  const rec = await getUsage(ip, token);
  return (rec.count || 0) < limit;
}

export async function remaining(ip, token, limit = 5) {
  const rec = await getUsage(ip, token);
  return Math.max(0, limit - (rec.count || 0));
}

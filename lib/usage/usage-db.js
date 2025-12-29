// Simple file-based usage DB for counting tool uses per client (IP + token)
// This is intentionally small and dependency-free. It stores a JSON map at
// `data/usage.json` keyed by `${ip}::${token}` with { count, lastUsed }.

import fs from 'fs/promises';
import path from 'path';

// Lightweight file-based usage tracking. Only retained functions:
// - incrementUsage(ip, token)
// - canUse(ip, token, limit)
// - remaining(ip, token, limit)
// Premium bypass retained via checkPremiumStatus.

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'usage.json');

async function ensureDir() {
  try { await fs.mkdir(DATA_DIR, { recursive: true }); } catch {}
}

async function readDB() {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(raw || '{}');
  } catch {
    return {};
  }
}

async function writeDB(db) {
  const tmp = DB_PATH + '.tmp';
  await fs.writeFile(tmp, JSON.stringify(db, null, 2), 'utf8');
  await fs.rename(tmp, DB_PATH);
}

function keyFor(ip, token) {
  return `${ip}::${token ? String(token) : ''}`;
}

export async function incrementUsage(ip, token) {
  await ensureDir();
  const db = await readDB();
  const k = keyFor(ip, token);
  const now = new Date().toISOString();
  const rec = db[k] || { count: 0, lastUsed: null };
  rec.count = (rec.count || 0) + 1;
  rec.lastUsed = now;
  db[k] = rec;
  await writeDB(db);
  return rec;
}

export async function canUse(ip, token, limit = 5) {
  const isPremium = await checkPremiumStatus(ip, token);
  if (isPremium) return true;
  const db = await readDB();
  const rec = db[keyFor(ip, token)] || { count: 0 };
  return (rec.count || 0) < limit;
}

export async function remaining(ip, token, limit = 5) {
  const isPremium = await checkPremiumStatus(ip, token);
  if (isPremium) return Infinity;
  const db = await readDB();
  const rec = db[keyFor(ip, token)] || { count: 0 };
  return Math.max(0, limit - (rec.count || 0));
}

// Premium detection based on orders.json (approved or captured)
async function checkPremiumStatus(ip, token) {
  try {
    const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
    const ordersData = await fs.readFile(ordersPath, 'utf-8');
    const { orders } = JSON.parse(ordersData);

    // Find approved orders for this user
    const approvedOrders = orders.filter(
      (order) =>
        order.ip === ip &&
        (order.status === 'APPROVED' || order.status === 'CAPTURED')
    );

    return approvedOrders.length > 0;
  } catch {
    return false;
  }
}

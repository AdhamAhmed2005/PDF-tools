import { incrementUsage, canUse, remaining } from '../lib/server/usage-db.js';

async function run() {
  const ip = '127.0.0.1';
  const token = 'test-token';
  console.log('Starting usage test for', ip, token);
  console.log('Can use (before):', await canUse(ip, token, 5));
  console.log('Remaining (before):', await remaining(ip, token, 5));
  console.log('Incrementing...');
  const rec = await incrementUsage(ip, token);
  console.log('After increment:', rec);
  console.log('Can use (after):', await canUse(ip, token, 5));
  console.log('Remaining (after):', await remaining(ip, token, 5));
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

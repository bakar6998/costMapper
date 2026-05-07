import { createClient } from 'redis';

const client = createClient({ url: process.env.REDIS_URL || 'redis://localhost:6379' });

client.on('error', (err) => console.error('Redis error:', err));

await client.connect();

export async function getCache(key) {
  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
}

export async function setCache(key, value, ttlSeconds = 3600) {
  await client.set(key, JSON.stringify(value), { EX: ttlSeconds });
}

export default client;

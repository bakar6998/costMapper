import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { getCache, setCache } from '../cache/redis.js';

const router = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/', async (req, res) => {
  const { city, country } = req.body;

  if (!city || !country) {
    return res.status(400).json({ error: 'city and country are required' });
  }

  const cacheKey = `cost:${city.toLowerCase()}:${country.toLowerCase()}`;
  const cached = await getCache(cacheKey);
  if (cached) return res.json(cached);

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system:
      'You are a cost-of-living expert. When given a city and country, respond with a concise JSON object containing: summary (2-3 sentence overview), monthly_rent_usd (range as string), meal_usd (average meal cost), transport_monthly_usd (number), internet_monthly_usd (number), overall_index (1-10 where 10 is most expensive). Only respond with valid JSON, no extra text.',
    messages: [{ role: 'user', content: `City: ${city}, Country: ${country}` }],
  });

  const data = JSON.parse(message.content[0].text);
  await setCache(cacheKey, data);
  res.json(data);
});

export default router;

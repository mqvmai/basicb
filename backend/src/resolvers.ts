import { Redis } from "ioredis";
import { getPlaces, getPlace } from "./mockData.js";

const redis = new Redis({
  host: "localhost",
  port: 6379,
  lazyConnect: true,
  maxRetriesPerRequest: 0,
  retryStrategy: () => null,
});
redis.connect().catch(() => console.warn("Redis unavailable — caching disabled"));

const CACHE_TTL = 60 * 10;

export const resolvers = {
  Query: {
    places: async (_: unknown, { city, category }: { city: string; category?: string }) => {
      const cacheKey = `places:${city.toLowerCase()}:${category ?? "all"}`;

      try {
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached);
      } catch {}

      const results = getPlaces(city, category);

      try {
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(results));
      } catch {}

      return results;
    },

    place: async (_: unknown, { id }: { id: string }) => {
      const cacheKey = `place:${id}`;

      try {
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached);
      } catch {}

      const result = getPlace(id);
      if (!result) return null;

      try {
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
      } catch {}

      return result;
    },
  },
};

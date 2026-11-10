import { Redis } from "ioredis";
import { fetchPlaces, fetchPlace, fetchAutocomplete } from "./googlePlaces.js";

const redis = new Redis({
  host: "localhost",
  port: 6379,
  lazyConnect: true,
  maxRetriesPerRequest: 0,
  retryStrategy: () => null,
});
redis.connect().catch(() => console.warn("Redis unavailable — caching disabled"));

const CACHE_TTL = 60 * 60; // 1 hour (Places API data is stable)

export const resolvers = {
  Query: {
    places: async (_: unknown, { city, category }: { city: string; category?: string }) => {
      const cacheKey = `places:${city.toLowerCase()}:${category ?? "all"}`;

      try {
        const cached = await redis.get(cacheKey);
        if (cached) return JSON.parse(cached);
      } catch {}

      const results = await fetchPlaces(city, category);

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

      const result = await fetchPlace(id);
      if (!result) return null;

      try {
        await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(result));
      } catch {}

      return result;
    },

    autocomplete: async (_: unknown, { input }: { input: string }) => {
      if (input.length < 2) return [];
      return fetchAutocomplete(input);
    },
  },
};

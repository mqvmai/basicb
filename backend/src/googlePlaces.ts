import type { Place } from "./types.js";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY!;
const BASE = "https://places.googleapis.com/v1";

const FIELD_MASK =
  "places.id,places.displayName,places.formattedAddress,places.location," +
  "places.rating,places.userRatingCount,places.priceLevel,places.photos,places.types";

const PRICE_MAP: Record<string, number> = {
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
};

const CATEGORY_TYPE: Record<string, string> = {
  restaurants: "restaurant",
  museums: "museum",
  parks: "park",
  landmarks: "tourist_attraction",
};

function detectCategory(types: string[]): string {
  if (types.some((t) => t === "restaurant" || t === "food")) return "restaurants";
  if (types.includes("museum")) return "museums";
  if (types.includes("park")) return "parks";
  return "landmarks";
}

function photoUrl(photoName: string): string {
  return `${BASE}/${photoName}/media?maxWidthPx=400&key=${API_KEY}`;
}

function mapPlace(raw: Record<string, any>, category?: string): Place {
  return {
    id: raw.id,
    name: raw.displayName?.text ?? "",
    category: category ?? detectCategory(raw.types ?? []),
    rating: raw.rating ?? 0,
    reviewCount: raw.userRatingCount ?? 0,
    address: raw.formattedAddress ?? "",
    lat: raw.location?.latitude ?? 0,
    lng: raw.location?.longitude ?? 0,
    photoUrl: raw.photos?.[0] ? photoUrl(raw.photos[0].name) : "",
    priceLevel: raw.priceLevel ? (PRICE_MAP[raw.priceLevel] ?? null) : null,
  };
}

export async function fetchPlaces(city: string, category?: string): Promise<Place[]> {
  const includedType = category ? CATEGORY_TYPE[category] : undefined;
  const textQuery = includedType ? `${category} in ${city}` : `things to do in ${city}`;

  const body: Record<string, unknown> = { textQuery, maxResultCount: 20, languageCode: "en" };
  if (includedType) body.includedType = includedType;

  const res = await fetch(`${BASE}/places:searchText`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask": FIELD_MASK,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Places API error: ${res.status}`);

  const data = (await res.json()) as { places?: Record<string, any>[] };
  return (data.places ?? [])
    .map((p) => mapPlace(p, category))
    .sort((a, b) => b.reviewCount - a.reviewCount);
}

export async function fetchAutocomplete(input: string): Promise<string[]> {
  const res = await fetch(`${BASE}/places:autocomplete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
    },
    body: JSON.stringify({
      input,
      includedPrimaryTypes: ["locality", "administrative_area_level_3"],
      languageCode: "en",
    }),
  });

  if (!res.ok) return [];

  const data = (await res.json()) as { suggestions?: Array<{ placePrediction?: { structuredFormat?: { mainText?: { text?: string }; secondaryText?: { text?: string } } } }> };
  return (data.suggestions ?? [])
    .map((s) => {
      const main = s.placePrediction?.structuredFormat?.mainText?.text;
      const secondary = s.placePrediction?.structuredFormat?.secondaryText?.text;
      return main && secondary ? `${main}, ${secondary}` : main ?? null;
    })
    .filter((v): v is string => v !== null)
    .slice(0, 6);
}

export async function fetchPlace(id: string): Promise<Place | null> {
  const fields = "id,displayName,formattedAddress,location,rating,userRatingCount,priceLevel,photos,types";
  const res = await fetch(`${BASE}/places/${id}?fields=${fields}&key=${API_KEY}`);

  if (!res.ok) return null;
  const raw = (await res.json()) as Record<string, any>;
  return mapPlace(raw);
}

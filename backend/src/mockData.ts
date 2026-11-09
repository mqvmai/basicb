export interface Place {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  address: string;
  lat: number;
  lng: number;
  photoUrl: string;
  priceLevel: number | null;
}

const mockPlaces: Record<string, Place[]> = {
  "new york": [
    { id: "1", name: "Central Park", category: "parks", rating: 4.8, reviewCount: 182340, address: "Central Park, New York, NY", lat: 40.7829, lng: -73.9654, photoUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400", priceLevel: null },
    { id: "2", name: "The Metropolitan Museum of Art", category: "museums", rating: 4.8, reviewCount: 101234, address: "1000 5th Ave, New York, NY", lat: 40.7794, lng: -73.9632, photoUrl: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=400", priceLevel: 2 },
    { id: "3", name: "Katz's Delicatessen", category: "restaurants", rating: 4.5, reviewCount: 32156, address: "205 E Houston St, New York, NY", lat: 40.7223, lng: -73.9873, photoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400", priceLevel: 2 },
    { id: "4", name: "Brooklyn Bridge", category: "landmarks", rating: 4.8, reviewCount: 93201, address: "Brooklyn Bridge, New York, NY", lat: 40.7061, lng: -73.9969, photoUrl: "https://images.unsplash.com/photo-1551634979-2b11f8c218da?w=400", priceLevel: null },
    { id: "5", name: "One World Observatory", category: "landmarks", rating: 4.7, reviewCount: 45321, address: "285 Fulton St, New York, NY", lat: 40.7127, lng: -74.0134, photoUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400", priceLevel: 3 },
    { id: "6", name: "Le Bernardin", category: "restaurants", rating: 4.6, reviewCount: 8921, address: "155 W 51st St, New York, NY", lat: 40.7614, lng: -73.9817, photoUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400", priceLevel: 4 },
    { id: "7", name: "MoMA", category: "museums", rating: 4.6, reviewCount: 76543, address: "11 W 53rd St, New York, NY", lat: 40.7614, lng: -73.9776, photoUrl: "https://images.unsplash.com/photo-1575223970966-76ae61ee7838?w=400", priceLevel: 2 },
    { id: "8", name: "High Line", category: "parks", rating: 4.7, reviewCount: 67890, address: "New York, NY 10011", lat: 40.7480, lng: -74.0048, photoUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400", priceLevel: null },
  ],
  "los angeles": [
    { id: "9", name: "Griffith Observatory", category: "landmarks", rating: 4.7, reviewCount: 89234, address: "2800 E Observatory Rd, Los Angeles, CA", lat: 34.1184, lng: -118.3004, photoUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400", priceLevel: null },
    { id: "10", name: "The Getty Center", category: "museums", rating: 4.8, reviewCount: 54321, address: "1200 Getty Center Dr, Los Angeles, CA", lat: 34.0780, lng: -118.4741, photoUrl: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=400", priceLevel: null },
    { id: "11", name: "Nobu Malibu", category: "restaurants", rating: 4.6, reviewCount: 12043, address: "22706 Pacific Coast Hwy, Malibu, CA", lat: 34.0375, lng: -118.6926, photoUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400", priceLevel: 4 },
    { id: "12", name: "Santa Monica Pier", category: "landmarks", rating: 4.5, reviewCount: 76234, address: "200 Santa Monica Pier, Santa Monica, CA", lat: 34.0095, lng: -118.4975, photoUrl: "https://images.unsplash.com/photo-1551634979-2b11f8c218da?w=400", priceLevel: null },
  ],
  "san francisco": [
    { id: "sf-1", name: "Golden Gate Bridge", category: "landmarks", rating: 4.8, reviewCount: 134521, address: "Golden Gate Bridge, San Francisco, CA", lat: 37.8199, lng: -122.4783, photoUrl: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=400", priceLevel: null },
    { id: "sf-2", name: "Alcatraz Island", category: "landmarks", rating: 4.7, reviewCount: 89023, address: "Alcatraz Island, San Francisco, CA", lat: 37.8270, lng: -122.4230, photoUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400", priceLevel: 2 },
    { id: "sf-3", name: "Tartine Bakery", category: "restaurants", rating: 4.6, reviewCount: 18234, address: "600 Guerrero St, San Francisco, CA", lat: 37.7613, lng: -122.4243, photoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400", priceLevel: 2 },
    { id: "sf-4", name: "de Young Museum", category: "museums", rating: 4.7, reviewCount: 34521, address: "50 Hagiwara Tea Garden Dr, San Francisco, CA", lat: 37.7714, lng: -122.4687, photoUrl: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=400", priceLevel: 2 },
    { id: "sf-5", name: "Dolores Park", category: "parks", rating: 4.6, reviewCount: 42310, address: "Dolores St & 19th St, San Francisco, CA", lat: 37.7596, lng: -122.4269, photoUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400", priceLevel: null },
  ],
  "miami": [
    { id: "mia-1", name: "South Beach", category: "landmarks", rating: 4.7, reviewCount: 98234, address: "Ocean Dr, Miami Beach, FL", lat: 25.7825, lng: -80.1300, photoUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", priceLevel: null },
    { id: "mia-2", name: "Pérez Art Museum Miami", category: "museums", rating: 4.6, reviewCount: 23456, address: "1103 Biscayne Blvd, Miami, FL", lat: 25.7742, lng: -80.1870, photoUrl: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=400", priceLevel: 2 },
    { id: "mia-3", name: "Versailles Restaurant", category: "restaurants", rating: 4.5, reviewCount: 15678, address: "3555 SW 8th St, Miami, FL", lat: 25.7657, lng: -80.2360, photoUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400", priceLevel: 2 },
    { id: "mia-4", name: "Wynwood Walls", category: "landmarks", rating: 4.7, reviewCount: 54321, address: "NW 2nd Ave, Miami, FL", lat: 25.8005, lng: -80.1996, photoUrl: "https://images.unsplash.com/photo-1551634979-2b11f8c218da?w=400", priceLevel: null },
    { id: "mia-5", name: "Bayfront Park", category: "parks", rating: 4.5, reviewCount: 32109, address: "301 Biscayne Blvd, Miami, FL", lat: 25.7742, lng: -80.1836, photoUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400", priceLevel: null },
  ],
  "chicago": [
    { id: "13", name: "Millennium Park", category: "parks", rating: 4.8, reviewCount: 98234, address: "201 E Randolph St, Chicago, IL", lat: 41.8827, lng: -87.6233, photoUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400", priceLevel: null },
    { id: "14", name: "Art Institute of Chicago", category: "museums", rating: 4.8, reviewCount: 67890, address: "111 S Michigan Ave, Chicago, IL", lat: 41.8796, lng: -87.6237, photoUrl: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=400", priceLevel: 2 },
    { id: "15", name: "Lou Malnati's Pizzeria", category: "restaurants", rating: 4.6, reviewCount: 23456, address: "439 N Wells St, Chicago, IL", lat: 41.8902, lng: -87.6338, photoUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400", priceLevel: 2 },
    { id: "16", name: "Navy Pier", category: "landmarks", rating: 4.5, reviewCount: 54321, address: "600 E Grand Ave, Chicago, IL", lat: 41.8919, lng: -87.6051, photoUrl: "https://images.unsplash.com/photo-1551634979-2b11f8c218da?w=400", priceLevel: null },
  ],
};

export function getPlaces(city: string, category?: string): Place[] {
  const key = city.toLowerCase().trim();
  const results = mockPlaces[key] ?? generateGenericPlaces(city);
  if (category && category !== "all") {
    return results.filter((p) => p.category === category);
  }
  return [...results].sort((a, b) => b.reviewCount - a.reviewCount);
}

export function getPlace(id: string): Place | null {
  for (const places of Object.values(mockPlaces)) {
    const found = places.find((p) => p.id === id);
    if (found) return found;
  }
  return null;
}

function generateGenericPlaces(city: string): Place[] {
  return [
    { id: `${city}-1`, name: `${city} City Park`, category: "parks", rating: 4.5, reviewCount: 12300, address: `Central ${city}`, lat: 40.7128, lng: -74.0060, photoUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400", priceLevel: null },
    { id: `${city}-2`, name: `${city} History Museum`, category: "museums", rating: 4.4, reviewCount: 8900, address: `Museum District, ${city}`, lat: 40.7200, lng: -74.0100, photoUrl: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?w=400", priceLevel: 1 },
    { id: `${city}-3`, name: `The ${city} Grill`, category: "restaurants", rating: 4.3, reviewCount: 5600, address: `Downtown ${city}`, lat: 40.7150, lng: -74.0080, photoUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400", priceLevel: 2 },
  ];
}

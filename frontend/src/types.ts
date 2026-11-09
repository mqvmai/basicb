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

export const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "restaurants", label: "Restaurants" },
  { value: "museums", label: "Museums" },
  { value: "parks", label: "Parks" },
  { value: "landmarks", label: "Landmarks" },
];

export const FEATURED_CITIES = [
  { name: "New York",       imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&h=400&fit=crop" },
  { name: "Los Angeles",    imageUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&h=400&fit=crop" },
  { name: "Chicago",        imageUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop" },
  { name: "San Francisco",  imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop" },
  { name: "Miami",          imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" },
  { name: "Las Vegas",      imageUrl: "https://images.unsplash.com/photo-1581351721010-8cf859cb14a4?w=600&h=400&fit=crop" },
];

export const POPULAR_CITIES = [
  "Abu Dhabi", "Amsterdam", "Atlanta", "Austin", "Bangkok",
  "Barcelona", "Berlin", "Boston", "Brussels", "Buenos Aires",
  "Cairo", "Calgary", "Cape Town", "Chicago", "Copenhagen",
  "Dallas", "Denver", "Detroit", "Dubai", "Dublin",
  "Edinburgh", "Florence", "Frankfurt", "Geneva", "Houston",
  "Istanbul", "Jakarta", "Las Vegas", "Lisbon", "London",
  "Los Angeles", "Madrid", "Melbourne", "Mexico City", "Miami",
  "Milan", "Minneapolis", "Montreal", "Moscow", "Mumbai",
  "Munich", "Nashville", "New Orleans", "New York", "Oslo",
  "Paris", "Philadelphia", "Phoenix", "Portland", "Prague",
  "Rome", "San Diego", "San Francisco", "Santiago", "São Paulo",
  "Seattle", "Seoul", "Shanghai", "Singapore", "Stockholm",
  "Sydney", "Taipei", "Tokyo", "Toronto", "Vancouver",
  "Vienna", "Warsaw", "Washington DC", "Zürich",
];

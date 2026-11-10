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

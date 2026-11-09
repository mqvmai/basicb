export const PLACES_QUERY = `
  query Places($city: String!, $category: String) {
    places(city: $city, category: $category) {
      id
      name
      category
      rating
      reviewCount
      address
      lat
      lng
      photoUrl
      priceLevel
    }
  }
`;

export const PLACE_QUERY = `
  query Place($id: ID!) {
    place(id: $id) {
      id
      name
      category
      rating
      reviewCount
      address
      lat
      lng
      photoUrl
      priceLevel
    }
  }
`;

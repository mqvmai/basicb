export const typeDefs = `#graphql
  type Place {
    id: ID!
    name: String!
    category: String!
    rating: Float!
    reviewCount: Int!
    address: String!
    lat: Float!
    lng: Float!
    photoUrl: String!
    priceLevel: Int
  }

  type Query {
    places(city: String!, category: String): [Place!]!
    place(id: ID!): Place
  }
`;

import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient("http://localhost:4000/graphql");

export function query<T>(document: string, variables?: Record<string, unknown>): Promise<T> {
  return client.request<T>(document, variables);
}

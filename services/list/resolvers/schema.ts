import { gql } from 'apollo-server'

export const typeDefs = gql`
  type List {
    id: ID!
    name: String!
  }

  input CreateListInput {
    name: String!
  }

  input UpdateListInput {
    name: String
  }

  type MutationResult {
    success: Boolean!
  }

  type Query {
    lists: [List!]!
    list(id: ID!): List
  }

  type Mutation {
    createList(input: CreateListInput!): List!
    updateList(id: ID!, input: UpdateListInput!): List
    deleteList(id: ID!): MutationResult!
  }
`

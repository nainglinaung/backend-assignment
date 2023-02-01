import { gql } from 'apollo-server'

export const typeDefs = gql`


  type Task {
    id: ID!
    name: String!
    description: String
    position: Int
    listId: String
  }

  type List {
    id: ID!
    name: String!
    Tasks: [Task]
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

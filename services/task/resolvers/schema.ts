import { gql } from 'apollo-server'

export const typeDefs = gql`
  type Task {
    id: ID!
    name: String!
    description: String!
    position: Int
    listId: String
  }

  input CreateTaskInput {
    name: String!
    description: String!
    position: Int!
    listId: String!
  }

  input UpdateTaskInput {
    name: String
    description: String
    position: Int
  }

  type MutationResult {
    success: Boolean!
  }

  type Query {
    tasks: [Task!]!
    task(id: ID!): Task
  }

  type Mutation {
    createTask(input: CreateTaskInput!): Task!
    updateTask(id: ID!, input: UpdateTaskInput!): Task
    deleteTask(id: ID!): MutationResult!
  }
`

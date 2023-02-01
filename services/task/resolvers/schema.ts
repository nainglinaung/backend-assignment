import { gql } from 'apollo-server'

export const typeDefs = gql`
  type Task {
    id: ID!
    title: String!
    description: String
    position: Int
    listId: String
    status: String
  }

  input CreateTaskInput {
    title: String!
    description: String!
    listId: String!
  }

  input MoveTaskInput {
    moveTo: String
  }

  input UpdateTaskInput {
    title: String
    description: String
    position: Int
    status: String
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
    moveTask(id: ID!, input: MoveTaskInput!): MutationResult!
  }
`

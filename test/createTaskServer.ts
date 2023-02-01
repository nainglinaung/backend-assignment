import { resolvers } from '../services/task/resolvers'
import { typeDefs } from '../services/task/resolvers/schema'
import { createGqlServer } from '../libs/server'

export const createTaskServer = async () => createGqlServer({
    typeDefs,
    resolvers,
});

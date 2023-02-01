import { resolvers } from '../services/list/resolvers'
import { typeDefs } from '../services/list/resolvers/schema'
import { createGqlServer } from '../libs/server'

export const createListServer = async () => createGqlServer({
    typeDefs,
    resolvers,
});

import { ApolloServer, gql } from 'apollo-server'
import {assert} from "assert"
import { resolvers } from '../services/list/resolvers'
import { typeDefs } from '../services/list/resolvers/schema'


import { createGqlServer } from '../libs/server'


describe("List Test Suite",  () => {

  let listId = null;

  it('create list with named "This is example list"', async () => {

    const testServer = await createGqlServer({
      typeDefs,
      resolvers,
    });
  
    const query = gql`
      mutation CreateList($input: CreateListInput!) {
        createList(input: $input) {
          name,id
        }
      }
    `
  
    const response = await testServer.executeOperation({
      query,
      variables: { input: {name: 'This is example list' }},
      operationName:"CreateList"
    });
    
    expect(response.errors).toBeUndefined();
    expect(response.data?.createList?.name).toBe('This is example list');
    // expect(response.data?.createList?.id).toBe('This is example list');
    
  });
});

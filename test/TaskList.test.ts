import { ApolloServer, gql } from 'apollo-server'
// import {assert} from "assert"
import { resolvers } from '../services/list/resolvers'
import { typeDefs } from '../services/list/resolvers/schema'


import { createGqlServer } from '../libs/server'


let testServer: ApolloServer


beforeAll(async () => {
  testServer = await createGqlServer({
    typeDefs,
    resolvers,
  });

})

describe("List Test Suite", () => {

  let listId: string = "";

  it('create list with named "This is example list"', async () => {

    const query = gql`
      mutation CreateList($input: CreateListInput!) {
        createList(input: $input) {
          name,id
        }
      }
    `
    const response = await testServer.executeOperation({
      query,
      variables: { input: { name: 'This is example list' } },
      operationName: "CreateList"
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.createList?.name).toBe('This is example list');

    listId = response.data?.createList?.id;
    // expect(response.data?.createList?.id).toBe('This is example list');

  });


  it('list all tasks', async () => {
    // console.log(listId)

    const query = gql`
    query Lists {
      lists {
        id
        name
        Tasks {
          title 
        }
      }
    }
    `

    const response = await testServer.executeOperation({
      query,
    });


    expect(response.errors).toBeUndefined();
    expect(response.data?.lists.length).toBeGreaterThan(0);
    expect(response.data?.lists).toBeDefined();

  })

  it("change the name of list by id", async () => {
    const query = gql`
    mutation UpdateList($updateListId: ID!, $input: UpdateListInput!) {
      updateList(id: $updateListId, input: $input) {
        id
        name
      }
    }`

    const response = await testServer.executeOperation({
      query,
      variables: {
        updateListId: listId, input: {
          name: "new title"
        }
      },
      operationName: "UpdateList"
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.updateList?.name).toBe("new title");

  })


  it('correctly delete list by id', async () => {

    const query = gql`
    mutation DeleteList($deleteListId: ID!) {
      deleteList(id: $deleteListId) {
        success
      }
    }
  `
    const response = await testServer.executeOperation({
      query,
      variables: { deleteListId: listId },
      operationName: "DeleteList"
    });


    expect(response.errors).toBeUndefined();
    expect(response.data?.deleteList?.success).toBe(true);
  })

  it("failed to delete list by id", async () => {

    const query = gql`
    mutation DeleteList($deleteListId: ID!) {
      deleteList(id: $deleteListId) {
        success
      }
    }
    `
    const response = await testServer.executeOperation({
      query,
      variables: { deleteListId: "asdasd" },
      operationName: "DeleteList"
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.deleteList?.success).toBe(false);
  })

});

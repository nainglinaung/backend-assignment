import { ApolloServer, gql } from 'apollo-server'
import { createListServer } from "./createListServer"
import { createTaskServer } from "./createTaskServer"


let taskServer: ApolloServer
let listServer: ApolloServer
let listId: String
let taskId: String


describe("Task Test Suite", () => {
    beforeAll(async () => {
        taskServer = await createTaskServer()
        listServer = await createListServer()

        const query = gql`
        mutation CreateList($input: CreateListInput!) {
          createList(input: $input) {
            name,id
          }
        }
        `
        const response = await listServer.executeOperation({
            query,
            variables: { input: { name: 'This is example list' } },
            operationName: "CreateList"
        });
        listId = response.data?.createList?.id;
    })

    afterAll(async () => {
        const listquery = gql`
        mutation DeleteList($deleteListId: ID!) {
          deleteList(id: $deleteListId) {
            success
          }
        }
      `
        await listServer.executeOperation({
            query: listquery,
            variables: { deleteListId: listId },
            operationName: "DeleteList"
        });

        const taskQuery = gql`
        mutation DeleteTask($deleteTaskId: ID!) {
            deleteTask(id: $deleteTaskId) {
              success
            }
          }
        `
        await listServer.executeOperation({
            query: taskQuery,
            variables: { deleteTaskId: taskId },
            operationName: "DeleteTask"
        });


    })

    it('create new task from existing list"', async () => {


        const query = gql`
        mutation CreateTask($input: CreateTaskInput!) {
            createTask(input: $input) {
              title
              description
              listId
            }
          }
        `

        const response = await taskServer.executeOperation({
            query,
            variables: {
                input: {
                    title: "new task",
                    description: "hello this is new task",
                    listId
                }
            },
            operationName: "CreateTask"
        });

        taskId = response.data?.createTask?.id;
        expect(response.errors).toBeUndefined();
        expect(response.data?.createTask?.title).toBe('new task');
        expect(response.data?.createTask?.description).toBe("hello this is new task");
        expect(response.data?.createTask?.listId).toBe(listId);

    })

})
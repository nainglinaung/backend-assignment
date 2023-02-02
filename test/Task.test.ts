import { ApolloServer, gql } from 'apollo-server'
import { response } from 'express'
import { createListServer } from "./createListServer"
import { createTaskServer } from "./createTaskServer"


let taskServer: ApolloServer
let listServer: ApolloServer
let listId: String
let taskId: String

interface Input {
  title: String
  description: String
  listId: String
}

interface Checker {
  id: String
  position: Number
}


const getTask = async (checker: Checker) => {

  const query = gql`
  query Task($taskId: ID!) {
    task(id: $taskId) {
      position
      id
    }
  }
  `
  return taskServer.executeOperation({
    query,
    variables: {
      taskId: checker.id
    },
  });

}

const createNewTask = async (input: Input) => {

  const query = gql`
  mutation CreateTask($input: CreateTaskInput!) {
      createTask(input: $input) {
        title
        description
        listId
        id
        position
      }
    }
  `

  return taskServer.executeOperation({
    query,
    variables: {
      input
    },
    operationName: "CreateTask"
  });
}

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

  })

  it('create new task from existing list"', async () => {


    const response = await createNewTask({
      title: "new task",
      description: "hello this is new task",
      listId
    })
    taskId = response.data?.createTask?.id;
    expect(response.errors).toBeUndefined();
    expect(response.data?.createTask?.title).toBe('new task');
    expect(response.data?.createTask?.description).toBe("hello this is new task");
    expect(response.data?.createTask?.listId).toBe(listId);

  })

  it('edit change the task title,status and description"', async () => {
    const query = gql`
        mutation UpdateTask($updateTaskId: ID!, $input: UpdateTaskInput!) {
            updateTask(id: $updateTaskId, input: $input) {
              id
              title
              description
              position
              listId
              status
            }
          }
          `

    const response = await taskServer.executeOperation({
      query,
      variables: {
        input: {
          title: "updated task",
          description: "updated description",
        },
        updateTaskId: taskId
      },
      operationName: "UpdateTask"
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.updateTask?.title).toBe('updated task');
    expect(response.data?.updateTask?.description).toBe("updated description");
    expect(response.data?.updateTask?.listId).toBe(listId);

  })

  it("delete task by id", async () => {
    const query = gql`
        mutation DeleteTask($deleteTaskId: ID!) {
            deleteTask(id: $deleteTaskId) {
              success
            }
          }
        `
    const response = await taskServer.executeOperation({
      query,
      variables: { deleteTaskId: taskId },
      operationName: "DeleteTask"
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.deleteTask?.success).toBe(true);

  })

  it("move tasks", async () => {

    let idArray = [];

    for (let i = 0; i < 5; i++) {
      const response = await createNewTask({
        title: `task title  -${i}`,
        description: `hello this is new task with description from ${i}`,
        listId
      });

      let checker: Checker = {
        id: response.data?.createTask?.id,
        position: response.data?.createTask?.position
      }
      idArray.push(checker)
    }

    let moveFrom: Checker = idArray[0];
    let moveTo: Checker = idArray[3];

    const query = gql`
    mutation MoveTask($moveTaskId: ID!, $input: MoveTaskInput!) {
      moveTask(id: $moveTaskId, input: $input) {
        success
      }
    }
    `
    const response = await taskServer.executeOperation({
      query,
      variables: {
        moveTaskId: moveFrom.id, input: {
          moveTo: moveTo.id
        }
      },
      operationName: "MoveTask"
    });

    expect(response.errors).toBeUndefined();
    expect(response.data?.moveTask?.success).toBe(true);

    let newMoveTo = await getTask(moveTo)
    let newMoveFrom = await getTask(moveFrom)

    expect(newMoveTo.data?.task?.position).toBe(moveFrom.position);
    expect(newMoveFrom.data?.task?.position).toBe(moveTo.position);



  })




})
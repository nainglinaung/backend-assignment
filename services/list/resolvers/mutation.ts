import { Resolvers } from 'generated/types'
import { Context } from '../../../libs/context'

export const mutation: Resolvers<Context>['Mutation'] = {
  createList: async (_parent, { input }, ctx) =>
    ctx.prisma.list.create({ data: input }),
  updateList: async (_parent, { id, input }, ctx) =>
    ctx.prisma.list.update({
      where: { id },
      data: {
        name: input.name ?? undefined,
      },
    }),

  deleteList: async (_parent, { id }, ctx) => {
    try {

      await ctx.prisma.task.deleteMany({
        where: {
          listId: {
            equals: id
          }
        }
      })
      await ctx.prisma.list.delete({ where: { id } });
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },
}


// type Task {
//   id: ID!
//   name: String!
//   description: String
//   position: Int
//   listId: String
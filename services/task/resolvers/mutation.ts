import { Resolvers } from 'generated/types'
import { Context } from '../../../libs/context'

export const mutation: Resolvers<Context>['Mutation'] = {
  createTask: async (_parent, { input }, ctx) => {

    ctx.prisma.$use(async (params, next) => {
      if (params.model == 'Task' && params.action == 'create') {
        params.args.data.position = Date.now()
      }
      return next(params)
    })

    return ctx.prisma.task.create({ data: input })
  },


  moveTask: async (_parent, { id, input }, ctx) => {

    try {
      let moveTo = input.moveTo ?? undefined

      let moveToTask = await ctx.prisma.task.findUnique({ where: { id: moveTo } });
      let currentTask = await ctx.prisma.task.findUnique({ where: { id }, });

      let moveToLocation = moveToTask?.position ?? undefined
      let currentLocation = currentTask?.position ?? undefined

      await ctx.prisma.task.update({
        where: { id }, data: {
          position: moveToLocation
        }
      })

      await ctx.prisma.task.update({
        where: { id: moveTo }, data: {
          position: currentLocation
        }
      })
      return { success: true };
    } catch (error) {
      return { success: false }
    }

  },

  updateTask: async (_parent, { id, input }, ctx) =>
    ctx.prisma.task.update({
      where: { id },
      data: {
        title: input.title ?? undefined,
        description: input.description ?? undefined,
        status: input.status ?? undefined
      },
    }),


  deleteTask: async (_parent, { id }, ctx) => {
    try {
      await ctx.prisma.task.delete({ where: { id } });
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  },
}

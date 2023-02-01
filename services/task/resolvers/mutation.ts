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


  updateTask: async (_parent, { id, input }, ctx) =>
    ctx.prisma.task.update({
      where: { id },
      data: {
        title: input.title ?? undefined,
      },
    }),
}

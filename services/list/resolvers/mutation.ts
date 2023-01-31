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
}

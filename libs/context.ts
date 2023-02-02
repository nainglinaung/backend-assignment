import { PrismaClient } from '@prisma/client'
import type { ExpressContext } from 'apollo-server-express'

export interface Context {
  prisma: PrismaClient
}


let prisma: PrismaClient


export function createContext(ctx: ExpressContext): Context {

  if (prisma == null) {
    prisma = new PrismaClient()
  }

  return {
    ...ctx,
    prisma
  }
}

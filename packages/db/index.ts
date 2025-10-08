import { PrismaClient } from '@prisma/client'

// Lazy-loaded Prisma clients to prevent connection attempts during build time
let _prisma: PrismaClient | null = null
let _adminPrisma: PrismaClient | null = null

// Read-only client for the site app
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!_prisma) {
      _prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      })
    }
    return (_prisma as any)[prop]
  },
})

// Admin client for the dashboard app (with write permissions)
export const adminPrisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!_adminPrisma) {
      _adminPrisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      })
    }
    return (_adminPrisma as any)[prop]
  },
})

export * from '@prisma/client'

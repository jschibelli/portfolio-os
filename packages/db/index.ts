import { PrismaClient } from '@prisma/client'

// Read-only client for the site app
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

// Admin client for the dashboard app (with write permissions)
export const adminPrisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

export * from '@prisma/client'

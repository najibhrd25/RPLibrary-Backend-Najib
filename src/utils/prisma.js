const { PrismaClient } = require('@prisma/client');

/**
 * Initializes the Prisma Client.
 * We can pass configuration here to log queries if we are debugging.
 */
const prisma = new PrismaClient({
  // Uncomment the line below to see all SQL queries printed in the console
  // log: ['query', 'info', 'warn', 'error'],
});

module.exports = prisma;

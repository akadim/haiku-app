import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";

const connectionString = process.env.POSTGRES_PRISMA_URL!;
const pool = new Pool({ connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: connectionString,
      },
    },
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Clean up the connection pool on exit
process.on("beforeExit", () => {
  void pool.end();
});

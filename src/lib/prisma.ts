import { PrismaClient } from "@prisma/client";

/**
 * Singleton do Prisma Client.
 * Evita multiplas conexoes em desenvolvimento (hot reload).
 */

// Declaracao global para evitar multiplos PrismaClients em dev
declare global {
  var prisma: PrismaClient | undefined;
}

// Configuracao do Prisma Client
const prismaConfig = {
  log: (
    process.env.NODE_ENV === "development"
      ? (["query", "error", "warn"] as const)
      : (["error"] as const)
  ) as ("query" | "error" | "warn")[],
};

/**
 * Instancia do Prisma Client.
 * Em producao, cria uma nova instancia.
 * Em desenvolvimento, reutiliza a instancia existente (hot reload).
 */
export const prisma =
  global.prisma ||
  new PrismaClient(prismaConfig);

// Em desenvolvimento, salva a instancia no global
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;

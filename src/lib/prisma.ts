import { env } from "@/env";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  console.log("aqui!!");
  prisma = new PrismaClient({
    log: ["info", "warn", "error"],
  });
}

export { prisma };

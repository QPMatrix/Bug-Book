import { PrismaClient } from "@prisma/client";

const prismaClientsSigleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientsSigleton>;
}

const prisma = global.prismaGlobal ?? prismaClientsSigleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

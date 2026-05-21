import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

//Prisma connection to PostgreSQL
prisma
  .$connect()
  .then(() =>
    console.log(" Prisma Client connected to PostgreSQL successfully!"),
  )
  .catch((err) =>
    console.error(" Prisma Client connection failure:", err.message),
  );

export default prisma;

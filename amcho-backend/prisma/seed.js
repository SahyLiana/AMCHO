// const { PrismaClient } = require('../node_modules/.prisma/client');
// const bcrypt = require('bcrypt');
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(" Starting database seeding pool...");

  // 1. Define your default seed profiles
  const usersToSeed = [
    { username: "admin", password: "123" },
    { username: "staff", password: "123" },
  ];

  const saltRounds = 10;

  for (const user of usersToSeed) {
    // 2. Hash the password securely using bcrypt
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    // 3. Upsert into the database (prevents duplicate errors on re-runs)
    const seededUser = await prisma.user.upsert({
      where: { username: user.username },
      update: {}, // Do nothing if the user already exists
      create: {
        username: user.username,
        password: hashedPassword,
      },
    });

    console.log(`👤 User processed: ${seededUser.username}`);
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(" Seeding operation encountered errors:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

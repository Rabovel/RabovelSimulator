import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany({ where: { email: "demo@rabovel.com" } });

  const passwordHash = await bcrypt.hash("password123", 12);

  await prisma.user.upsert({
    where: { email: "admin@rabovel.com" },
    update: { role: "ADMIN" },
    create: {
      email: "admin@rabovel.com",
      passwordHash,
      firstName: "Admin",
      lastName: "Reviewer",
      role: "ADMIN",
      kyc: { create: { status: "APPROVED", verifiedAt: new Date() } },
      wallets: {
        create: [
          { type: "PRIMARY", currency: "NGN" },
          { type: "TRADING", currency: "NGN" },
        ],
      },
    },
  });

  console.log("Seed complete. Admin: admin@rabovel.com / password123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

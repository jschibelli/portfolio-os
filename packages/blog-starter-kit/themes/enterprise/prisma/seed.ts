const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const email = process.env.AUTH_ADMIN_EMAIL!;
  const password = process.env.AUTH_ADMIN_PASSWORD!;

  if (!email || !password) {
    throw new Error("Set AUTH_ADMIN_EMAIL and AUTH_ADMIN_PASSWORD environment variables");
  }

  const hash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN" },
    create: {
      email,
      password: hash,
      role: "ADMIN",
      name: "Admin"
    },
  });

  console.log("Seeded admin:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const adminEmail = "glory@thehealingandgrowthjournal.com";
  const defaultPassword = "healing2026!";

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  const passwordHash = hashPassword(defaultPassword);

  if (existing) {
    await prisma.user.update({
      where: { email: adminEmail },
      data: {
        passwordHash,
        role: "ADMIN",
        name: "Glory",
      },
    });
    console.log(`Updated existing admin user: ${adminEmail}`);
  } else {
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Glory",
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log(`Created new admin user: ${adminEmail}`);
  }

  console.log(`Admin credentials:
Email: ${adminEmail}
Password: ${defaultPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

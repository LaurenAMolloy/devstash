import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Testing database connection...\n");

  await prisma.$connect();
  console.log("✓ Connected to Neon PostgreSQL\n");

  // System item types
  const itemTypes = await prisma.itemType.findMany({
    where: { isSystem: true },
    orderBy: { name: "asc" },
  });
  console.log(`✓ ${itemTypes.length} system item types:`);
  for (const type of itemTypes) {
    console.log(`  - ${type.name} (icon: ${type.icon}, color: ${type.color})`);
  }

  // Demo user
  const user = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
  });
  if (!user) {
    console.log("\n✗ Demo user not found — run `npx prisma db seed` first");
    return;
  }
  console.log(`\n✓ Demo user: ${user.name} <${user.email}> (isPro: ${user.isPro})`);

  // Collections + items
  const collections = await prisma.collection.findMany({
    where: { userId: user.id },
    orderBy: { name: "asc" },
    include: {
      items: {
        include: { type: true },
        orderBy: { title: "asc" },
      },
    },
  });

  console.log(`\n✓ ${collections.length} collections:\n`);
  for (const col of collections) {
    console.log(`  📁 ${col.name} — ${col.description ?? ""} (${col.items.length} items)`);
    for (const item of col.items) {
      const detail = item.url ?? item.content?.slice(0, 60).replace(/\n/g, " ") ?? "";
      console.log(`     · [${item.type.name}] ${item.title}${detail ? ` → ${detail}…` : ""}`);
    }
  }
}

main()
  .catch((e) => {
    console.error("✗ Database test failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

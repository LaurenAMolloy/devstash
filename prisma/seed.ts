import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const systemItemTypes = [
  { name: "Snippet", icon: "code-2", color: "#3B82F6" },
  { name: "Prompt", icon: "sparkles", color: "#8B5CF6" },
  { name: "Note", icon: "file-text", color: "#10B981" },
  { name: "Command", icon: "terminal", color: "#F59E0B" },
  { name: "File", icon: "paperclip", color: "#6B7280" },
  { name: "Image", icon: "image", color: "#EC4899" },
  { name: "URL", icon: "link", color: "#14B8A6" },
];

async function main() {
  for (const type of systemItemTypes) {
    await prisma.itemType.upsert({
      where: { id: type.name.toLowerCase() },
      update: {},
      create: {
        id: type.name.toLowerCase(),
        name: type.name,
        icon: type.icon,
        color: type.color,
        isSystem: true,
        userId: null,
      },
    });
  }
  console.log(`Seeded ${systemItemTypes.length} system item types.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

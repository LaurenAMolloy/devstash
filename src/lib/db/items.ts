import { prisma } from "@/lib/prisma";

export type ItemWithMeta = {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  type: { id: string; name: string; icon: string | null; color: string | null };
  tags: string[];
};

type PrismaItemWithRelations = {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  type: { id: string; name: string; icon: string | null; color: string | null };
  tags: { tag: { name: string } }[];
};

function toItemWithMeta(item: PrismaItemWithRelations): ItemWithMeta {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    type: item.type,
    tags: item.tags.map((t) => t.tag.name),
  };
}

const itemInclude = {
  type: { select: { id: true, name: true, icon: true, color: true } },
  tags: { include: { tag: { select: { name: true } } } },
} as const;

export async function getPinnedItems(userId: string): Promise<ItemWithMeta[]> {
  const items = await prisma.item.findMany({
    where: { userId, isPinned: true },
    orderBy: { updatedAt: "desc" },
    include: itemInclude,
  });
  return items.map(toItemWithMeta);
}

export async function getRecentItems(
  userId: string,
  limit = 10
): Promise<ItemWithMeta[]> {
  const items = await prisma.item.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: itemInclude,
  });
  return items.map(toItemWithMeta);
}

export async function getItemCounts(
  userId: string
): Promise<{ total: number; favorites: number }> {
  const [total, favorites] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
  ]);
  return { total, favorites };
}

export type ItemTypeWithCount = {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  count: number;
};

export async function getSystemItemTypes(
  userId: string
): Promise<ItemTypeWithCount[]> {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
  });

  const counts = await prisma.item.groupBy({
    by: ["typeId"],
    where: { userId },
    _count: { _all: true },
  });

  const countMap = new Map(counts.map((c) => [c.typeId, c._count._all]));

  const order = ["Snippet", "Prompt", "Command", "Note", "File", "Image", "URL"];

  return types
    .map((t) => ({
      id: t.id,
      name: t.name,
      icon: t.icon,
      color: t.color,
      count: countMap.get(t.id) ?? 0,
    }))
    .sort((a, b) => {
      const ai = order.indexOf(a.name);
      const bi = order.indexOf(b.name);
      if (ai === -1 && bi === -1) return a.name.localeCompare(b.name);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
}

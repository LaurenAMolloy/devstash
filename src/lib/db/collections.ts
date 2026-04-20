import { prisma } from "@/lib/prisma";

export type CollectionWithMeta = {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  dominantColor: string | null;
  types: { id: string; name: string; icon: string | null; color: string | null }[];
};

export async function getRecentCollections(
  userId: string,
  limit = 6
): Promise<CollectionWithMeta[]> {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      _count: { select: { items: true } },
      items: {
        select: {
          typeId: true,
          type: { select: { id: true, name: true, icon: true, color: true } },
        },
      },
    },
  });

  return collections.map((col) => {
    const typeCounts = new Map<
      string,
      { type: { id: string; name: string; icon: string | null; color: string | null }; count: number }
    >();

    for (const item of col.items) {
      const entry = typeCounts.get(item.typeId);
      if (entry) {
        entry.count++;
      } else {
        typeCounts.set(item.typeId, { type: item.type, count: 1 });
      }
    }

    const sorted = [...typeCounts.values()].sort((a, b) => b.count - a.count);

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      itemCount: col._count.items,
      dominantColor: sorted[0]?.type.color ?? null,
      types: sorted.map((e) => e.type),
    };
  });
}

export async function getCollectionCounts(
  userId: string
): Promise<{ total: number; favorites: number }> {
  const [total, favorites] = await Promise.all([
    prisma.collection.count({ where: { userId } }),
    prisma.collection.count({ where: { userId, isFavorite: true } }),
  ]);
  return { total, favorites };
}

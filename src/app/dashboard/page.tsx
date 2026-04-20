import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getRecentCollections, getCollectionCounts } from "@/lib/db/collections";
import { getPinnedItems, getRecentItems, getItemCounts, getSystemItemTypes } from "@/lib/db/items";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await prisma.user.findFirst({
    where: { email: "demo@devstash.io" },
    select: { id: true },
  });

  const [collections, collectionCounts, pinnedItems, recentItems, itemCounts, itemTypes] = user
    ? await Promise.all([
        getRecentCollections(user.id),
        getCollectionCounts(user.id),
        getPinnedItems(user.id),
        getRecentItems(user.id),
        getItemCounts(user.id),
        getSystemItemTypes(user.id),
      ])
    : [[], { total: 0, favorites: 0 }, [], [], { total: 0, favorites: 0 }, []];

  return (
    <DashboardShell
      collections={collections}
      collectionCounts={collectionCounts}
      pinnedItems={pinnedItems}
      recentItems={recentItems}
      itemCounts={itemCounts}
      itemTypes={itemTypes}
    />
  );
}

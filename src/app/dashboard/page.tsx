import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getRecentCollections, getCollectionCounts } from "@/lib/db/collections";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const user = await prisma.user.findFirst({
    where: { email: "demo@devstash.io" },
    select: { id: true },
  });

  const [collections, collectionCounts] = user
    ? await Promise.all([
        getRecentCollections(user.id),
        getCollectionCounts(user.id),
      ])
    : [[], { total: 0, favorites: 0 }];

  return (
    <DashboardShell
      collections={collections}
      collectionCounts={collectionCounts}
    />
  );
}

import {
  Code2,
  Sparkles,
  Terminal,
  FileText,
  File,
  Image,
  Link2,
  Star,
  Pin,
  Folder,
  Package,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CollectionWithMeta } from "@/lib/db/collections";
import type { ItemWithMeta } from "@/lib/db/items";

const dbIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code: Code2,
  Sparkles: Sparkles,
  Terminal: Terminal,
  StickyNote: FileText,
  File: File,
  Image: Image,
  Link: Link2,
};

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface MainContentProps {
  collections: CollectionWithMeta[];
  collectionCounts: { total: number; favorites: number };
  pinnedItems: ItemWithMeta[];
  recentItems: ItemWithMeta[];
  itemCounts: { total: number; favorites: number };
}

export function MainContent({
  collections,
  collectionCounts,
  pinnedItems,
  recentItems,
  itemCounts,
}: MainContentProps) {
  const stats = [
    { label: "Total Items", value: itemCounts.total, icon: Package },
    { label: "Collections", value: collectionCounts.total, icon: Folder },
    { label: "Favorite Items", value: itemCounts.favorites, icon: Star },
    { label: "Favorite Collections", value: collectionCounts.favorites, icon: Star },
  ];

  return (
    <main className="flex-1 overflow-auto p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your developer knowledge hub</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border border-border bg-card p-4 space-y-1"
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-semibold tabular-nums">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Collections */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Collections</h2>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {collections.map((col) => (
            <div
              key={col.id}
              className="rounded-lg border bg-card p-4 hover:bg-accent/30 transition-colors cursor-pointer space-y-2"
              style={
                col.dominantColor
                  ? { borderColor: `${col.dominantColor}50` }
                  : undefined
              }
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{col.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {col.itemCount} {col.itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
                {col.isFavorite && (
                  <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-500 text-yellow-500 mt-0.5" />
                )}
              </div>
              {col.description && (
                <p className="text-xs text-muted-foreground line-clamp-1">{col.description}</p>
              )}
              <div className="flex items-center gap-1.5">
                {col.types.map((type) => {
                  const Icon = (type.icon ? dbIconMap[type.icon] : null) ?? File;
                  return (
                    <Icon
                      key={type.id}
                      className="h-3 w-3"
                      style={type.color ? { color: `${type.color}99` } : undefined}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pinned Items */}
      {pinnedItems.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Pin className="h-3.5 w-3.5 text-muted-foreground" />
            <h2 className="text-sm font-semibold">Pinned</h2>
          </div>
          <div className="space-y-2">
            {pinnedItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Items */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold">Recent Items</h2>
          <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
            View all <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="space-y-2">
          {recentItems.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      </section>
    </main>
  );
}

interface ItemRowProps {
  item: ItemWithMeta;
}

function ItemRow({ item }: ItemRowProps) {
  const Icon = (item.type.icon ? dbIconMap[item.type.icon] : null) ?? File;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-3.5 hover:border-border/80 hover:bg-accent/30 transition-colors cursor-pointer">
      <div
        className={cn("flex items-center justify-center w-8 h-8 rounded-md shrink-0")}
        style={
          item.type.color
            ? { backgroundColor: `${item.type.color}26`, color: item.type.color }
            : { backgroundColor: "rgba(113,113,122,0.15)", color: "#71717a" }
        }
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium truncate">{item.title}</p>
          {item.isFavorite && (
            <Star className="h-3 w-3 shrink-0 fill-yellow-500 text-yellow-500" />
          )}
          {item.isPinned && (
            <Pin className="h-3 w-3 shrink-0 text-muted-foreground" />
          )}
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{item.description}</p>
        )}
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <span
            className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
            style={item.type.color ? { color: item.type.color } : undefined}
          >
            {item.type.name}
          </span>
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground shrink-0 mt-0.5">{formatDate(item.createdAt)}</p>
    </div>
  );
}

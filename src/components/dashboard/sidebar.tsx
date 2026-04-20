"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Sparkles,
  Terminal,
  FileText,
  File,
  Image,
  Link2,
  ChevronDown,
  Star,
  Folder,
  Settings,
  X,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { CollectionWithMeta } from "@/lib/db/collections";
import type { ItemTypeWithCount } from "@/lib/db/items";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code: Code2,
  Sparkles: Sparkles,
  Terminal: Terminal,
  StickyNote: FileText,
  File: File,
  Image: Image,
  Link: Link2,
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  itemTypes: ItemTypeWithCount[];
  collections: CollectionWithMeta[];
}

export function Sidebar({ isOpen, onClose, itemTypes, collections }: SidebarProps) {
  const [typesExpanded, setTypesExpanded] = useState(true);
  const [collectionsExpanded, setCollectionsExpanded] = useState(true);

  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections.filter((c) => !c.isFavorite).slice(0, 4);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "flex flex-col bg-background border-r border-border overflow-hidden transition-all duration-200",
          // Mobile: fixed overlay, slide in/out via transform
          "fixed inset-y-0 left-0 z-40 w-64",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: inline, collapse via width
          "lg:relative lg:inset-auto lg:z-auto lg:translate-x-0",
          isOpen ? "lg:w-64" : "lg:w-0 lg:border-r-0"
        )}
      >
        {/* Fixed-width inner container prevents content squishing during width animation */}
        <div className="w-64 flex flex-col h-full overflow-hidden">
          {/* Mobile close button */}
          <div className="flex items-center justify-between px-4 py-3 lg:hidden border-b border-border">
            <span className="text-sm font-semibold">Menu</span>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground p-1 rounded"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable nav */}
          <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
            {/* Types section */}
            <button
              className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md"
              onClick={() => setTypesExpanded(!typesExpanded)}
            >
              <span>Types</span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform duration-150",
                  !typesExpanded && "-rotate-90"
                )}
              />
            </button>

            {typesExpanded && (
              <div className="space-y-0.5 mb-2">
                {itemTypes.map((type) => {
                  const Icon = (type.icon ? iconMap[type.icon] : null) ?? File;
                  const slug = type.name.toLowerCase();
                  return (
                    <Link
                      key={type.id}
                      href={`/items/${slug}`}
                      className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className="h-3.5 w-3.5 shrink-0"
                          style={type.color ? { color: type.color } : undefined}
                        />
                        <span>{type.name}</span>
                      </div>
                      <span className="text-xs tabular-nums">{type.count}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Collections section */}
            <button
              className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-md"
              onClick={() => setCollectionsExpanded(!collectionsExpanded)}
            >
              <span>Collections</span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 transition-transform duration-150",
                  !collectionsExpanded && "-rotate-90"
                )}
              />
            </button>

            {collectionsExpanded && (
              <div className="space-y-3">
                {/* Favorites */}
                {favoriteCollections.length > 0 && (
                  <div>
                    <p className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground/50 font-semibold">
                      Favorites
                    </p>
                    {favoriteCollections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.id}`}
                        className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Folder className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{col.name}</span>
                        </div>
                        <Star className="h-3 w-3 shrink-0 fill-yellow-500 text-yellow-500" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Recent */}
                {recentCollections.length > 0 && (
                  <div>
                    <p className="px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground/50 font-semibold">
                      Recent
                    </p>
                    {recentCollections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.id}`}
                        className="flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                      >
                        <div
                          className="h-2 w-2 rounded-full shrink-0"
                          style={
                            col.dominantColor
                              ? { backgroundColor: col.dominantColor }
                              : { backgroundColor: "rgba(113,113,122,0.4)" }
                          }
                        />
                        <span className="truncate">{col.name}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* View all */}
                <Link
                  href="/collections"
                  className="flex items-center gap-1 px-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View all collections
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </nav>

          {/* User area */}
          <div className="border-t border-border p-3 flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-semibold shrink-0 select-none">
              DU
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight truncate">Demo User</p>
              <p className="text-xs text-muted-foreground truncate">demo@devstash.io</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground shrink-0 p-1 rounded hover:bg-accent transition-colors">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

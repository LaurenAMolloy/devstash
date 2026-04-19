"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FolderPlus, PanelLeft } from "lucide-react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { MainContent } from "@/components/dashboard/main-content";

export function DashboardShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <header className="flex items-center gap-3 px-4 h-14 border-b border-border shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-white text-black text-xs font-bold tracking-tight">
            DS
          </div>
          <span className="text-sm font-semibold">DevStash</span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-accent transition-colors"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </button>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-9 bg-muted border-0 focus-visible:ring-1"
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            ⌘K
          </kbd>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Item
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <MainContent />
      </div>
    </>
  );
}

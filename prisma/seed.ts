import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const systemItemTypes = [
  { id: "snippet", name: "Snippet", icon: "Code", color: "#3b82f6" },
  { id: "prompt", name: "Prompt", icon: "Sparkles", color: "#8b5cf6" },
  { id: "command", name: "Command", icon: "Terminal", color: "#f97316" },
  { id: "note", name: "Note", icon: "StickyNote", color: "#fde047" },
  { id: "file", name: "File", icon: "File", color: "#6b7280" },
  { id: "image", name: "Image", icon: "Image", color: "#ec4899" },
  { id: "link", name: "Link", icon: "Link", color: "#10b981" },
];

async function main() {
  // Upsert system item types
  for (const type of systemItemTypes) {
    await prisma.itemType.upsert({
      where: { id: type.id },
      update: { name: type.name, icon: type.icon, color: type.color },
      create: { ...type, isSystem: true, userId: null },
    });
  }
  console.log(`Seeded ${systemItemTypes.length} system item types.`);

  // Demo user
  const hashedPassword = await bcrypt.hash("12345678", 12);
  const user = await prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {},
    create: {
      email: "demo@devstash.io",
      name: "Demo User",
      password: hashedPassword,
      isPro: false,
      emailVerified: new Date(),
    },
  });
  console.log(`Seeded demo user: ${user.email}`);

  // ── React Patterns ────────────────────────────────────────────────────────
  const reactPatterns = await prisma.collection.upsert({
    where: { id: "col-react-patterns" },
    update: {},
    create: {
      id: "col-react-patterns",
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      userId: user.id,
    },
  });

  await prisma.item.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "item-rp-1",
        title: "useDebounce & useLocalStorage hooks",
        contentType: "text",
        language: "typescript",
        content: `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStored(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [stored, setValue] as const;
}`,
        typeId: "snippet",
        userId: user.id,
        collectionId: reactPatterns.id,
      },
      {
        id: "item-rp-2",
        title: "Context provider + compound component pattern",
        contentType: "text",
        language: "typescript",
        content: `import { createContext, useContext, useState, ReactNode } from "react";

interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("useTabs must be used within <Tabs>");
  return ctx;
}

export function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab);
  return <TabsContext.Provider value={{ active, setActive }}>{children}</TabsContext.Provider>;
}

Tabs.Tab = function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive } = useTabs();
  return (
    <button
      onClick={() => setActive(id)}
      style={{ fontWeight: active === id ? "bold" : "normal" }}
    >
      {children}
    </button>
  );
};

Tabs.Panel = function Panel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useTabs();
  return active === id ? <div>{children}</div> : null;
};`,
        typeId: "snippet",
        userId: user.id,
        collectionId: reactPatterns.id,
      },
      {
        id: "item-rp-3",
        title: "Utility functions (cn, formatDate, truncate)",
        contentType: "text",
        language: "typescript",
        content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale = "en-US"): string {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function truncate(str: string, maxLength: number): string {
  return str.length <= maxLength ? str : str.slice(0, maxLength - 1) + "…";
}`,
        typeId: "snippet",
        userId: user.id,
        collectionId: reactPatterns.id,
      },
    ],
  });

  // ── AI Workflows ──────────────────────────────────────────────────────────
  const aiWorkflows = await prisma.collection.upsert({
    where: { id: "col-ai-workflows" },
    update: {},
    create: {
      id: "col-ai-workflows",
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      userId: user.id,
    },
  });

  await prisma.item.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "item-ai-1",
        title: "Code review prompt",
        contentType: "text",
        content: `Review the following code and provide feedback on:
1. Correctness — are there any bugs or logic errors?
2. Security — SQL injection, XSS, insecure defaults, etc.
3. Performance — unnecessary re-renders, N+1 queries, blocking operations.
4. Readability — naming, complexity, unnecessary abstractions.
5. Edge cases — what inputs or states could break this?

Return your feedback as a structured list grouped by severity: Critical → Warning → Suggestion.

\`\`\`
{{code}}
\`\`\``,
        typeId: "prompt",
        userId: user.id,
        collectionId: aiWorkflows.id,
      },
      {
        id: "item-ai-2",
        title: "Documentation generation prompt",
        contentType: "text",
        content: `Generate clear, concise documentation for the following function or module.

Include:
- A one-sentence summary of what it does
- Parameters table (name | type | description | required)
- Return value description
- One usage example
- Any important caveats or side effects

Keep the tone developer-friendly. Do not restate the obvious from the code.

\`\`\`
{{code}}
\`\`\``,
        typeId: "prompt",
        userId: user.id,
        collectionId: aiWorkflows.id,
      },
      {
        id: "item-ai-3",
        title: "Refactoring assistance prompt",
        contentType: "text",
        content: `Refactor the following code with these goals:
- Reduce duplication (DRY)
- Improve naming clarity
- Simplify conditional logic
- Remove dead code
- Keep the same external behaviour and signatures

Explain the key changes you made and why in a short summary after the code.

\`\`\`
{{code}}
\`\`\``,
        typeId: "prompt",
        userId: user.id,
        collectionId: aiWorkflows.id,
      },
    ],
  });

  // ── DevOps ────────────────────────────────────────────────────────────────
  const devops = await prisma.collection.upsert({
    where: { id: "col-devops" },
    update: {},
    create: {
      id: "col-devops",
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      userId: user.id,
    },
  });

  await prisma.item.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "item-do-1",
        title: "Next.js Dockerfile (multi-stage)",
        contentType: "text",
        language: "dockerfile",
        content: `FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]`,
        typeId: "snippet",
        userId: user.id,
        collectionId: devops.id,
      },
      {
        id: "item-do-2",
        title: "Deploy to Vercel via CLI",
        contentType: "text",
        content: `vercel --prod`,
        description: "Deploy the current project to Vercel production",
        typeId: "command",
        userId: user.id,
        collectionId: devops.id,
      },
      {
        id: "item-do-3",
        title: "GitHub Actions documentation",
        contentType: "text",
        url: "https://docs.github.com/en/actions",
        description: "Official GitHub Actions docs — workflows, triggers, runners",
        typeId: "link",
        userId: user.id,
        collectionId: devops.id,
      },
      {
        id: "item-do-4",
        title: "Vercel deployment documentation",
        contentType: "text",
        url: "https://vercel.com/docs/deployments/overview",
        description: "Vercel deployment concepts, environments, and CLI reference",
        typeId: "link",
        userId: user.id,
        collectionId: devops.id,
      },
    ],
  });

  // ── Terminal Commands ─────────────────────────────────────────────────────
  const terminalCommands = await prisma.collection.upsert({
    where: { id: "col-terminal-commands" },
    update: {},
    create: {
      id: "col-terminal-commands",
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      userId: user.id,
    },
  });

  await prisma.item.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "item-tc-1",
        title: "Git: undo last commit (keep changes staged)",
        contentType: "text",
        content: `git reset --soft HEAD~1`,
        typeId: "command",
        userId: user.id,
        collectionId: terminalCommands.id,
      },
      {
        id: "item-tc-2",
        title: "Docker: remove all stopped containers and unused images",
        contentType: "text",
        content: `docker system prune -af`,
        description: "Frees disk space — removes stopped containers, dangling images, unused networks",
        typeId: "command",
        userId: user.id,
        collectionId: terminalCommands.id,
      },
      {
        id: "item-tc-3",
        title: "Kill process on a specific port",
        contentType: "text",
        content: `lsof -ti :<PORT> | xargs kill -9`,
        description: "Replace <PORT> with the port number, e.g. 3000",
        typeId: "command",
        userId: user.id,
        collectionId: terminalCommands.id,
      },
      {
        id: "item-tc-4",
        title: "npm: check and update outdated packages",
        contentType: "text",
        content: `npx npm-check-updates -u && npm install`,
        description: "Updates package.json to latest versions then installs",
        typeId: "command",
        userId: user.id,
        collectionId: terminalCommands.id,
      },
    ],
  });

  // ── Design Resources ──────────────────────────────────────────────────────
  const designResources = await prisma.collection.upsert({
    where: { id: "col-design-resources" },
    update: {},
    create: {
      id: "col-design-resources",
      name: "Design Resources",
      description: "UI/UX resources and references",
      userId: user.id,
    },
  });

  await prisma.item.createMany({
    skipDuplicates: true,
    data: [
      {
        id: "item-dr-1",
        title: "Tailwind CSS documentation",
        contentType: "text",
        url: "https://tailwindcss.com/docs",
        description: "Full reference for Tailwind utility classes, configuration, and plugins",
        typeId: "link",
        userId: user.id,
        collectionId: designResources.id,
      },
      {
        id: "item-dr-2",
        title: "shadcn/ui components",
        contentType: "text",
        url: "https://ui.shadcn.com/docs/components",
        description: "Copy-paste accessible React components built on Radix UI + Tailwind",
        typeId: "link",
        userId: user.id,
        collectionId: designResources.id,
      },
      {
        id: "item-dr-3",
        title: "Radix UI primitives",
        contentType: "text",
        url: "https://www.radix-ui.com/primitives/docs/overview/introduction",
        description: "Unstyled, accessible UI primitives for building design systems",
        typeId: "link",
        userId: user.id,
        collectionId: designResources.id,
      },
      {
        id: "item-dr-4",
        title: "Lucide React icons",
        contentType: "text",
        url: "https://lucide.dev/icons",
        description: "Open-source icon library — search and copy Lucide React component names",
        typeId: "link",
        userId: user.id,
        collectionId: designResources.id,
      },
    ],
  });

  console.log("Seeded demo user, 5 collections, and all items.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

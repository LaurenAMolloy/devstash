export const mockUser = {
  id: "user_1",
  name: "John Doe",
  email: "demo@devstash.io",
  isPro: false,
};

export const mockItemTypes = [
  { id: "type_snippet", name: "Snippets", icon: "code", isSystem: true, count: 24 },
  { id: "type_prompt", name: "Prompts", icon: "sparkles", isSystem: true, count: 18 },
  { id: "type_command", name: "Commands", icon: "terminal", isSystem: true, count: 15 },
  { id: "type_note", name: "Notes", icon: "file-text", isSystem: true, count: 12 },
  { id: "type_file", name: "Files", icon: "file", isSystem: true, count: 5 },
  { id: "type_image", name: "Images", icon: "image", isSystem: true, count: 3 },
  { id: "type_url", name: "Links", icon: "link", isSystem: true, count: 8 },
];

export const mockCollections = [
  {
    id: "col_1",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    itemCount: 12,
    isFavorite: true,
    types: ["snippet", "file", "url"],
  },
  {
    id: "col_2",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    itemCount: 8,
    isFavorite: false,
    types: ["snippet", "url"],
  },
  {
    id: "col_3",
    name: "Context Files",
    description: "AI context files for projects",
    itemCount: 5,
    isFavorite: false,
    types: ["file", "snippet"],
  },
  {
    id: "col_4",
    name: "Interview Prep",
    description: "Technical interview preparation",
    itemCount: 24,
    isFavorite: true,
    types: ["snippet", "file", "url", "command"],
  },
  {
    id: "col_5",
    name: "Git Commands",
    description: "Frequently used git commands",
    itemCount: 15,
    isFavorite: true,
    types: ["command", "url"],
  },
  {
    id: "col_6",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    itemCount: 18,
    isFavorite: false,
    types: ["prompt", "file", "snippet"],
  },
  {
    id: "col_7",
    name: "Python Snippets",
    description: "Python utility snippets",
    itemCount: 8,
    isFavorite: false,
    types: ["snippet", "url"],
  },
  {
    id: "col_8",
    name: "Interview Prep",
    description: "Interview preparation resources",
    itemCount: 24,
    isFavorite: false,
    types: ["snippet", "file", "url"],
  },
  {
    id: "col_9",
    name: "AI Prompts",
    description: "AI prompt library",
    itemCount: 18,
    isFavorite: false,
    types: ["prompt"],
  },
];

export const mockItems = [
  {
    id: "item_1",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    contentType: "text",
    content: `import { useSession } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  }
}`,
    typeId: "type_snippet",
    typeName: "Snippet",
    collectionId: "col_1",
    collectionName: "React Patterns",
    tags: ["react", "auth", "hooks"],
    isFavorite: false,
    isPinned: true,
    language: "typescript",
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "item_2",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    contentType: "text",
    content: `async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(res.statusText)
      return await res.json()
    } catch (err) {
      if (i === retries - 1) throw err
      await new Promise(r => setTimeout(r, 2 ** i * 1000))
    }
  }
}`,
    typeId: "type_snippet",
    typeName: "Snippet",
    collectionId: "col_1",
    collectionName: "React Patterns",
    tags: ["api", "error-handling", "typescript"],
    isFavorite: false,
    isPinned: true,
    language: "typescript",
    createdAt: "2026-01-12T10:00:00Z",
  },
  {
    id: "item_3",
    title: "Git Squash Commits",
    description: "Squash last N commits into one",
    contentType: "text",
    content: "git rebase -i HEAD~N",
    typeId: "type_command",
    typeName: "Command",
    collectionId: "col_5",
    collectionName: "Git Commands",
    tags: ["git", "rebase"],
    isFavorite: true,
    isPinned: false,
    language: "bash",
    createdAt: "2026-01-10T10:00:00Z",
  },
  {
    id: "item_4",
    title: "Code Review Prompt",
    description: "AI prompt for thorough code reviews",
    contentType: "text",
    content:
      "Review this code for: 1) Security vulnerabilities 2) Performance issues 3) Code smells 4) Missing edge cases. Be specific and actionable.",
    typeId: "type_prompt",
    typeName: "Prompt",
    collectionId: "col_6",
    collectionName: "AI Prompts",
    tags: ["code-review", "ai", "quality"],
    isFavorite: true,
    isPinned: false,
    language: null,
    createdAt: "2026-01-08T10:00:00Z",
  },
  {
    id: "item_5",
    title: "Docker Compose Dev Stack",
    description: "Local dev environment with Postgres and Redis",
    contentType: "text",
    content: `version: '3.8'
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"`,
    typeId: "type_command",
    typeName: "Command",
    collectionId: "col_5",
    collectionName: "Git Commands",
    tags: ["docker", "postgres", "redis", "devops"],
    isFavorite: false,
    isPinned: false,
    language: "yaml",
    createdAt: "2026-01-05T10:00:00Z",
  },
  {
    id: "item_6",
    title: "Tailwind Dark Mode Setup",
    description: "Configure dark mode with class strategy in Tailwind v4",
    contentType: "text",
    content: `/* globals.css */
@import "tailwindcss";

@variant dark (&:where(.dark, .dark *));`,
    typeId: "type_snippet",
    typeName: "Snippet",
    collectionId: "col_1",
    collectionName: "React Patterns",
    tags: ["tailwind", "css", "dark-mode"],
    isFavorite: false,
    isPinned: false,
    language: "css",
    createdAt: "2026-01-03T10:00:00Z",
  },
];

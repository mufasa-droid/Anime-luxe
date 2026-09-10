# AGENTS.md

Context for AI coding agents working on this repo. Read this and the `context/` folder before making changes.

## Required Reading Before Making Changes:
1. [AGENT.md](file:///c:/Users/Mufasa/Documents/projects/anime-store-luxe-2/AGENT.md)
2. [context/overview.md](file:///c:/Users/Mufasa/Documents/projects/anime-store-luxe-2/context/overview.md)
3. [context/architecture.md](file:///c:/Users/Mufasa/Documents/projects/anime-store-luxe-2/context/architecture.md)
4. [context/code-standard.md](file:///c:/Users/Mufasa/Documents/projects/anime-store-luxe-2/context/code-standard.md)
5. [context/progress.md](file:///c:/Users/Mufasa/Documents/projects/anime-store-luxe-2/context/progress.md)

## Core Directives
- Inspect existing files before editing.
- Extend the existing app; do not rebuild working features.
- Follow the 3D asset and rendering standards in `context/architecture.md` and `context/code-standard.md`.
- Keep `context/progress.md` updated as milestones are completed.
- Commit to git after every major milestone.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

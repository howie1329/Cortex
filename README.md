# Cortex

Cortex is an editor-first, AI-native knowledge workspace where people write, converse, research, and turn useful thinking into durable project knowledge.

> The Codex of knowledge work: write with an agent, preserve what matters, and make future work better because the workspace remembers.

## Current direction

Cortex v1 is a local desktop application focused on:

- Excellent Markdown writing
- Scoped AI conversations
- Inline edits and anchored comments
- Reviewable file proposals and diffs
- Local full-text search and retrieval
- Conversation-to-document workflows
- Cited web research

Cloud sync, mobile/web clients, recurring jobs, MCP, and autonomous maintenance are planned only after the local core loop is proven.

## Technology

- Electron
- React + TypeScript + Vite
- CodeMirror 6
- SQLite with FTS5
- Markdown files as the canonical store for authored knowledge

See [`docs/technology.md`](docs/technology.md) for the current technical direction.

## Documentation

- [`docs/product-brief.md`](docs/product-brief.md) — product thesis, users, principles, and MVP
- [`docs/roadmap.md`](docs/roadmap.md) — dependency-ordered product roadmap
- [`docs/technology.md`](docs/technology.md) — current technology decisions
- [`docs/technical-architecture.md`](docs/technical-architecture.md) — historical architecture research and tradeoffs

## Core loop

```text
write or converse
  → agent understands the current scope
  → research or edits become reviewable proposals
  → user approves and continues editing
  → durable knowledge improves future work
```

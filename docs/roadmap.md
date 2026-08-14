# Cortex Product Roadmap

## Roadmap principle

Build the smallest system that proves the core loop:

> Write or converse → retrieve context → review a proposed change → safely apply it → preserve the result for future work.

Every later feature—maintenance, web research, jobs, MCP, sync, mobile, and cloud agents—should reuse that loop rather than create a parallel workflow.

The roadmap is dependency-ordered. It is intentionally local and narrow at the beginning.

## Phase 0 — Product and technical foundation

### Goal

Turn the current decisions into an implementation-ready foundation without building speculative infrastructure.

### Deliverables

- Electron + TypeScript application shell
- React + Vite renderer
- Typed modular core boundary
- Workspace and document terminology
- Initial SQLite schema and migration approach
- Secure main/renderer process boundary
- Provider-neutral agent event contract
- Proposal and revision terminology
- Basic design system and three-pane layout skeleton

### Exit criteria

- A workspace can be opened through the shell.
- Core modules can be tested without rendering the UI.
- The renderer cannot access arbitrary filesystem or credential APIs directly.
- The first vertical slice can be implemented without redesigning storage boundaries.

### Deliberately deferred

- Cloud accounts and sync
- Jobs
- MCP
- Embeddings
- Git integration
- Multi-user collaboration
- Multiple named agents

## Phase 1 — Workspace and document foundation

### Goal

Make Cortex a genuinely useful local Markdown editor before adding a sophisticated agent.

### Deliverables

- Open and switch between workspaces
- Browse folders and files
- Create, rename, move, and delete Markdown documents
- CodeMirror 6 source-text editor
- Markdown syntax highlighting and preview support
- Save, reload, and crash-safe document writes
- Unsaved-change handling
- Basic attachment discovery
- `.cortex/config.json` or equivalent small workspace manifest
- Filesystem watcher with reconciliation after events

### Exit criteria

- Valid Markdown remains unchanged unless the user edits it.
- External edits from Codex, a shell, or another editor are detected.
- Cortex does not overwrite newer external changes silently.
- A user can write for a meaningful session without encountering data loss.

## Phase 2 — Local state and conversations

### Goal

Make conversations durable working history while keeping authored knowledge in Markdown.

### Deliverables

- SQLite-backed workspaces, chats, messages, agent runs, and tool calls
- Streaming message persistence
- Resume and reopen behavior
- Workspace, project, and document chat scopes
- Inspector conversation for the active document
- Full conversation view
- Attach and pin documents or passages as context
- Basic conversation search and metadata

### Exit criteria

- A conversation survives closing and reopening the app.
- A document chat can be resumed without losing scope.
- Chat runtime data does not clutter or corrupt the workspace folder.
- The UI distinguishes a chat, a message, an agent run, and a tool call.

## Phase 3 — Agent runtime and provider adapters

### Goal

Connect a general agent to the workspace through a stable, reviewable runtime boundary.

### Deliverables

- `AgentRuntime` interface
- Normalized event stream for text, status, tool calls, sources, file reads, proposals, permissions, errors, and completion
- Local interactive provider adapter
- API/gateway provider adapter using explicit user configuration
- Local CLI adapter for supported installed agents where practical
- Cancellation and retry behavior
- Explicit tool permission checks
- OS credential-store integration for API keys

### Exit criteria

- The UI does not depend on provider-specific event formats.
- An agent can read scoped workspace context.
- Provider failures are visible and recoverable.
- No Cortex code attempts to copy or reuse proprietary subscription tokens.
- The same run model can support future jobs and cloud execution.

## Phase 4 — Proposals, diffs, and history

### Goal

Make AI-assisted writing safe and compelling.

### Deliverables

- Typed proposal model
- Base-content hash on every proposal
- File-level diff viewer
- Inline selection replacement flow
- Anchored comments and suggestions
- Apply, edit, reject, and cancel actions
- Multi-file proposal review
- Atomic application with stale-base detection
- Local snapshots before application
- Proposal attribution to chat, run, provider, and source material

### Exit criteria

- The agent never writes directly into the canonical file during generation.
- A stale proposal cannot overwrite newer content.
- Every applied change can be identified and recovered.
- Selection edits feel native to the CodeMirror editor.
- Review remains understandable for both one-line and multi-document changes.

## Phase 5 — Search and retrieval

### Goal

Make the workspace’s accumulated knowledge useful in future work.

### Deliverables

- SQLite FTS5 index for Markdown content
- Search by text, path, project, heading, and recency
- Search over conversations and accepted proposals
- Rebuildable index with content hashes
- Scope-aware retrieval for workspace, project, and document chats
- Recent and pinned context
- Backlinks and forward links for Markdown references
- Context preview showing why a result was selected

### Exit criteria

- A user can find an important decision using exact language.
- Project and document chats do not silently load the entire workspace.
- Search results are explainable and link back to source locations.
- Indexes can be deleted and rebuilt without losing authored content.

### Deferred from this phase

- Hosted memory products
- Automatic embeddings
- Opaque “memory” records that compete with documents
- Fully autonomous context selection

## Phase 6 — First complete vertical slice

### Goal

Prove Cortex’s product thesis end to end.

### Scenario

```text
open workspace
  → create project and Markdown document
  → write rough idea
  → open document chat
  → ask for critique
  → research a related question
  → receive cited findings
  → create or update project brief
  → review diff
  → apply change
  → close and reopen
  → search and retrieve the decision
```

### Exit criteria

- The complete scenario works with local files and local state.
- The experience feels coherent without requiring a separate external tool.
- The product can be evaluated by daily use rather than architecture diagrams.

### Decision gate

If this loop is not compelling, stop and improve the editor, context assembly, or proposal UX before adding more systems.

## Phase 7 — Knowledge transitions and maintenance

### Goal

Make Cortex more than an editor with chat by helping knowledge stay coherent.

### Deliverables

- Conversation-to-document artifact actions
- Extract decisions and open questions
- Create product briefs, roadmaps, and research notes from selected context
- Detect likely stale passages
- Detect contradictions and duplicated knowledge
- Suggest links and backlinks
- Maintenance inbox with quiet, reviewable suggestions
- Document provenance and source references
- Multi-document update proposals

### Exit criteria

- The user can promote useful conversation output without copy/paste.
- Maintenance suggestions are high-signal and never silently mutate content.
- Every suggestion points to the evidence and proposed change.
- The workspace becomes more coherent through normal use.

## Phase 8 — Web research and cited artifacts

### Goal

Turn web research into durable, reviewable workspace knowledge.

### Deliverables

- Search and fetch tools with explicit permission states
- Source capture and citation model
- Cited research artifact template
- Source snippets and links in proposal review
- Research from global, project, and document contexts
- Source-aware follow-up conversations
- Reproducible research run history

### Exit criteria

- A user can ask a question and receive a cited Markdown artifact.
- Sources remain inspectable after the conversation ends.
- Research output is a proposal until approved.
- Failed or partial research runs do not produce misleading artifacts.

## Phase 9 — Jobs and durable knowledge-work workflows

### Goal

Allow reliable workflows to continue on a schedule without creating a generic automation builder.

### Deliverables

- First-class Job entity
- Purpose, schedule, scope, tools, destinations, permissions, and review policy
- Reusable Agent Run model
- Run history and status
- Pause, resume, cancel, and retry
- Proposed output documents and diffs
- Review conversation for each run
- One or two opinionated job templates, such as recurring research or wiki maintenance

### Exit criteria

- A user can turn an existing research workflow into a job.
- Job output returns to the ordinary proposal and review system.
- Jobs cannot silently broaden their scope or permissions.
- A failed job leaves a useful trace rather than a partial overwrite.

## Phase 10 — External interfaces: CLI and MCP

### Goal

Make Cortex’s workspace and proposal model useful to external agents without making Cortex an orchestration platform.

### Deliverables

- Stable headless core APIs
- Read-only workspace CLI
- Search and context commands
- Proposal creation and review commands
- MCP server with conservative read and proposal tools
- `AGENTS.md` and workspace convention guidance
- Audit trail for external-agent actions

### Exit criteria

- Codex, Pi, and Claude Code can read project context naturally.
- External agents can propose changes without bypassing review.
- The same domain rules apply through UI, CLI, and MCP.
- Permissions and paths are explicit and testable.

## Phase 11 — Optional managed sync

### Goal

Support cross-device access while preserving a real local workspace for desktop tools.

### Architectural direction

Start with local Markdown as canonical and make sync optional. If cross-device demand becomes real, evaluate a Cortex-managed sync layer with explicit document revisions, hashes, offline queues, and conflict review. Git can be an integration or transport, but it should not be forced into the MVP.

### Deliverables

- Account and device model
- Workspace registration
- Document revision and content-hash protocol
- Local outbox and remote inbox
- Create, edit, rename, and delete synchronization
- Clean-buffer remote updates
- Explicit conflict state and three-way review
- Background reconciliation when Cortex reopens
- Optional managed Git-backed experience only after the direct sync semantics are clear

### Exit criteria

- Concurrent edits never silently overwrite one another.
- Offline work queues and recovers safely.
- A desktop agent can continue to use ordinary files.
- Sync can be disabled without making the local workspace unusable.

## Phase 12 — Mobile, web, and cloud agent execution

### Goal

Extend the proven workspace to devices and long-running work.

### Deliverables

- Cloud-backed conversations and job history
- Mobile reading, writing, and scoped conversations
- Web client if the workflow supports it
- Cloud agent runtime for jobs and long-running research
- Proposal delivery back to desktop or cloud review surfaces
- Shared permissions and device state

### Possible technology direction

Convex is a strong candidate for the cloud control plane: realtime workspace metadata, conversations, jobs, sync metadata, and agent-run state. A durable cloud agent runtime such as Eve may become useful for scheduled or long-running execution. Neither should replace the local document and proposal boundaries.

### Exit criteria

- Cloud work produces the same reviewable proposal format as local work.
- Mobile and web do not require direct filesystem access.
- Local and cloud clients agree on document revisions and permissions.
- Cloud execution remains optional for the local desktop product.

## Cross-cutting quality gates

Every phase should preserve:

- User ownership of authored content
- Explicit context and permissions
- Reviewable and reversible writes
- Safe handling of stale state and concurrent edits
- Explainable retrieval
- Clear error and cancellation behavior
- Minimal abstractions and small domain services
- Testable headless logic

## Features intentionally outside the current roadmap

- Full multiplayer collaboration
- General-purpose automation marketplace
- Plugin ecosystem
- Rich canvas and database builder
- CRDT-based document model
- Hosted opaque memory system
- Automatic background editing without review
- Replacing Codex, Pi, or Claude Code as a coding-agent runtime

## Immediate build order

1. Electron shell and modular core.
2. Workspace open, browse, and document editing.
3. SQLite conversation persistence.
4. Scoped chat and agent event contract.
5. Proposal, diff, hash guard, and local snapshot.
6. FTS5 search and context assembly.
7. Complete vertical slice.
8. Only then begin maintenance, research, jobs, or sync.


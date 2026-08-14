# Cortex Technology

## Technology position

Cortex should begin as a local desktop application with a small modular monolith. The architecture must make the product loop excellent before it attempts cloud synchronization, mobile clients, jobs, MCP, or multi-user collaboration.

The selected v1 direction is:

```text
Electron
  ├── React + TypeScript + Vite renderer
  ├── TypeScript application/core services
  ├── Node.js main-process integration
  ├── CodeMirror 6 source editor
  └── SQLite operational state and FTS5 search
```

Tauri 2 remains a reasonable later alternative or a future packaging decision, but Electron + TypeScript is the v1 choice because Cortex’s near-term risk is product and editor iteration speed. The product should not make the shell the center of its architecture.

## Architectural principles

1. **Markdown is canonical for authored knowledge.** Cortex must leave users with ordinary, portable files.
2. **SQLite is canonical for operational application state.** Conversations, runs, proposals, citations, and indexes need structured persistence.
3. **Derived data must be rebuildable.** Search indexes, caches, thumbnails, and future embeddings are not the source of truth.
4. **The core is headless and modular.** UI, CLI, MCP, jobs, and future mobile/cloud surfaces should call the same domain services.
5. **AI writes are proposals.** The model never streams directly into canonical files.
6. **Context is explicit and scoped.** Workspace, project, and document boundaries must be visible and enforceable.
7. **Local first means no cloud dependency for the MVP.** Sync is a later product subsystem, not hidden plumbing.
8. **Keep abstractions small.** Prefer explicit repositories and services over a large framework or premature distributed architecture.

## Runtime shape

```text
Electron renderer
  UI state, editor, chat, diff review, navigation
          │ typed IPC / application API
Electron main process
  workspace access, agent execution, credentials, lifecycle
          │
Cortex core
  workspace service
  document service
  conversation service
  context service
  search service
  proposal service
  history service
  agent runtime
          │
Adapters
  filesystem
  SQLite
  local CLI providers
  API/gateway providers
  web research tools
```

The renderer should not directly access arbitrary paths, spawn processes, or read credentials. The main process exposes narrow, typed operations backed by the core.

## Suggested project structure

```text
src/
  main/
    bootstrap.ts
    ipc/
    security/
  renderer/
    app/
    components/
    editor/
    chat/
    review/
  core/
    workspace/
    documents/
    conversations/
    context/
    search/
    proposals/
    history/
    agents/
  adapters/
    filesystem/
    sqlite/
    providers/
    web/
  shared/
    contracts/
    ids.ts
    errors.ts
```

This is a logical boundary, not a reason to create many packages or processes. Keep the first implementation in one repository and one application.

## Desktop shell: Electron

Electron + TypeScript is selected for v1 because it offers:

- A consistent Chromium renderer for CodeMirror and rich editor interactions
- A fast TypeScript-only development path
- Straightforward filesystem and process integration through the main process
- A large ecosystem for streaming UI, editors, and desktop tooling
- Easier iteration while the product interaction model is still changing

Costs and constraints:

- Larger application size and memory footprint
- A privileged main process that requires strict isolation
- More responsibility for secure IPC and process spawning
- Careful packaging and update strategy later

Required Electron posture:

- `contextIsolation: true`
- `nodeIntegration: false` in the renderer
- Sandboxed renderer where practical
- Narrow preload API
- No arbitrary renderer-controlled command execution
- Validate every IPC request at the boundary
- Treat workspace paths and external tool output as untrusted input

## UI: React, TypeScript, and Vite

React + TypeScript + Vite is the working renderer stack. The UI should be organized around a calm three-pane workspace:

- **Left:** folders, projects, documents, conversations, and later jobs
- **Center:** editor or full conversation
- **Right:** contextual inspector with chat, sources, comments, proposals, or metadata

The center is the primary work surface. A permanent generic chat panel should not dominate the application.

## Editor: CodeMirror 6

CodeMirror 6 is the canonical editor foundation because Cortex must preserve source Markdown faithfully while supporting rich collaboration features.

Use it for:

- Markdown editing
- Syntax highlighting
- Selection-aware commands
- Inline decorations
- Anchored comments
- Proposed replacements
- Undo and redo
- Exact range and content tracking

The editor model remains source text. Do not make a ProseMirror-style AST the canonical representation unless a real workflow proves that source-preserving round trips are reliable enough.

### AI interaction rules

- Stream generation into a temporary proposal buffer.
- Anchor selection proposals to a base document version.
- Show inline replacement or a normal file diff depending on change size.
- Preserve original text until approval.
- Rebase or reject proposals whose base hash is stale.
- Keep comments separate from document content until explicitly promoted.

## Storage boundary

### User-owned workspace

```text
workspace/
  Markdown documents
  user-owned attachments
  optional .cortex/config.json
  optional AGENTS.md and future skill/job definitions
```

The workspace should remain useful if Cortex is uninstalled.

### Cortex application data

Store live operational state in the OS application-data directory, not inside the workspace:

```text
Application Support/Cortex/
  workspaces/<workspace-id>/
    cortex.sqlite3
    snapshots/
    caches/
    logs/
```

Keeping the live database outside the workspace avoids Git noise, SQLite WAL sidecars, accidental external edits, and sync corruption.

## SQLite data model

Use SQLite through a small typed repository layer. Avoid a large ORM until the domain is genuinely complex.

Initial entities:

```text
workspaces
projects              -- optional derived/contextual folder records
documents             -- path, hash, metadata, timestamps
document_links
chats                 -- durable conversational containers
messages
agent_runs            -- one execution within a chat or job
tool_calls
sources               -- URLs, files, citations, fetched metadata
proposals             -- reviewable change sets
proposal_operations   -- file operations and range edits
approvals
snapshots             -- local recoverable versions
workspace_settings
```

Later entities:

```text
jobs
job_runs
devices
remote_revisions
sync_outbox
conflicts
skills
```

Chats and agent runs are separate. A chat is the durable conversational container; a run is one execution that may contain tool calls, sources, and proposals.

## Filesystem behavior

Use filesystem watchers as hints, not as the source of truth.

```text
watcher event
  → debounce
  → read current file state
  → compute content hash
  → compare against known state
  → reconcile document record
  → refresh index
```

The document service must distinguish:

- Cortex-originated writes
- External edits
- Renames and moves
- Deletes
- Temporary or partial writes
- Conflicting changes during an active proposal

Writes should use a safe temporary-file-and-rename pattern where appropriate. Cortex must not treat its own write event as a new independent user edit.

## Search and retrieval

Start with SQLite FTS5 and metadata filters.

Index:

- Markdown body
- Headings
- Path and filename
- Project/folder scope
- Accepted proposal text where useful
- Conversation text with explicit separation from documents

Retrieval order for an agent run:

1. Current workspace/project/document scope
2. Explicitly attached files and conversations
3. Pinned context
4. Recent relevant activity
5. FTS5 and link-based results
6. Active `AGENTS.md` instructions
7. Provider and permission constraints

Show the user what context was used. Embeddings and semantic retrieval remain extension points until exact search and relevance tests demonstrate a need.

## Agent runtime

Define a provider-neutral runtime before adding multiple providers.

```ts
interface AgentRuntime {
  runInteractive(input: AgentRunInput): AsyncIterable<AgentEvent>;
  cancel(runId: string): Promise<void>;
  resume(runId: string): AsyncIterable<AgentEvent>;
}
```

The event model should normalize:

- Text deltas
- Status and reasoning indicators where available
- Tool calls and results
- File reads
- Web sources
- Proposed file changes
- Permission requests
- Errors
- Completion and cancellation

Initial adapters:

1. Local interactive provider for the in-app assistant.
2. API/gateway provider using explicit user configuration.
3. Local CLI adapter for supported installed agents when the contract is reliable.

Cortex must not attempt to extract or reuse proprietary subscription credentials from another application. Local tools remain responsible for their own authentication.

## Proposal and history model

Every content mutation must carry:

- Workspace and document identity
- Base content hash or revision
- Proposed operations
- Originating chat and run
- Provider and model metadata where available
- Source references
- Created and reviewed timestamps

Application flow:

```text
agent output
  → typed proposal
  → base-hash validation
  → diff review
  → user edits/accepts/rejects
  → snapshot
  → atomic file application
  → index update
```

If the base hash is stale, do not overwrite the file. Re-read the current content and request a rebase, a new proposal, or an explicit conflict review.

## Web research

Research is implemented as an agent capability, not a separate product area.

The web adapter should return:

- Source URL
- Page title and timestamp where available
- Retrieved content or relevant excerpt
- Citation identifier
- Tool and run metadata

The proposal layer then turns findings into a cited Markdown artifact or document update. Partial research runs must remain visibly partial and must not be presented as complete evidence.

## Credentials and permissions

- Store API keys in the OS credential store.
- Never place credentials in Markdown, SQLite workspace records, logs, or proposal text.
- Make web access and external tool execution explicit capabilities.
- Scope file access to the selected workspace and approved attachments.
- Require review for document writes by default.
- Keep an audit trail for proposal creation and application.
- Treat model output, fetched webpages, and external CLI output as untrusted data.

## Testing strategy

Prioritize tests around document correctness and the core loop.

### Unit tests

- Path and workspace boundaries
- Hash and revision guards
- Proposal application
- Stale proposal rejection
- Markdown link extraction
- FTS indexing and rebuild
- Context assembly and scope filtering
- Agent-event normalization

### Integration tests

- Filesystem watcher reconciliation
- Atomic write and recovery behavior
- SQLite migrations
- Conversation resume
- Provider cancellation and failure
- External edit during an active proposal

### End-to-end tests

- Open workspace → edit Markdown → chat → proposal → review → apply
- Close and reopen with persisted chat and document state
- Search an accepted decision from a later scoped conversation
- Reject a proposal and verify no file mutation

## Deferred technology decisions

### Cloud backend

Convex is a strong later candidate for workspace metadata, cloud conversations, job state, realtime updates, devices, and sync metadata. It should not be introduced into the local MVP merely because it could support future clients.

### Cloud agent runtime

Eve or an equivalent durable runtime may power future scheduled jobs, long-running web research, and mobile/web requests. It should consume and produce the same agent-run and proposal contracts as local execution.

### Sync

Do not make Git the foundational v1 sync mechanism. Git is mature and may become an optional managed or user-controlled integration, but Cortex’s product-specific concerns include ordinary filesystem watching, external edits, device state, offline queues, and conflict review.

### Embeddings and CRDTs

Defer both. Embeddings add indexing and invalidation complexity before FTS5 has been tested. CRDTs are not a natural first fit for arbitrary whole-file Markdown edits from external agents.

## Current technology decisions

| Area | v1 decision |
|---|---|
| Desktop shell | Electron |
| Language | TypeScript, with Node.js in the main process |
| Renderer | React + Vite |
| Editor | CodeMirror 6 |
| Auth | None required for local MVP |
| User documents | Ordinary Markdown files |
| Attachments | Ordinary workspace files |
| Operational state | SQLite outside the workspace |
| Search | SQLite FTS5 plus metadata and links |
| AI writes | Typed, hash-guarded proposals |
| Agent model | One general agent with explicit scopes |
| Providers | Local adapter plus API/gateway adapter boundary |
| Sync | Deferred; local workspace first |
| Jobs | Deferred until the core loop is proven |
| MCP | Deferred until headless APIs stabilize |
| Cloud | Deferred until cross-device demand is proven |

## Technology success test

The architecture is doing its job if the team can improve the editor, context assembly, agent behavior, and proposal review without migrating the workspace format or introducing a distributed system.

The first technical milestone is not “the app has a complete architecture.” It is:

> A user can write Markdown, ask a scoped general agent for help, review a safe proposed change, apply it, and find the result later.


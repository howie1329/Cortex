# Cortex foundational technical architecture

> Historical architecture research. The current v1 product decision is Electron + TypeScript; this document remains the source-backed Tauri evaluation and design research.

Status: recommendation for an MVP, not an implementation plan  
Date: 2026-08-14

## Executive decision

Build Cortex as a **Tauri 2 desktop application with a TypeScript web UI and a Rust core**, using **CodeMirror 6 as a text-native Markdown editor**. The workspace folder is canonical for documents and durable artifacts. A per-workspace SQLite database lives in the operating system's application-data directory, not inside the workspace. SQLite holds conversations, proposals, history, metadata, and rebuildable indexes; it never becomes the canonical store for normal documents.

The first complete product loop should be:

> open user-owned Markdown → write or converse → retrieve relevant local context → produce a reviewable proposal → validate and apply it safely → retain an attributable local version

This recommendation intentionally rejects three tempting shortcuts:

- Do not put a live WAL-mode database under `.cortex/`.
- Do not make a ProseMirror/TipTap JSON tree the editor's canonical representation.
- Do not initialize, commit, or otherwise manage Git automatically in the MVP.

The product context from the existing Cortex discussions reinforces the distinction behind these decisions: **documents are durable knowledge; conversations are durable thinking history**. A conversation's starting scope is a useful default, not a permanent containment rule.

## 1. Recommended stack

### Decision: Tauri 2, TypeScript UI, Rust core

Use:

- Tauri 2 for windows, packaging, permissions, and IPC
- React with TypeScript and Vite for the UI; use Svelte only if existing team fluency makes it materially faster
- Rust for filesystem operations, watching, SQLite, indexing, proposal validation/application, and history
- TypeScript for editor/UI state and presentation
- a narrow typed command/event boundary between UI and core

Tauri renders HTML in the operating system webview and bridges it to a compiled Rust backend through message passing; it does not bundle its own browser runtime. It also provides per-window/webview capabilities that constrain frontend access to native commands. Those properties fit Cortex's need for a web-editor ecosystem without placing direct filesystem authority in the renderer. See the official [Tauri architecture](https://v2.tauri.app/concept/architecture/), [command interface](https://v2.tauri.app/develop/calling-rust/), and [capabilities system](https://v2.tauri.app/security/capabilities/).

The renderer should not receive broad filesystem permissions. It should invoke semantic core operations such as `read_document`, `save_document`, `search_workspace`, `create_proposal`, and `apply_proposal`. This makes the core API reusable by the UI, built-in AI, jobs, and a future MCP server.

### Why not Electron

Electron is the lower-risk fallback if Tauri's system-webview differences or Rust ramp materially slow delivery. Electron embeds Chromium and Node and provides a consistent renderer on macOS, Windows, and Linux. Its official model has a privileged Node main process, sandboxed renderer processes, preload/context bridges, and IPC. See Electron's [introduction](https://www.electronjs.org/docs/latest/), [process model](https://www.electronjs.org/docs/latest/tutorial/process-model), and [sandbox guidance](https://www.electronjs.org/docs/latest/tutorial/sandbox).

Electron's consistent Chromium runtime is a genuine advantage for editor debugging. It is not decisive here: CodeMirror is browser-oriented, the UI is mostly conventional, and Cortex benefits from a small native core that owns all file and database correctness. Tauri gives that boundary by construction and avoids shipping a second browser runtime. Run an early editor spike on macOS WebKit and Windows WebView2; switch to Electron only if concrete compatibility defects block the editor.

### Why not native Swift/AppKit/SwiftUI

Native macOS provides excellent document, window, and filesystem integration. SwiftUI's `DocumentGroup` supplies standard opening, saving, multiwindow, and document lifecycle behavior ([Apple documentation](https://developer.apple.com/documentation/swiftui/documentgroup)). But native Swift gives up the strongest web editor ecosystem and makes Windows/Linux a rewrite. Cortex's differentiating risk is Markdown editing plus AI review UX, not native control fidelity. Native is therefore the wrong MVP trade unless the product explicitly becomes macOS-only.

### Shell decision gate

Before committing the whole app, build a two-week vertical spike that proves:

1. CodeMirror with a 5–10 MB Markdown file in the macOS system webview.
2. Streaming model output without blocking input.
3. recursive watch/reconcile under common editors and Git operations.
4. signed packaging and access to a user-selected workspace.

If these pass, stay on Tauri. Do not maintain dual shells.

## 2. Editor recommendation

### Decision: CodeMirror 6; Markdown text is the editor model

CodeMirror explicitly treats a document as a flat string and represents changes as exact range replacements. Its state and document are immutable, and the text is stored in a tree for efficient updates. These properties are a direct match for a filesystem-canonical Markdown product. See the official [CodeMirror system guide](https://codemirror.net/docs/guide/) and [reference manual](https://codemirror.net/docs/ref/).

Use CodeMirror as the source-editing surface with:

- Markdown syntax parsing/highlighting
- visual styling that makes Markdown pleasant rather than code-like
- decorations/widgets for links, images, citations, AI comments, and proposal markers
- a rendered preview mode where useful
- exact text ranges as the common currency for selections, citations, changes, and conflicts

The editor state is text, not an AST. A parsed Markdown syntax tree is derived and disposable. It may guide headings, outline navigation, chunks, and safe structural edits, but serialization never depends on it.

### Byte and syntax fidelity contract

For the MVP:

- support UTF-8 Markdown; detect and refuse destructive editing of undecodable/binary input
- retain BOM presence and the original newline convention as file metadata
- do not normalize whitespace, delimiter choices, list markers, frontmatter, embedded HTML, or unknown extensions on load/save
- write only the text the user or accepted operation changed
- test unchanged open/save as byte-identical and edited saves as localized changes

CodeMirror's internal positions are UTF-16 code-unit offsets, so persisted citations and proposals must not rely on offsets alone. Store a content hash plus text anchors/context; resolve to current offsets when displayed.

### Why not ProseMirror/TipTap as the primary editor

ProseMirror's canonical document is a schema-constrained hierarchy of nodes and marks, parsed from and serialized to another representation. That is excellent for rich structured editing, collaboration, and constrained schemas, but it means Markdown must undergo parse → tree → serialize. See the official [ProseMirror guide](https://prosemirror.net/docs/guide/).

TipTap's Markdown support similarly parses Markdown into TipTap/ProseMirror JSON and serializes the tree back to Markdown. Its Markdown package remains labeled beta, and its own guidance says all needed extensions must be installed or content may be lost and round trips must be tested. See [TipTap Markdown usage](https://tiptap.dev/docs/editor/markdown/getting-started/basic-usage), its [Markdown API](https://tiptap.dev/docs/editor/markdown/api/editor), and [Markdown changelog](https://tiptap.dev/docs/resources/changelog/markdown).

Even a semantically lossless round trip is not byte-preserving: equivalent Markdown spellings, whitespace, embedded HTML, comments, and unknown syntax can be rewritten. That violates Cortex's strongest storage claim. TipTap/ProseMirror should only be reconsidered if user testing proves that a true WYSIWYG editor is more important than preserving arbitrary Markdown. It should not run alongside CodeMirror in the MVP.

### Other candidates

- Lexical is a strong structured rich-text editor, but it also makes an editor-specific state tree canonical and therefore has the same Markdown round-trip problem.
- Milkdown combines ProseMirror with Markdown tooling; it improves Markdown ergonomics but does not remove the canonical-tree boundary.
- Monaco is optimized for IDE-scale code editing and brings unnecessary product surface and weight.
- a native text system would require rebuilding Markdown parsing, decorations, inline AI interactions, and cross-platform behavior.

## 3. Storage architecture

### Decision: live SQLite belongs outside the workspace

Use this conceptual layout on macOS:

```text
User workspace/
  notes and folders...
  attachments/                 # user-owned artifacts, if used
  .cortex/
    config.json                # optional, small, portable, declarative

~/Library/Application Support/<bundle-id>/
  workspaces/<local-workspace-id>/
    cortex.sqlite3             # durable app state
    backups/                   # rotating consistent DB backups

~/Library/Caches/<bundle-id>/
  workspaces/<local-workspace-id>/
    derived/                   # disposable render/model caches
```

Use the platform equivalents on Windows and Linux. Apple's guidance places app-managed support state in Application Support and regenerable data in Caches ([file locations](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/AccessingFilesandDirectories/AccessingFilesandDirectories.html), [directory details](https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/MacOSXDirectories/MacOSXDirectories.html)).

Do not place `metadata.db` inside `.cortex/`. In WAL mode, a live SQLite database is not one file: its state may include `-wal` and `-shm` sidecars, and a hot WAL is part of recoverable database state. SQLite also cannot use WAL across different machines on a network filesystem because the WAL index requires shared memory. See SQLite's [WAL file format](https://www.sqlite.org/walformat.html), [database format](https://www.sqlite.org/fileformat.html), and [WAL documentation](https://www.sqlite.org/wal.html).

Keeping the database in the workspace would create four avoidable problems:

1. Git sees noisy binary changes and transient sidecars.
2. consumer sync tools may copy an inconsistent set of live files.
3. indexes duplicate private document text into a surprising hidden folder.
4. copied/cloned workspaces can duplicate internal identities and runtime state.

The app registry assigns a local workspace UUID and stores an OS bookmark plus root-path/file-identity hints so a moved workspace can be found again. Do not put the local UUID in portable config. A copied workspace should naturally become a separate local workspace.

### Exact ownership boundary

| Location | Owns | Rebuildable? |
|---|---|---:|
| ordinary workspace files | Markdown, images, PDFs, and other user artifacts | canonical |
| `.cortex/config.json` | format version, relative project roots, ignore rules, explicit workspace settings | yes from user choices, but portable |
| Application Support SQLite | conversations, messages, sources, agent runs, proposals, approvals, local history, document identity/path map, UI state | mixed |
| SQLite derived tables | file metadata, headings, links/backlinks, chunks, FTS5, optional embeddings | yes |
| OS cache directory | thumbnails, render output, downloaded model/cache material | yes |
| OS credential store | provider tokens and secrets | no |

API keys do not belong in SQLite or `.cortex`; use the OS credential store. Apple's Keychain is intended for small secrets stored in an encrypted database ([Keychain Services](https://developer.apple.com/documentation/security/keychain-services)).

The hidden workspace config must remain small and human-inspectable. It must never contain conversations, absolute paths, device IDs, timestamps that churn on every launch, search indexes, embeddings, WAL files, or secrets. Do not use extended attributes for required metadata; copies, archives, Git, and sync tools do not reliably preserve them.

### Privacy consequence

The Application Support database contains durable conversation history and may contain indexed copies of document text. It is local, but it is sensitive. Use user-only file permissions, disclose the duplicated local index clearly, provide “delete Cortex data for this workspace,” and create consistent rotating backups with SQLite's [online backup API](https://sqlite.org/backup.html). Rebuildable indexes can be excluded from backups; conversations, proposals, and history cannot. App-level database encryption can be added later, but API keys must use the credential store from day one.

## 4. Minimal core domain model

Do not model every future automation concept now. The durable MVP entities are:

| Entity | Minimal fields and rule |
|---|---|
| Workspace | local ID, root bookmark/path hints, display name, created/opened times |
| Project | ID, relative root path, name; a context boundary, not exclusive ownership |
| Document | local ID, current relative path, file identity hints, content hash, size/mtime, parse/index status |
| Conversation | ID, title, default scope kind/reference, created/updated/archived times |
| Message | ID, conversation ID, optional parent ID, role, ordered content parts, status, model/provider metadata, times |
| Context attachment | message/conversation ID, target kind/ID/path, explicit vs retrieved, content hash/version |
| Source | ID, URL or local reference, title, retrieved time, content hash, optional cached snapshot reference |
| Citation | source/document ID, target message/artifact, locator/anchor, quoted-context hash |
| Agent run | ID, conversation/message IDs, status, provider/model, start/end, token/cost summary, error |
| Tool invocation | run ID, tool name, validated arguments/result envelope, approval and timing |
| Mutation proposal | ID, run ID, state, base workspace revision, operations, created/reviewed/applied times |
| History snapshot | document ID/path, byte-content hash/blob, reason, actor, time, proposal ID if applicable |

`Message.content_parts`, provider-specific model metadata, and tool payloads can be JSON inside a relational envelope. Do not serialize the whole conversation into one JSON blob. Relational rows support streaming, partial failure, citations, branches, and queries without inventing a generic event-sourcing system.

Conversation data belongs in SQLite, not Markdown or JSONL. It is transactional, relational, frequently appended, and contains structured tool/branch metadata. Offer explicit JSONL export later for portability and diagnostics; do not make live JSONL the primary store because updates, branches, archive state, and cross-record integrity become application code.

Conversation scope is a default retrieval prior:

- global: no automatic project filter
- project: prefer documents under the project's relative root
- document: always begin with the current document/version

Each message can add explicit attachments outside that default. When a document moves, its local ID follows it and project membership is recomputed from paths. The conversation keeps its default document ID; it is not silently reassigned. A global conversation can adopt a project as its new default through an explicit user action.

`Job` should be deferred as a table until scheduling is implemented. Its eventual minimum shape is schedule, instructions, default scope, allowed tools/write policy, target, enabled state, and run IDs. It must call the same context, tool, proposal, and history services—not a second automation engine.

## 5. Search and context retrieval

### Decision: FTS5 first; embeddings only after measured failures

SQLite FTS5 supports full-text virtual tables, phrase/prefix/NEAR/boolean queries, column filters, snippets/highlights, and relevance ordering. It also supports external-content/contentless configurations and rebuilding. See the canonical [FTS5 documentation](https://sqlite.org/fts5.html).

Index one row per heading-aware chunk, not just one row per file:

```text
chunk(id, document_id, ordinal, heading_path, start_anchor, end_anchor,
      content_hash, body, indexed_at)
chunk_fts(title, relative_path, heading_path, body)
```

Also index conversation messages in a separate FTS table. Start ranking with:

1. FTS5 lexical relevance, with title/path/heading weighted above body.
2. exact filename and heading boosts.
3. conversation-scope boost (document > project > workspace).
4. light recency boost, capped so recent noise cannot bury exact older decisions.
5. explicit links/backlinks as a secondary boost.

Return evidence objects, not plain strings: document/message ID, current path/title, heading, content hash, stable text anchors, excerpt, and score components. The model context assembler records which evidence was used so citations and later audits remain possible.

The context engine pipeline should be explicit:

```text
request + current selection
  -> mandatory context (current document/explicit attachments)
  -> scoped candidate search
  -> deduplicate and diversify by document/heading
  -> allocate token budget
  -> assemble excerpts with provenance
  -> model/tool run
```

Do not add a separate opaque "memory" product or service. Cortex's durable memory is the user-visible workspace artifacts plus the durable conversation record. FTS tables, parsed chunks, backlinks, and future embeddings are derived retrieval aids; they may help find knowledge but must never become a hidden source of truth that cannot be inspected or rebuilt.

Use a fixed budget policy: reserve output/tool capacity first, then mandatory context, then retrieved passages. Never include an entire project by default. Cache parsed chunks by content hash; watcher reconciliation invalidates only changed documents.

Do not ship embeddings in the first MVP. They introduce model downloads or external disclosure, chunk/model-version invalidation, storage, and opaque ranking before Cortex has a query evaluation set. Collect a small set of real queries and expected results first. If semantic recall is demonstrably weak, add embeddings as a rebuildable, versioned index and combine ranks with reciprocal-rank fusion. `sqlite-vec` is plausible but currently describes itself as pre-v1 with expected breaking changes ([source repository](https://github.com/asg017/sqlite-vec)); keep it behind an internal search-provider interface rather than in the schema contract.

## 6. Safe AI mutation architecture

### Decision: structured file operations with exact text replacements and a base hash

The canonical proposal is not a unified diff and not a Markdown AST transform. Store typed operations:

```text
Create(path, bytes, must_not_exist)
Patch(path, base_sha256, replacements[{from, to, old_text, new_text}])
Move(from, to, base_sha256, destination_must_not_exist)
Delete(path, base_sha256)
```

Generate a unified/word diff for review from these operations. Exact replacements are deterministic and easy to validate; the base hash detects external changes; including `old_text` produces a readable failure and supports relocation/rebase. AST-aware tools may generate replacements, but the mutation service only accepts concrete file operations.

Lifecycle:

1. **Build** — read through the core, capture base bytes/hash, and produce typed operations.
2. **Validate** — normalize relative paths; reject traversal, workspace escape, unexpected symlink traversal, ignored/internal targets, invalid UTF-8 patches, duplicate targets, and unsupported file sizes.
3. **Preview** — derive diffs and show creates/moves/deletes distinctly; disclose the actor, run, tool, and sources.
4. **Approve** — user accepts all or selected operations. Destructive actions require explicit confirmation. Trusted jobs may have a separately configured policy later.
5. **Revalidate** — immediately reread targets and compare hashes/existence constraints.
6. **Apply** — snapshot old bytes, write new files to sibling temporary files, flush, then rename into place. Serialize mutations through one per-workspace write queue.
7. **Record** — persist applied hashes, snapshots, actor, and outcome; let watcher events reconcile normally.

No ordinary filesystem offers a portable atomic transaction across multiple files. Cortex should not pretend otherwise. Persist an apply manifest and per-operation state in SQLite before the first rename. On crash, startup recovery can finish or restore from captured bytes. A SQLite transaction guarantees the manifest's own consistency ([SQLite transactions](https://sqlite.org/lang_transaction.html)); it does not make filesystem renames collectively atomic.

If a base hash changed, never blindly apply. Attempt a three-way merge only when base, current external bytes, and proposed result are available and changes are non-overlapping. Otherwise mark the operation conflicted and regenerate or ask the user. The same rule applies to MCP and future jobs.

All AI writes must go through proposals. Manual editor saves still go through the same workspace write/history service, but do not require a proposal dialog. This keeps one validation, conflict, and audit path without making ordinary typing cumbersome.

## 7. File watching and reconciliation

### Decision: watchers are invalidation hints, never ground truth

Use Rust's `notify` recommended watcher in the core. It selects native backends and has a polling fallback. Its documentation explicitly warns that editor save patterns differ, network filesystems may emit no events, large watches can miss events, and renames/removals can be surprising. It also exposes a `need_rescan` signal. See the [`notify` crate documentation](https://docs.rs/notify/latest/notify/) and [`Event` contract](https://docs.rs/notify/latest/notify/struct.Event.html). Tauri's filesystem plugin also exposes debounced and immediate watches ([Tauri file-system plugin](https://v2.tauri.app/plugin/file-system/)), but keeping reconciliation in the Rust core avoids a renderer-owned correctness path.

Algorithm:

- perform a full metadata/hash scan when opening a workspace
- recursively watch the workspace root and also watch its parent for root moves/deletes
- coalesce events by path for roughly 150–300 ms
- stat and hash the resulting path state; infer create/update/delete from observed truth
- pair rename candidates using native paired paths where available, then file identity/content hash within the event batch
- ignore events caused only by Application Support state because that state is outside the workspace
- on overflow, `need_rescan`, wake, or VCS checkout, schedule a bounded subtree/full rescan
- periodically perform a low-priority verification scan for long-running sessions

Open-editor reconciliation:

- clean buffer: reload external bytes, map selection where possible, and show a subtle notice
- dirty buffer: retain base, local, and external versions; auto-merge only non-overlapping edits
- overlapping edits: enter an explicit conflict view with keep-local, keep-external, and manual merge; never autosave over the external version
- deletion with a dirty buffer: keep an unsaved recoverable buffer and ask whether to recreate or discard

Treat common “save via temp file then rename” sequences as one logical content change. Suppress duplicate notifications by content hash, not by ignoring events for a time window; otherwise Cortex can miss a real external edit that follows its own write.

On macOS, FSEvents reports changes to directory hierarchies and is directory-granular ([Apple FSEvents overview](https://developer.apple.com/library/archive/documentation/Darwin/Conceptual/FSEvents_ProgGuide/TechnologyOverview/TechnologyOverview.html)). That is another reason events must lead to a stat/hash reconciliation rather than directly mutating index state.

## 8. Local history and sync

### Decision: Cortex history now; Git integration later

Implement Cortex-native local history in the Application Support database:

- capture a content-addressed full-byte snapshot before every accepted AI mutation
- capture on manual save, coalescing rapid autosaves into useful checkpoints
- store actor/reason, path, hash, time, and proposal/run linkage
- deduplicate snapshot BLOBs by SHA-256
- expose Compare, Restore, and Restore As Copy
- apply restore through the same validated write service and create a new history entry

Full snapshots are deliberately simple. Markdown files are generally small, hash deduplication avoids identical copies, and correctness is clearer than a bespoke delta format. Add retention and compression only after measuring actual database growth.

Detect an existing Git repository and coexist with it, but do not run `git init`, stage, commit, reset, checkout, pull, or push automatically. Git stores commits as snapshots and provides excellent compare/recovery primitives ([Git's data model](https://git-scm.com/book/en/v2/Getting-Started-What-is-Git%3F), [`git commit`](https://git-scm.com/docs/git-commit)), but using it invisibly would alter user repositories, create identity/config questions, and conflate app autosaves with intentional source-control history.

Delay Workspace Sync until local correctness, conflicts, and history are proven. Define a future sync port around versions, content hashes, device IDs, and conflicts; Git may later implement that port for users who choose it. Do not expose push/pull as the product abstraction.

## 9. Internal API and MCP boundary

Create one in-process `CortexCore` service surface around:

```text
workspace: open, scan, watch, status
documents: list, read, save_manual
projects: list, designate
search: query, related
conversations: create, append, archive, read
context: assemble
proposals: create, inspect, approve, apply, reject
history: list, compare, restore
runs: start, record_tool, finish
```

The UI, built-in AI, and future scheduler call these services. The MCP adapter translates MCP resources/tools into the same calls; it contains no direct SQL or filesystem logic. Initially expose read tools and proposal-producing write tools, not raw file writes.

The MCP specification distinguishes application-controlled resources from model-controlled tools and recommends visible human control, input validation, access control, timeouts, logging, and confirmation for sensitive operations. See the official [server overview](https://modelcontextprotocol.io/specification/2025-06-18/server/index), [tool specification](https://modelcontextprotocol.io/specification/2025-03-26/server/tools), and [security principles](https://modelcontextprotocol.io/specification/2025-03-26/index).

For a local MCP server, prefer stdio launched by the client. If HTTP is added, bind only to loopback, validate `Origin`, and authenticate as required by the MCP [transport security guidance](https://modelcontextprotocol.io/specification/2025-11-25/basic/transports). Each MCP client gets explicit workspace/project scopes and read/propose capabilities. External agents should not receive conversation history or the whole workspace merely because they can call `search_workspace`.

## 10. Model/provider layer

Start with one provider and a small internal port for streaming responses, tool calls, usage, and cancellation. Persist the actual provider/model on each run/message. Do not normalize every provider feature or build a generic orchestration framework. Provider portability is useful; provider lowest-common-denominator behavior is not.

Tools should be Cortex domain primitives, not model-provider functions. The provider adapter converts those schemas to its tool-call format and sends tool requests back through the core permission/proposal path.

## 11. Highest technical risks and proving tests

| Risk | Why it can invalidate the product | Proof before expansion |
|---|---|---|
| Markdown fidelity | silent normalization makes “files are canonical” untrue | corpus round-trip tests with GFM, frontmatter, HTML, unknown syntax, odd whitespace, BOM/newlines |
| editor UX | text fidelity can still feel like a code editor | interactive prototype with images, tables, links, comments, inline proposals, large docs |
| external writes | watcher events are lossy and editor save strategies vary | cross-editor/Git stress harness plus forced event loss and dirty-buffer merges |
| AI write safety | stale or broad edits destroy trust | hash-conflict tests, traversal/symlink tests, crash at every apply step, restore tests |
| retrieval quality | weak context makes the agent feel forgetful or misleading | versioned query/evidence evaluation set drawn from real Cortex workspaces |
| hidden sensitive state | search/chat DB duplicates private content | clear storage UI, deletion/export tests, credential-store enforcement, backup policy |
| Tauri webview variance | editor bugs may be platform-specific | early macOS/Windows editor and IME/accessibility spike |

The most consequential irreversible choice is the editor representation. The second is the write/reconciliation protocol. Desktop shell and embedding engine are comparatively replaceable if the core command boundary stays narrow.

## 12. Decisions required now

### Must decide before implementation

1. Tauri 2 + Rust core, with a time-boxed shell/editor spike and an explicit Electron fallback gate.
2. CodeMirror 6 and text-canonical Markdown; UTF-8/newline/BOM fidelity contract.
3. live SQLite in OS Application Support, never under `.cortex/`.
4. exact content split among ordinary files, portable `.cortex/config.json`, durable SQLite, disposable cache, and credential store.
5. one core filesystem API and one per-workspace mutation queue.
6. proposal operation schema, base-hash conflict rule, crash-recovery manifest, and local snapshot history.
7. watcher-as-hint reconciliation and dirty-buffer conflict UX.
8. FTS5 chunk schema and provenance object used by both search results and model context.
9. conversations as structured SQLite records with explicit export later.

### Safe to defer

- embeddings and the vector extension/model
- multiple model providers beyond a narrow adapter seam
- Git-backed sync and managed repositories
- mobile, multiplayer, CRDTs, and cloud services
- recurring jobs and background daemons
- HTTP MCP transport
- app-level full-database encryption
- stable document IDs that survive exporting app state to another device
- collaborative rich-text schemas and real-time coediting

### Explicitly avoid for now

- a proprietary document database with Markdown export
- ProseMirror/TipTap JSON as canonical document state
- dual CodeMirror and rich-text editors
- a live SQLite/WAL database in the workspace or Git repository
- JSONL as the live conversation database
- automatic Git initialization/commits
- arbitrary agent filesystem access
- silent AI writes or silent conflict resolution
- indexing every possible format before Markdown is excellent
- a generic automation/orchestration platform

## 13. Suggested MVP sequence

1. Workspace open/scan, CodeMirror editing, fidelity tests, atomic single-file saves.
2. Rust watcher, index reconciliation, dirty-buffer conflict flow, local snapshots.
3. SQLite FTS5, heading chunks, search UI, provenance.
4. structured conversations with document/project/global default scopes.
5. one provider, streaming, read/search tools, context assembly.
6. single-file proposal preview/apply/restore.
7. multi-file proposals with crash recovery and external-change conflicts.
8. cited web research that proposes a normal Markdown artifact.

Stop there and test whether the core lifecycle feels special before adding jobs, embeddings, MCP writes, sync, or mobile.

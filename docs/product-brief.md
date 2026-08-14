# Cortex Product Brief

## Summary

Cortex is an editor-first, AI-native knowledge workspace where people write, converse, research, and turn useful thinking into durable project knowledge.

Its primary promise is exceptional AI collaboration. Long-term knowledge is the compounding advantage, and exceptional writing is the daily-use foundation.

> Write with an agent, preserve what matters, and make future work better because the workspace remembers.

## The problem

Important thinking is fragmented across AI chats, browser tabs, Markdown files, coding-agent sessions, project tools, and personal notes.

A user can have a valuable conversation, make a decision, or complete meaningful research, then lose the result inside a temporary thread or a collection of disconnected files. Existing tools usually optimize for one state of work:

- Chat tools optimize for conversation.
- Note tools optimize for storage.
- Editors optimize for writing.
- Agent clients optimize for execution.
- Automation tools optimize for scheduled actions.

Cortex connects those states around one user-owned workspace. Conversations are where ideas develop; documents are where understanding compounds.

## Product thesis

Cortex is the Codex of knowledge work: a calm writing environment with a general AI collaborator that can understand a scoped workspace, research, create artifacts, propose changes, and preserve the result as editable knowledge.

The product is not primarily a chatbot, a task manager, or a generic agent platform. The editor remains useful without AI; the AI makes the editor and the knowledge base substantially more capable.

## Core loop

```text
write or converse
        ↓
agent understands the current scope and helps
        ↓
research, synthesis, or edits become reviewable proposals
        ↓
the user approves and continues editing
        ↓
durable knowledge improves future context
```

The longer-term lifecycle is:

```text
capture → converse → research → synthesize → review → publish → maintain → revisit
```

Transitions between these states should feel almost effortless. A user should be able to move from a conversation to a product brief, from research to a cited wiki page, or from a repeated workflow to a job without exporting work into a separate system.

## Primary user

Cortex initially serves solo builders and other knowledge workers who already think in projects and documents:

- Developers and product builders
- Researchers and technical writers
- Independent consultants and creators
- People who use Markdown, Git, AI agents, and project-based workflows

The first user is someone who wants to do a substantial amount of thinking, writing, research, and planning in one place without giving up file ownership or direct authorship.

## Workspace model

A workspace is a user-selected folder of ordinary files. Users can organize it however they want: nested folders, loose documents, or a mixture.

Projects are contextual boundaries, not a rigid database ontology. A project is primarily a folder, with optional metadata later.

```text
Cortex/
  Projects/
    Cortex/
      product-brief.md
      roadmap.md
      research/
        competitors.md
  Writing/
    ideas.md
  Resume/
    resume.md
    job-search.md
  random-note.md
```

Markdown documents and user-owned attachments remain portable and editable outside Cortex. Cortex should understand existing structure rather than forcing a new one.

## Ways of working

The conversation is one input mode, not the product itself. Cortex supports:

- Direct Markdown writing
- Full individual AI conversations
- Document-scoped conversations from the inspector
- Project- and workspace-scoped conversations
- Inline actions on selected text
- Anchored comments and suggestions
- Web research initiated from chat or editor flows
- Artifact creation from conversations
- Manual review and editing of every proposed change

These modes converge on the same workspace and the same proposal system.

## Conversation scope

Chats are durable working history, while documents remain canonical knowledge.

Chats may begin at three levels:

- **Workspace:** no project-specific context by default; workspace and web search can be added explicitly.
- **Project or folder:** understands the selected project boundary, relevant documents, and project activity.
- **Document:** starts from the right inspector and focuses on the current document and its references.

Context should combine explicit scope, attached material, pinned items, recent activity, and relevance-based retrieval. A fixed “last five documents and chats” rule may be a useful initial heuristic but should not become the long-term retrieval model.

## The agent

Cortex should provide one general agent whose context can be deliberately scoped. It can:

- Discuss and challenge ideas
- Critique and rewrite selected text
- Research the web
- Read workspace files and external source material
- Create or update Markdown artifacts
- Extract decisions, open questions, and project updates
- Connect related documents
- Propose multi-document changes
- Eventually maintain recurring knowledge-work jobs

The agent is general-purpose, but its native environment is the user’s workspace. It is not an all-purpose coding-agent replacement.

### Initiative and permissions

The first version is user-directed. The agent may reason, read, search, and prepare work freely. Content changes and external actions produce explicit, reviewable proposals by default.

Later, a user may grant broader permissions to trusted jobs or specific workflows. Autonomous maintenance should be earned through reliable review and undo behavior, not assumed at launch.

## AI collaboration surfaces

The initial collaboration model combines three surfaces:

1. **Inline actions** — select text, request a rewrite or critique, and review the proposed replacement.
2. **Anchored comments** — receive a suggestion or question attached to a precise document range without mutating the document.
3. **Scoped conversations** — coordinate larger work, research, synthesis, and artifact creation beside the editor.

The agent never streams directly into the canonical file. It streams into temporary run and proposal state, then produces a diff that can be accepted, edited, rejected, or reverted.

## Durable artifacts and knowledge maintenance

Useful conversation output should become visible, editable artifacts rather than hidden memory.

Examples include:

- Product briefs
- Roadmaps
- Decision records
- Research notes with citations
- Project wikis
- Meeting or conversation summaries
- Open-question lists
- Career or job-search wikis

The agent should notice high-value opportunities such as stale information, contradictions, repeated knowledge, unresolved decisions, and conclusions that deserve extraction. It should propose precise changes with provenance; it should not silently reorganize the workspace.

## Web research

Web research is an agent capability initiated through chat, editor actions, or eventually jobs. It is not a separate research application.

Typical flow:

```text
ask a question
  → search and fetch sources
  → summarize with citations
  → propose a Markdown artifact or document update
  → review and apply
```

The output should preserve source links, claims, and enough context for the user to inspect or revise the result.

## Jobs

Jobs are a later, first-class Cortex object: durable knowledge-work workflows, not generic automations.

A job contains:

- Purpose
- Schedule or trigger
- Context scope
- Tools and source permissions
- Destination document or folder
- Permission policy
- Run history
- Review policy

Examples:

- Research a topic every week and update a cited wiki.
- Inspect a resume and update a job-search document every weekday.
- Review project notes for stale or contradictory information.
- Summarize external agent activity into a project log.

Job output should return to the same workspace:

```text
job run → proposed document changes → review conversation → durable knowledge
```

## External agents

Cortex should be naturally compatible with Codex, Pi, Claude Code, shell scripts, and other tools because the workspace uses ordinary files and clear project context.

Formal MCP support is a later extension. Cortex should expose stable domain APIs first, then reuse them for a CLI, MCP server, jobs, and future mobile/web clients.

## Product boundaries

Cortex is explicitly not, at least initially:

- A generic chatbot client
- A full task manager or product-management system
- An IDE or replacement for coding agents
- A rigid personal-knowledge ontology
- A database-builder or visual canvas product
- A social or multiplayer workspace
- A universal automation platform
- An autonomous system that silently changes user content

## MVP definition

The first version should prove one complete vertical slice:

1. Open or create a local workspace.
2. Create a project folder and Markdown document.
3. Write a rough idea.
4. Open a document-scoped conversation in the inspector.
5. Ask the agent to critique or expand the idea.
6. Ask it to research a related question.
7. Receive cited findings.
8. Ask it to create or update a project document.
9. Review the proposed diff.
10. Apply or reject the change.
11. Close and reopen Cortex.
12. Search for the resulting decision and retrieve it.

If this loop feels excellent, Cortex has proved its identity before sync, jobs, MCP, or mobile exist.

## Success criteria

The MVP is successful when:

- The editor is pleasant enough for daily writing without AI.
- A user can always understand what context the agent used.
- Proposed changes are precise, attributable, reversible, and safe.
- A conversation can become a useful artifact without manual copy/paste.
- Search can recover important decisions and research locally.
- Reopening the app preserves the workspace and conversation state.
- The product feels like one continuous workspace rather than several connected features.

The strongest validation question is simple:

> Do I want to do this kind of thinking inside Cortex instead of beside it?

## Long-term direction

Once the local loop is proven, Cortex can expand in this order:

- Richer knowledge maintenance and workspace health
- More capable web research and citations
- Jobs and durable background runs
- CLI and MCP interfaces
- Optional managed sync
- Mobile and web clients
- Cloud agent execution and collaboration

The long-term destination is a maintained body of knowledge that becomes more useful as the user writes, thinks, researches, and returns to it.


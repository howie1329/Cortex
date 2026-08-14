# Domain Docs

Cortex is a single-context repository.

## Before exploring

Read:

- `CONTEXT.md` at the repository root, if it exists
- Relevant decisions in `docs/adr/`, if they exist

If these files do not exist, proceed without flagging their absence.

## File structure

```text
/
├── CONTEXT.md
├── docs/
│   ├── adr/
│   ├── agents/
│   └── plans/
└── src/
```

Use the vocabulary defined in `CONTEXT.md`. If a term or decision is unclear, record that gap for domain modeling rather than silently inventing terminology.

Surface conflicts with existing ADRs explicitly.

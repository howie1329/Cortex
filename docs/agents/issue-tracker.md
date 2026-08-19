# Issue tracker: Local Markdown

Issues and specs for this repo live as Markdown files in `docs/plans/`.

## Conventions

- One feature per directory: `docs/plans/<feature-slug>/`
- The spec is `docs/plans/<feature-slug>/spec.md`
- Implementation issues are one file per ticket at `docs/plans/<feature-slug>/issues/<NN>-<slug>.md`
- Triage state is recorded as a `Status:` line near the top of each issue file.
- Comments and conversation history append to the bottom under a `## Comments` heading.

## When a skill says “publish to the issue tracker”

Create a new file under `docs/plans/<feature-slug>/`.

## When a skill says “fetch the relevant ticket”

Read the referenced Markdown file directly.

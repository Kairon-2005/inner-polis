# Session Schema

Every session record uses this front matter contract:

```yaml
session_id: session-YYYY-MM-DD-NNN
date: YYYY-MM-DD
status: open | closed
mode: one-on-one | council
selected_figures:
  - canonical-figure-slug
question: "Exact user question"
loaded_files:
  - path/from/repository.md
loaded_memory:
  - memory-id
```

`selected_figures` contains exactly one item for a one-on-one session and two
through six items for a Council session.

Every closed session record must include these headings:

```text
Session Summary
Memory Candidates
Actions / Decisions
```

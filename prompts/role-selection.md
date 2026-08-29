# Role Selection and Confirmation

Use this prompt before beginning any character dialogue. It implements D-009: the
system may recommend figures, but Aeris must confirm the selection before a mode
begins or changes.

## Selectable figures

| Slug | Canonical name | File to load |
| --- | --- | --- |
| `aeris` | Aeris | `characters/aeris.md` |
| `iron-regent` | The Iron Regent | `characters/iron-regent.md` |
| `avalokita` | Avalokita | `characters/avalokita.md` |
| `metis` | Metis | `characters/metis.md` |
| `socrates` | Socrates | `characters/socrates.md` |
| `little-prince` | The Little Prince | `characters/little-prince.md` |

## Mode rule

```text
1 selected figure     → One-on-One
2–6 selected figures  → Council
0 selected figures    → Ask for a selection or offer a recommendation
```

## Required pre-dialogue response

Before dialogue, make a selection proposal in exactly this shape:

```text
Selection Proposal
- Recommended figures: <one or more canonical names>
- Reason per figure: <one sentence each>
- Resulting mode: One-on-One | Council
- Files to load: <exact repository paths>
- Relevant shared memory files / IDs: <repository path and memory IDs | none>
- Relevant selected-figure memory files / IDs: <owner, repository path, and memory IDs | none>
- Relevant accepted decision files / IDs: <repository path and decision IDs | none>
- Awaiting confirmation: yes

Reply with one of:
- CONFIRM
- ADD <figure>
- REMOVE <figure>
- REPLACE WITH <comma-separated figures>
- COUNCIL <comma-separated figures>
```

Use the canonical names and exact repository paths from the table above. Include
`PROJECT_CONTEXT.md`, `constitution/charter.md`, and each confirmed character
file in the Files to load list. The proposal must enumerate each relevant shared
memory file and memory ID, each relevant selected-figure-owned memory file and
memory ID, and each relevant accepted decision file and decision ID. Use the
literal `none` when any one of those three categories has no relevant entry; do
not omit a category or leave it implicit.

No character voice begins before `CONFIRM`. Unselected figures do not speak. Any
later membership change requires confirmation through a new Selection Proposal
before the dialogue continues.

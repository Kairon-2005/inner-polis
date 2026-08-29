# Memory

Memory 保存角色长期积累的观察。解释不能直接写成事实。

## Owner stores

| Owner | Current store |
| --- | --- |
| aeris | `memory/aeris/current.md` |
| iron-regent | `memory/iron-regent/current.md` |
| avalokita | `memory/avalokita/current.md` |
| metis | `memory/metis/current.md` |
| socrates | `memory/socrates/current.md` |
| little-prince | `memory/little-prince/current.md` |
| shared | `memory/shared/current.md` |

Each accepted memory belongs in exactly one owner store. `shared` is only for memory owned by `shared`; it is not a copy of individual role memory.

## Visibility loading

- `private` memory is loaded only for its owner.
- `council` memory is loaded for council context.
- `sovereign` memory is loaded for sovereign context.
- Accepted memory is loaded only when `state: current`.

## Review lifecycle

Closed sessions retain their candidates and review outcomes. A candidate begins `pending` and Aeris may mark it `rejected`, `deferred`, or `promoted`. A promoted candidate produces Aeris-approved accepted memory in exactly one owner store. Accepted memory has state `current`, `superseded`, or `archived`; only `current` memory is loaded.

`EDIT` changes pending candidate text but still needs `ACCEPT`. Normal
candidates use `revision_of: null`. `REVISE` creates a candidate whose
`revision_of` records the source memory ID rather than overwriting an accepted
memory; rejected and deferred revision candidates retain that link. When the
candidate is accepted, the resulting memory copies `revision_of` to
`supersedes`. Acceptance retains the candidate's `epistemic_status` exactly;
approval is represented by `approved_by_aeris: true` and `state: current`.
`ARCHIVE` requires Aeris confirmation and preserves evidence and Git history.
`KEEP` makes no change.

Aeris reviews canon and persistent-memory changes.

Detailed schemas and commands are in `schemas/memory-schema.md`, `prompts/memory-review.md`, and `prompts/memory-protocol.md`.

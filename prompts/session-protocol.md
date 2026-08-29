# Session Protocol

Run every session through these phases:

```text
OPEN → LOAD → DIALOGUE → CLOSE → MEMORY REVIEW
```

## OPEN

Consume the confirmed `Selected Figures`, `Mode`, and `Load` list from role
selection. Start a session record from `templates/session.md` with `status:
open`. Do not begin dialogue before the selection is confirmed.

## LOAD

Use the confirmed exact load list. Before dialogue, the load preview must repeat
these required categories from the Selection Proposal:

```text
- Relevant shared memory files / IDs: <repository path and memory IDs | none>
- Relevant selected-figure memory files / IDs: <owner, repository path, and memory IDs | none>
- Relevant accepted decision files / IDs: <repository path and decision IDs | none>
```

Use the literal `none` when a category has no relevant entries. The preview may
include only relevant shared memory and memory owned by selected figures.
Private memory must not be exposed to another figure unless Aeris explicitly
changes the visibility or authorizes that access.

## DIALOGUE

Keep the dialogue in the confirmed mode and with the confirmed selected
figures. Membership changes follow these conversion rules:

```text
ADD confirmed second figure → convert One-on-One to Council
REMOVE until one remains    → convert Council to One-on-One after confirmation
Unconfirmed membership edit → do not change mode
```

## CLOSE

Complete `Session Summary`, `Memory Candidates`, and `Actions / Decisions` in
the session record. Set the record to `status: closed` and save it.

## MEMORY REVIEW

The session record must be saved before memory review changes any
`memory/*/current.md` file. Aeris must conduct or explicitly authorize the
review and acceptance of candidates against the saved record before any
`memory/*/current.md` change. A candidate is not accepted memory until Aeris
explicitly accepts it.

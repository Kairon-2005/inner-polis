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

Use the confirmed exact load list. The load preview may include only relevant
shared memory and memory owned by selected figures. Private memory must not be
exposed to another figure unless Aeris explicitly changes the visibility or
authorizes that access.

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
`memory/*/current.md` file. Review candidates against the saved record; a
candidate is not accepted memory until that later review explicitly accepts it.

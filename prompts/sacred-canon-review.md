# Sacred Canon Review

Use one of these individual operations for every Sacred Canon candidate or
accepted entry. Anonymous batch approval is prohibited; list every candidate or
entry ID individually.

```text
INSCRIBE <candidate-id>
EDIT-CANON <candidate-id>: <replacement>
REJECT-CANON <candidate-id>
DEFER-CANON <candidate-id>

REVISE-CANON <entry-id>: <replacement>
ARCHIVE-CANON <entry-id>
KEEP-CANON <entry-id>
```

- GPT or any figure may propose a candidate; only Aeris may approve inscription.
- The session record must be saved and closed before any Sacred Canon operation changes 圣典.md.
- “把这句话写入圣典” creates a pending candidate; it is not approval.
- If the active GitHub connection cannot write, GPT must not claim it changed the repository; hand the approved operation to Codex or another repository writer.
- “查考圣典” fetches the complete 圣典.md from Kairon-2005/inner-polis on literal branch main, reports the path and current IDs, and does not recursively load memory/*.

## Approved state effects

### `INSCRIBE <candidate-id>`

For the one identified candidate in the saved, closed session, set
`review_status: promoted` and create exactly one accepted entry. Copy the
candidate's `category` exactly and copy its `statement` exactly, without
rewriting either value.

### `EDIT-CANON <candidate-id>: <replacement>`

Replace the statement only on the identified pending candidate in the closed
session and leave it at `review_status: pending`. This does not change `圣典.md`;
the candidate still requires a later `INSCRIBE`.

### `REJECT-CANON <candidate-id>`

In the closed session record only, set the identified candidate to
`review_status: rejected`. This does not change `圣典.md` and creates no accepted
entry.

### `DEFER-CANON <candidate-id>`

In the closed session record only, set the identified candidate to
`review_status: deferred`. This does not change `圣典.md` and creates no accepted
entry.

### `REVISE-CANON <entry-id>: <replacement>`

Create a new pending candidate in the closed session with `revision_of` set to
the identified source entry ID and with the replacement statement. Do not alter
the accepted source entry yet. On a later `INSCRIBE`, copy the candidate's
`revision_of` value into the new accepted entry's `supersedes` field and change
the old accepted entry to `state: superseded`.

### `ARCHIVE-CANON <entry-id>`

Only after Aeris confirms the identified accepted entry, change only that
entry's state to `state: archived`. Preserve the entry and its source; before
Aeris confirms, make no change.

### `KEEP-CANON <entry-id>`

This command changes nothing. It makes no change to closed-session candidate
records or to `圣典.md`.

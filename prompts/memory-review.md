# Memory Review

Aeris reviews every persistent-memory operation. Review candidates by their IDs
from the closed session record.

Every candidate records `revision_of: null | memory-YYYY-MM-DD-NNN`. Normal
candidates use `null`. A candidate created by `REVISE` keeps the source memory
ID in `revision_of` even if Aeris rejects or defers it.

## Candidate commands

```text
ACCEPT <candidate-id>
→ Promote exactly as shown. Retain its epistemic_status, and copy revision_of to supersedes.

EDIT <candidate-id>: <replacement>
→ Replace the pending text for review; do not promote until ACCEPT.

REJECT <candidate-id>
→ Mark rejected in the source session; do not write to memory.

DEFER <candidate-id>
→ Mark deferred in the source session; do not write to memory.
```

## Existing-memory commands

```text
REVISE <memory-id>: <replacement>
→ Create a pending candidate with revision_of set to that memory ID; if accepted, supersedes copies revision_of.

ARCHIVE <memory-id>
→ Set state to archived after Aeris confirms; preserve evidence and Git history.

KEEP <memory-id>
→ Make no change.
```

Anonymous batch acceptance is prohibited. Multiple operations are valid only
when every candidate or memory ID is listed.

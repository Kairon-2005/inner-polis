# Memory Review

Aeris reviews every persistent-memory operation. Review candidates by their IDs
from the closed session record.

## Candidate commands

```text
ACCEPT <candidate-id>
→ Promote exactly as shown.

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
→ Create a pending candidate whose accepted form supersedes the earlier memory.

ARCHIVE <memory-id>
→ Set state to archived after Aeris confirms; preserve evidence and Git history.

KEEP <memory-id>
→ Make no change.
```

Anonymous batch acceptance is prohibited. Multiple operations are valid only
when every candidate or memory ID is listed.

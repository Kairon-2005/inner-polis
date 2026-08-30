# Sacred Canon Review

Use one of these individual operations for every Sacred Canon candidate or
accepted entry:

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
- INSCRIBE copies one identified candidate's exact category and statement into one entry.
- EDIT-CANON edits a pending candidate and still requires a later INSCRIBE.
- REVISE-CANON creates a pending revision candidate; inscription supersedes the old entry.
- ARCHIVE-CANON requires Aeris confirmation and preserves the entry and its source.
- Anonymous batch approval is prohibited; list every candidate or entry ID individually.
- If the active GitHub connection cannot write, GPT must not claim it changed the repository; hand the approved operation to Codex or another repository writer.
- “查考圣典” fetches the complete 圣典.md from Kairon-2005/inner-polis on literal branch main, reports the path and current IDs, and does not recursively load memory/*.

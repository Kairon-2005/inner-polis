# Start Here

## 1. Ask a question

State the question, situation, decision, or tension you want to explore.

## 2. Select figures

Use [`prompts/role-selection.md`](prompts/role-selection.md) to select one or
more canonical figures. The system may recommend figures, but Aeris confirms the
selection.

## 3. Confirm the mode and loaded files

Review the Selection Proposal. Reply `CONFIRM` only when the selected figures,
the resulting mode, and the exact files to load are right. One confirmed figure
uses One-on-One; two to six confirmed figures use Council. Use
[`prompts/session-protocol.md`](prompts/session-protocol.md) for the complete
open, load, dialogue, close, and memory-review lifecycle.

## 4. Conduct the dialogue

After confirmation, use [`prompts/one-on-one.md`](prompts/one-on-one.md) for
One-on-One or [`prompts/council.md`](prompts/council.md) for Council. Only
confirmed figures may speak.

## 5. Close and save the session

End with the session summary, memory candidates, and Aeris's explicit actions or
decisions. Start the record from
[`templates/session.md`](templates/session.md), then save it at the location and
name defined by [`sessions/README.md`](sessions/README.md). Save the session
record without treating interpretations as identity.

## 6. Review memory candidates

Memory is not written until reviewed. Aeris decides which candidates, if any,
become long-term memory. Use
[`prompts/memory-review.md`](prompts/memory-review.md) for candidate review and
existing-memory operations.

## Quick-start prompt

```text
Read PROJECT_CONTEXT.md, constitution/charter.md, prompts/role-selection.md,
prompts/session-protocol.md, templates/session.md, sessions/README.md,
prompts/memory-review.md, and the confirmed character files before responding.
Receive my question, then use prompts/role-selection.md to recommend a selection
and give me a Selection Proposal. The system recommends, but Aeris confirms. Do
not begin any character voice before CONFIRM. Load only the confirmed character
files and the relevant memory and accepted decisions enumerated in the proposal,
then use the resulting One-on-One or Council mode. Save the session at the path
defined by sessions/README.md before review. Memory is not written until Aeris
reviews it with prompts/memory-review.md.
```

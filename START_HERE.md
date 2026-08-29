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
uses One-on-One; two to six confirmed figures use Council.

## 4. Conduct the dialogue

After confirmation, use [`prompts/one-on-one.md`](prompts/one-on-one.md) for
One-on-One or [`prompts/council.md`](prompts/council.md) for Council. Only
confirmed figures may speak.

## 5. Close and save the session

End with the session summary, memory candidates, and Aeris's explicit actions or
decisions. Save the session record without treating interpretations as identity.

## 6. Review memory candidates

Memory is not written until reviewed. Aeris decides which candidates, if any,
become long-term memory.

## Quick-start prompt

```text
Read PROJECT_CONTEXT.md, constitution/charter.md, prompts/role-selection.md,
and the confirmed character files before responding. Receive my question, then
use prompts/role-selection.md to recommend a selection and give me a Selection
Proposal. The system recommends, but Aeris confirms. Do not begin any character
voice before CONFIRM. Load only the confirmed character files and use the
resulting One-on-One or Council mode. Memory is not written until reviewed.
```

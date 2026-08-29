This example is fictional, non-canonical, and contains no claim about Aeris.

# Stage 0 Dry Run

Question: Should the fictional subject begin a ninety-day research project now?
Initial recommendation: Metis
User action: ADD Socrates
Confirmed selection: Metis, Socrates
Derived mode: Council

## 1. Recommendation awaiting confirmation

```text
Selection Proposal
- Recommended figures: Metis
- Reason per figure: Metis is best suited to long-horizon planning, structure, and execution questions.
- Resulting mode: One-on-One
- Files to load: PROJECT_CONTEXT.md, constitution/charter.md, characters/metis.md
- Awaiting confirmation: yes

Reply with one of:
- CONFIRM
- ADD <figure>
- REMOVE <figure>
- REPLACE WITH <comma-separated figures>
- COUNCIL <comma-separated figures>
```

The user does not confirm yet and instead replies:

```text
ADD Socrates
```

## 2. Confirmed second figure converts the mode to Council

```text
Selection Proposal
- Recommended figures: Metis, Socrates
- Reason per figure: Metis is best suited to long-horizon planning, structure, and execution questions.
- Reason per figure: Socrates is best suited to risk review, attention discipline, and boundary-setting.
- Resulting mode: Council
- Files to load: PROJECT_CONTEXT.md, constitution/charter.md, characters/metis.md, characters/socrates.md
- Awaiting confirmation: yes
```

The user confirms the revised selection:

```text
CONFIRM
```

Only the confirmed figures now contribute, and the exact dialogue prompt is
`prompts/council.md`.

## 3. Fictional example output

```text
Council Record

Selected Figures
- Metis
- Socrates

Contributions

Metis
- Start only if the ninety-day project has a written scope, weekly checkpoints, and a concrete deliverable.
- Treat the project as a bounded experiment rather than a vague self-reinvention story.

Socrates
- Do not begin if the commitment is an escape from uncertainty rather than a chosen discipline.
- Add a review rhythm that can catch scope drift before the project becomes identity theater.

Tensions
- Metis wants forward motion quickly once the structure is sound.
- Socrates insists that the commitment must stay explicit, reviewable, and reversible.

Aeris (fictional example output)
- Final interpretation or decision: The fictional subject should begin only after defining scope, weekly checkpoints, and a day-30 review.
- Why? Metis supports the long-horizon structure, and Socrates requires explicit guardrails against drift and self-deception.
- What remains unresolved? The final project scope and the rule for ending the experiment if it stops serving its purpose.
```

## 4. Saved closed session record before memory review

```yaml
---
session_id: session-2026-08-29-001
date: 2026-08-29
status: closed
mode: council
selected_figures:
  - metis
  - socrates
question: "Should the fictional subject begin a ninety-day research project now?"
loaded_files:
  - PROJECT_CONTEXT.md
  - constitution/charter.md
  - characters/metis.md
  - characters/socrates.md
  - prompts/council.md
loaded_memory: []
---
```

### Session Summary

- Metis argued for a bounded research sprint with explicit structure.
- Socrates argued for review gates that prevent the project from becoming a foggy identity claim.
- Aeris chose a conditional yes tied to scope, weekly checkpoints, and a day-30 review.

### Memory Candidates

```yaml
candidate_id: candidate-2026-08-29-001
owner: shared
visibility: council
type: decision
statement: "Aeris decided that the fictional subject may begin the ninety-day research project after defining scope and weekly checkpoints."
epistemic_status: observation
confidence: high
evidence:
  - sessions/2026-08-29/session-2026-08-29-001-fictional-research-project.md
created_at: 2026-08-29
review_status: pending
approved_by_aeris: false
```

```yaml
candidate_id: candidate-2026-08-29-002
owner: socrates
visibility: private
type: observation
statement: "Hypothesis: the fictional subject may overcommit if the weekly review discipline is skipped."
epistemic_status: hypothesis
confidence: medium
evidence:
  - sessions/2026-08-29/session-2026-08-29-001-fictional-research-project.md
created_at: 2026-08-29
review_status: pending
approved_by_aeris: false
```

### Actions / Decisions

- Aeris gave a conditional yes to the fictional ninety-day project.

## 5. Memory review commands

The review begins with an edit, which keeps the candidate pending:

```text
EDIT candidate-2026-08-29-001: Aeris decided that the fictional subject may begin the ninety-day research project only after defining scope, weekly checkpoints, and a day-30 review.
```

```yaml
candidate_id: candidate-2026-08-29-001
owner: shared
visibility: council
type: decision
statement: "Aeris decided that the fictional subject may begin the ninety-day research project only after defining scope, weekly checkpoints, and a day-30 review."
epistemic_status: observation
confidence: high
evidence:
  - sessions/2026-08-29/session-2026-08-29-001-fictional-research-project.md
created_at: 2026-08-29
review_status: pending
approved_by_aeris: false
```

Then Aeris promotes only the explicitly accepted candidate and defers the other:

```text
ACCEPT candidate-2026-08-29-001
DEFER candidate-2026-08-29-002
```

## 6. Resulting review outcomes in the source session

```yaml
candidate_id: candidate-2026-08-29-001
owner: shared
visibility: council
type: decision
statement: "Aeris decided that the fictional subject may begin the ninety-day research project only after defining scope, weekly checkpoints, and a day-30 review."
epistemic_status: observation
confidence: high
evidence:
  - sessions/2026-08-29/session-2026-08-29-001-fictional-research-project.md
created_at: 2026-08-29
review_status: promoted
approved_by_aeris: false
```

```yaml
candidate_id: candidate-2026-08-29-002
owner: socrates
visibility: private
type: observation
statement: "Hypothesis: the fictional subject may overcommit if the weekly review discipline is skipped."
epistemic_status: hypothesis
confidence: medium
evidence:
  - sessions/2026-08-29/session-2026-08-29-001-fictional-research-project.md
created_at: 2026-08-29
review_status: deferred
approved_by_aeris: false
```

`candidate-2026-08-29-002` remains out of current memory because `DEFER` keeps it
in the session record only.

## 7. Resulting accepted-memory record

```yaml
memory_id: memory-2026-08-29-001
source_candidate_id: candidate-2026-08-29-001
owner: shared
visibility: council
type: decision
statement: "Aeris decided that the fictional subject may begin the ninety-day research project only after defining scope, weekly checkpoints, and a day-30 review."
epistemic_status: accepted-decision
confidence: high
evidence:
  - sessions/2026-08-29/session-2026-08-29-001-fictional-research-project.md
created_at: 2026-08-29
updated_at: 2026-08-29
approved_by_aeris: true
supersedes: null
state: current
```

# Memory Schema

## Candidate

```yaml
candidate_id: candidate-YYYY-MM-DD-NNN
owner: shared | aeris | iron-regent | avalokita | metis | socrates | little-prince
visibility: private | council | sovereign
type: belief | emotion | event | decision | observation
statement: "Exact candidate statement"
epistemic_status: observation | hypothesis
confidence: low | medium | high
evidence:
  - sessions/YYYY-MM-DD/session-file.md
created_at: YYYY-MM-DD
review_status: pending | rejected | deferred | promoted
approved_by_aeris: false
```

## Accepted memory

```yaml
memory_id: memory-YYYY-MM-DD-NNN
source_candidate_id: candidate-YYYY-MM-DD-NNN
owner: shared | aeris | iron-regent | avalokita | metis | socrates | little-prince
visibility: private | council | sovereign
type: belief | emotion | event | decision | observation
statement: "Exact Aeris-approved statement"
epistemic_status: observation | hypothesis | accepted-decision
confidence: low | medium | high
evidence:
  - sessions/YYYY-MM-DD/session-file.md
created_at: YYYY-MM-DD
updated_at: YYYY-MM-DD
approved_by_aeris: true
supersedes: null | memory-YYYY-MM-DD-NNN
state: current | superseded | archived
```

# Sacred Canon Schema

## Accepted entry

```yaml
entry_id: canon-YYYY-MM-DD-NNN
source_candidate_id: canon-candidate-YYYY-MM-DD-NNN
category: principle | lesson | core-value | essential-memory
statement: "Exact Aeris-approved statement"
source:
  - sessions/YYYY-MM-DD/session-file.md
approved_by_aeris: true
approved_at: YYYY-MM-DD
supersedes: null | canon-YYYY-MM-DD-NNN
state: current | superseded | archived
```

## Candidate

```yaml
candidate_id: canon-candidate-YYYY-MM-DD-NNN
revision_of: null | canon-YYYY-MM-DD-NNN
category: principle | lesson | core-value | essential-memory
statement: "Candidate statement"
source:
  - sessions/YYYY-MM-DD/session-file.md
created_at: YYYY-MM-DD
review_status: pending | rejected | deferred | promoted
approved_by_aeris: false
```

- Accepted `statement` text is copied exactly from Aeris's approval.
- `source` must contain at least one non-empty repository-relative path.
- `entry_id` and `source_candidate_id` must each be unique within `圣典.md`.
- Accepted entries require the literal value `approved_by_aeris: true`.
- `superseded` and `archived` entries remain preserved but are not shown in the default website reading layer.

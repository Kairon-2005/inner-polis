# Task 4 Report — End-to-end dry run and entry-point integration

Date: 2026-08-29
Repo: `/Users/kairon/Documents/Codex/inner-polis`
Base commit: `b5c4787`
Task 4 commit: `e29f62a`

## Status

Complete.

## Scope

Implemented the Stage 0 fictional dry run, added operational navigation links
from both repository entry points, validated Markdown links and dry-run content,
committed the task, and self-reviewed the resulting diff.

## Implemented changes

- Added `examples/stage-0-dry-run.md` as an explicitly fictional,
  non-canonical, non-personal worked example.
- The example follows the existing routing/session/memory contracts:
  recommendation awaiting confirmation, `ADD Socrates`, confirmed `Metis,
  Socrates`, derived Council mode, only Metis and Socrates contributing, Aeris
  synthesis labeled as fictional example output, two fictional memory
  candidates, `EDIT`, `ACCEPT`, `DEFER`, and one resulting accepted-memory
  record using every required schema field.
- Updated `README.md` with an `Operational References` section linking to
  `START_HERE.md`, the approved spec, the implementation plan, and the fictional
  dry run.
- Updated `PROJECT_CONTEXT.md` with a minimal `操作导航` section linking to the
  same four operational references.

## Validation evidence

### 1. Pre-implementation RED check

Command:

```bash
test -f examples/stage-0-dry-run.md && \
rg -q 'START_HERE.md' PROJECT_CONTEXT.md
```

Output:

```text
(none)
```

Exit: `1`

Meaning: the example file did not yet exist and `PROJECT_CONTEXT.md` did not yet
link to `START_HERE.md`, exactly as the brief expected.

### 2. Markdown link validation

Command:

```bash
ruby -e 'broken=[]; Dir["**/*.md"].each{|f| File.read(f).scan(/\[[^\]]*\]\(([^)]+)\)/).flatten.each{|l| next if l =~ /\A(?:https?:|mailto:|#)/; p=l.split("#",2).first; t=File.expand_path(p,File.dirname(f)); broken << "#{f}: #{l}" unless File.exist?(t)}}; abort("Broken links:\n#{broken.join("\n")}") unless broken.empty?; puts "Markdown links: valid"'
```

Output:

```text
Markdown links: valid
```

Exit: `0`

### 3. Dry-run content checks

Command:

```bash
rg -q 'fictional, non-canonical' examples/stage-0-dry-run.md
rg -q 'Metis, Socrates' examples/stage-0-dry-run.md
rg -q 'mode: council' examples/stage-0-dry-run.md
rg -q 'review_status: deferred' examples/stage-0-dry-run.md
rg -q 'approved_by_aeris: true' examples/stage-0-dry-run.md
```

Output:

```text
(none)
```

Exit: `0`

### 4. Canon preservation

Command:

```bash
git diff --name-only HEAD^ HEAD -- characters constitution
```

Output:

```text
(none)
```

Exit: `0`

Meaning: no files under `characters/` or `constitution/` changed in Task 4.

### 5. Whitespace check

Command:

```bash
git diff --check HEAD^ HEAD
```

Output:

```text
(none)
```

Exit: `0`

### 6. Committed file scope

Command:

```bash
git diff --name-status HEAD^ HEAD
```

Output:

```text
M	PROJECT_CONTEXT.md
M	README.md
A	examples/stage-0-dry-run.md
```

Exit: `0`

Meaning: the commit touched only the three files required by the brief.

### 7. Post-commit worktree state

Command:

```bash
git status --short
```

Output:

```text
(none)
```

Exit: `0`

Meaning: the worktree was clean after the commit.

## Self-review

The new example stays explicitly fictional and non-canonical, never makes a
personal claim about Aeris, and demonstrates the exact Stage 0 operating flow:
confirmation-gated selection, Council conversion after the second confirmed
figure, figure-limited contributions, review-gated memory promotion, and a
fully populated accepted-memory record. The entry-point changes are limited to
operational navigation and do not rewrite project goals, role theory, symbols,
or website scope.

## Concerns

None.

## Fix report — review issue on accepted-memory statement

Date: 2026-08-29
Review target: `examples/stage-0-dry-run.md`

### Issue

The accepted-memory `statement` did not match the edited candidate exactly.
The edited candidate used:

```text
"Aeris decided that the fictional subject may begin the ninety-day research project only after defining scope, weekly checkpoints, and a day-30 review."
```

But the accepted-memory record rewrote that to:

```text
"Aeris approved this fictional Stage 0 example decision: the fictional subject may begin the ninety-day research project only after defining scope, weekly checkpoints, and a day-30 review."
```

That conflicted with `prompts/memory-review.md`, where `ACCEPT` means
"Promote exactly as shown."

### Fix

Updated only the accepted-memory `statement` so it now matches the edited
candidate exactly. Acceptance remains represented by the accepted-memory schema
metadata, including `source_candidate_id`, `epistemic_status:
accepted-decision`, `approved_by_aeris: true`, and `state: current`.

### Fix validation evidence

#### 1. Focused equality check

Command:

```bash
ruby -e 'text=File.read("examples/stage-0-dry-run.md"); candidate=text[/## 5\\. Memory review commands.*?statement: "([^"]+)"/m,1]; accepted=text[/## 7\\. Resulting accepted-memory record.*?statement: "([^"]+)"/m,1]; abort("statement mismatch") unless candidate == accepted; puts "statement-equality: ok"'
```

Output:

```text
statement-equality: ok
```

Exit: `0`

#### 2. Re-run Task 4 content checks

Command:

```bash
rg -q 'fictional, non-canonical' examples/stage-0-dry-run.md
rg -q 'Metis, Socrates' examples/stage-0-dry-run.md
rg -q 'mode: council' examples/stage-0-dry-run.md
rg -q 'review_status: deferred' examples/stage-0-dry-run.md
rg -q 'approved_by_aeris: true' examples/stage-0-dry-run.md
```

Output:

```text
(none)
```

Exit: `0`

#### 3. Re-run Markdown link validation

Command:

```bash
ruby -e 'broken=[]; Dir["**/*.md"].each{|f| File.read(f).scan(/\[[^\]]*\]\(([^)]+)\)/).flatten.each{|l| next if l =~ /\A(?:https?:|mailto:|#)/; p=l.split("#",2).first; t=File.expand_path(p,File.dirname(f)); broken << "#{f}: #{l}" unless File.exist?(t)}}; abort("Broken links:\n#{broken.join("\n")}") unless broken.empty?; puts "Markdown links: valid"'
```

Output:

```text
Markdown links: valid
```

Exit: `0`

#### 4. Re-run canon-preservation and whitespace checks

Commands:

```bash
git diff --name-only HEAD^ HEAD -- characters constitution
git diff --check HEAD^ HEAD
```

Interim pre-commit output:

```text
(none)
```

Interim pre-commit exit: `0`

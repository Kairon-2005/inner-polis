# Sacred Canon Design

**Status:** Approved design awaiting implementation planning  
**Date:** 2026-08-30  
**Authority:** Aeris

## Purpose

Add a distinct Sacred Canon (`圣典`) to Inner Polis for the highest-level
principles, lessons, core values, and essential memories. The Sacred Canon is
primarily for durable recording and deliberate consultation. It is not ordinary
character memory and is not automatically injected into formal dialogue.

This change also adds the following Aeris-approved character statements without
rewriting their established canon:

- Socrates: `集所有哲学家智慧大成者，特别是欧陆哲学。`
- Avalokita: `精通佛、道、王阳明心学。`
- The Iron Regent: `永不言弃，绝不动摇，超人意志。任何条件下最冷静的人。`

## Scope

The feature includes:

- a root-level `圣典.md` source of truth;
- a separate Sacred Canon candidate and Aeris approval protocol;
- explicit ChatGPT Project consultation behavior;
- a build-time loader and read-only website dialog;
- an independent Sacred Canon entrance in the temple;
- exact additions to the three approved character files;
- decision, workflow, schema, content, accessibility, and regression tests.

The feature does not include:

- a backend, database, LLM API, or browser persistence;
- website editing or approval controls;
- automatic Sacred Canon loading in ordinary One-on-One or Council sessions;
- automatic loading of separate `memory/*` files when the Sacred Canon is
  consulted;
- promotion of ordinary memory without Aeris's explicit Sacred Canon approval;
- any new interpretation of Aeris or changes to Aeris's authority.

## Architecture Decision

Use one independent root file:

```text
圣典.md
```

This file is separate from `memory/shared/current.md` and all figure-owned
memory stores. It does not have an owner figure. Its entries are global records
approved by Aeris.

Alternatives rejected:

1. Adding a `sacred: true` flag to shared memory would mix two different levels
   of persistence and weaken the Sacred Canon's distinct approval boundary.
2. Splitting principles, lessons, values, and essential memories into four
   files would add loading and review complexity without a current need.

## Accepted Entry Schema

`圣典.md` contains a short introduction and zero or more fenced YAML blocks.
Every YAML block in the file is an accepted Sacred Canon entry and must match
this schema:

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

Rules:

- `statement` is preserved exactly as approved by Aeris.
- `source` contains at least one repository-relative source path.
- `entry_id` and `source_candidate_id` are non-empty and unique within the
  file.
- the website displays only entries with `approved_by_aeris: true` and
  `state: current`;
- every fenced YAML block is validated; an unapproved or malformed block fails
  the production build rather than being silently accepted;
- superseded and archived entries remain in `圣典.md` and Git history but are
  not shown in the default website reading layer;
- the initial file contains no invented example entry and renders an explicit
  empty state.

## Candidate and Approval Protocol

Sacred Canon candidates are recorded in a closed session, not in `圣典.md`:

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

The session must be saved and closed before a Sacred Canon operation changes
`圣典.md`. GPT or any figure may propose a candidate, but only Aeris may approve
one for inscription.

Commands:

```text
INSCRIBE <candidate-id>
EDIT-CANON <candidate-id>: <replacement>
REJECT-CANON <candidate-id>
DEFER-CANON <candidate-id>

REVISE-CANON <entry-id>: <replacement>
ARCHIVE-CANON <entry-id>
KEEP-CANON <entry-id>
```

Command behavior:

- `INSCRIBE` changes the candidate to `promoted` and creates exactly one
  accepted entry with the same category and exact statement.
- `EDIT-CANON` changes pending candidate text only; it still requires a later
  `INSCRIBE`.
- `REJECT-CANON` and `DEFER-CANON` update only the closed session record and do
  not write to `圣典.md`.
- `REVISE-CANON` creates a pending candidate with `revision_of` set to the
  source entry. Acceptance copies that value into `supersedes` and changes the
  old entry's state to `superseded`.
- `ARCHIVE-CANON` changes an accepted entry's state to `archived` only after
  Aeris confirms it. The entry and its source remain preserved.
- `KEEP-CANON` makes no change.
- anonymous batch approval is prohibited; each candidate or entry ID must be
  listed individually.
- a natural-language request such as “把这句话写入圣典” creates and displays a
  candidate; it does not bypass explicit Aeris approval.
- if the active ChatGPT GitHub connection cannot write, GPT must not claim that
  it changed the repository. It must hand the approved operation to Codex or
  another repository writer.

## Deliberate Consultation Behavior

The Sacred Canon is not part of the default `OPEN → LOAD → DIALOGUE` sequence.

When Aeris explicitly asks to `查考圣典`:

1. fetch `圣典.md` from the literal `main` branch of
   `Kairon-2005/inner-polis`;
2. report that the exact path was loaded and list the current entry IDs;
3. inject the complete fetched file into the current conversation context;
4. use the relevant entries in the answer without rewriting their statements;
5. do not recursively load `memory/*` merely because the Sacred Canon was
   consulted.

The whole file is loaded rather than a GPT-selected subset. This prevents GPT
from silently deciding that a highest-level principle or essential memory is
irrelevant. The file remains in the context of the current conversation after
loading but is not treated as automatically loaded in another conversation.

## Website Experience

The temple receives one independent Sacred Canon entrance. It is visually and
semantically distinct from every throne and from Council, using the established
black, white, and restrained-gold system. It may use a sacred book or lectern
motif, but it must remain an HTML/CSS element and does not require a generated
image.

Activating the entrance opens a read-only dialog that:

- is labelled `圣典`;
- displays each current entry's category, exact statement, entry ID, approval
  date, and source;
- displays `圣典尚无条目` when there are no current entries;
- has no edit, approve, archive, or ChatGPT state-transfer controls;
- supports keyboard activation, Escape/close behavior, focus containment, and
  focus restoration through the existing dialog controller;
- remains scrollable and viewport-safe on desktop and mobile.

The website reads `圣典.md` at build time. It does not write to the repository
and does not simulate an approval operation.

## Character Additions

The approved additions are inserted without removing or paraphrasing existing
text:

- Socrates receives the exact sentence
  `集所有哲学家智慧大成者，特别是欧陆哲学。` in its operational profile and
  gains no invented list of philosophers or philosophical positions.
- Avalokita receives the exact sentence `精通佛、道、王阳明心学。` in its
  operational profile and theory sources, without claiming additional schools
  not named by Aeris.
- The Iron Regent receives the exact sentence
  `永不言弃，绝不动摇，超人意志。任何条件下最冷静的人。` in its operational
  profile. Its existing boundary remains unchanged: it enforces commitments but
  does not determine ultimate goals.

These character changes are canon, not memory. They do not modify Aeris.

## Repository Changes

Implementation is expected to create or modify these responsibility groups:

- Canon source and protocol:
  - create `圣典.md`;
  - create `schemas/sacred-canon-schema.md`;
  - create `prompts/sacred-canon-review.md`;
  - modify `prompts/session-protocol.md`;
  - modify `prompts/chatgpt-project-instructions.md`;
  - modify `START_HERE.md`;
  - modify `templates/session.md` and related session documentation;
- Canon decisions and characters:
  - modify `decisions/design-decisions.md`;
  - modify `characters/socrates.md`;
  - modify `characters/avalokita.md`;
  - modify `characters/iron-regent.md`;
- Website:
  - add a focused Sacred Canon content type and loader;
  - add a Sacred Canon entrance and read-only dialog;
  - extend existing temple/dialog styles only as needed;
  - load the Sacred Canon in the static page build.

No ordinary memory store or accepted-memory schema is repurposed.

## Validation and Failure Behavior

The Sacred Canon loader must reject:

- malformed YAML;
- missing or empty required strings;
- unsupported categories or states;
- `approved_by_aeris` values other than literal `true`;
- duplicate `entry_id` or `source_candidate_id` values;
- empty or non-string `source` items;
- `supersedes` values that are neither `null` nor a non-empty string.

Build failure messages identify `圣典.md` and the failed field without exposing
unrelated repository content. Empty `圣典.md` is valid and produces an empty
array for the website.

## Testing

Implementation must use test-first development and cover:

- valid current, superseded, and archived entries;
- empty Sacred Canon state;
- every validation failure listed above;
- website rendering of approved current entries only;
- independent temple entrance, read-only dialog, keyboard behavior, focus
  restoration, scrolling, mobile viewport safety, and accessibility;
- explicit `查考圣典` loading instructions and the absence of default loading;
- exact presence of all three approved character statements;
- exact preservation of Aeris authority and The Iron Regent's ultimate-goal
  boundary;
- all existing memory, character, Council, desktop, short-desktop, mobile,
  deployment, and accessibility regressions;
- deterministic static production build and GitHub Pages workflow.

## Acceptance Criteria

The design is implemented when:

1. `圣典.md` exists as an initially empty, separately governed source of truth.
2. Only individually Aeris-approved entries can be inscribed.
3. ordinary dialogue does not automatically load the file.
4. an explicit `查考圣典` request loads the complete file from `main` into the
   current context and reports the loaded path and current entry IDs.
5. the temple exposes a separate, accessible, read-only Sacred Canon entrance.
6. the three approved character statements appear exactly in their canonical
   character files.
7. no backend, API, or browser persistence is introduced.
8. the complete test and production-build suite passes without regressions.

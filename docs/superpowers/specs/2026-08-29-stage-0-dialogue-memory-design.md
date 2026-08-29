# Stage 0 Dialogue and Memory Mechanism Design

**Date:** 2026-08-29
**Status:** Approved direction; implementation pending
**Scope:** Text-only Stage 0 mechanism

## 1. Objective

Complete the Markdown-based operating mechanism for:

1. selecting one or more characters;
2. entering one-on-one or Council dialogue;
3. closing a session in a stable format;
4. proposing memory candidates;
5. selectively accepting, editing, rejecting, or deferring candidates;
6. revising or archiving existing memory without silent replacement.

This design adds procedure only. It does not reinterpret character canon or add
new philosophical content.

## 2. Scope boundary

This phase does not create:

- Astro or another web framework;
- GitHub Pages configuration;
- website code, visual assets, character images, animation, or video;
- LLM API integration;
- a database or vector store;
- automatic or autonomous memory writing.

Stage 1 visualization remains deferred.

## 3. Canonical invariants

The mechanism must preserve these existing rules:

- GitHub is the source of truth.
- Established canon is not silently overwritten.
- Aeris's original expressions and Aeris's own interpretations of them are
  preserved as written.
- No agent may paraphrase, soften, strengthen, translate, relabel, reinterpret,
  or otherwise modify those expressions unless Aeris explicitly requests it.
- Characters may form hypotheses, but hypotheses are not facts.
- No interpretation becomes identity without Aeris's consent.
- Aeris retains final interpretive authority.
- Aeris leads the review of canon and persistent memory changes. No such change
  is accepted without Aeris's explicit approval.
- Character definitions, memory, and session records remain separate.

## 4. Character selection

### 4.1 Selectable set

The user may select any subset of the six canonical figures:

- Aeris;
- The Iron Regent;
- Avalokita;
- Metis;
- Socrates;
- The Little Prince.

The selected set must contain between one and six figures.

### 4.2 Mode rule

```text
1 selected figure     → One-on-One
2–6 selected figures  → Council
```

Zero selections is invalid. The system asks the user to select at least one
figure or accept a recommendation.

### 4.3 Recommendation and confirmation

If the user does not name figures, the system may recommend one or more based on
the question. The recommendation must include:

- recommended figure or figures;
- one short reason for each recommendation;
- resulting mode;
- files that will be loaded.

The system does not begin character dialogue until the user confirms or edits the
selection. The user may add characters, remove characters, replace the entire
selection, or explicitly request Council.

### 4.4 Routing guide

This guide restates existing character responsibilities; it does not extend them.

| Figure | Recommend when the question primarily concerns |
| --- | --- |
| Aeris | choosing, integrating, or assuming the final decision |
| The Iron Regent | discipline, commitment, endurance, execution |
| Avalokita | emotion, awareness, containment, openness, relationships |
| Metis | intuition, strategy, execution, long-termism, resources, political maneuvering |
| Socrates | self-reflection, self-criticism, attention, boundaries, motive, evidence |
| The Little Prince | curiosity, aesthetics, vitality, experience, innocence |

### 4.5 No silent switching

- A selected figure may recommend involving another figure.
- The new figure does not join until the user confirms.
- Adding a second figure converts a one-on-one session into Council.
- Removing figures may convert Council back to one-on-one only after user
  confirmation.
- Unselected figures do not speak as if they had been selected.

## 5. Session lifecycle

### 5.1 Open

The session begins with:

- session ID;
- date;
- question or topic;
- selected figures;
- mode derived from selection count;
- files loaded;
- relevant memory loaded.

### 5.2 Dialogue

In one-on-one mode, only the selected figure speaks from its character file.

In Council mode:

- only selected advisory figures contribute;
- each contribution remains visibly attributed;
- tensions and disagreements remain visible;
- Aeris retains final interpretation and decision under the charter;
- if Aeris was selected, Aeris appears in the synthesis rather than being
  duplicated as a separate advisory voice.

### 5.3 Close

Every completed session ends with:

```text
Session Summary
- What happened?
- What was discovered?
- What remains unresolved?

Memory Candidates
- Zero or more candidates; no automatic promotion.

Actions / Decisions
- Anything Aeris explicitly decided.
```

The session record is saved before any candidate is promoted to long-term memory.

## 6. Memory lifecycle

### 6.1 Candidate creation

Each candidate receives:

- candidate ID;
- owner;
- visibility;
- type;
- statement;
- status as observation or hypothesis;
- confidence;
- evidence linking to the source session;
- creation date;
- approval state.

No candidate is accepted merely because a model generated it.

### 6.2 Candidate review actions

The user reviews candidates individually:

| Command | Result |
| --- | --- |
| `ACCEPT <candidate-id>` | Promote the candidate exactly as shown. |
| `EDIT <candidate-id>: <replacement>` | Replace the candidate text for review; it remains pending until accepted. |
| `REJECT <candidate-id>` | Do not promote it; preserve the rejection in the session record. |
| `DEFER <candidate-id>` | Leave it unresolved in the session record for later review. |

Batch commands are allowed only when every candidate ID is named explicitly.
“Accept all” is not used.

### 6.3 Accepted memory

On acceptance:

- assign a stable memory ID;
- retain the source session and original candidate ID;
- retain owner, visibility, type, status, confidence, and evidence;
- set `approved_by_aeris: true`;
- write it only to the matching role memory or shared memory;
- do not modify the character file or constitution.

### 6.4 Existing memory changes

Existing memories use explicit operations:

| Operation | Result |
| --- | --- |
| `REVISE <memory-id>` | Create a proposed replacement linked to the earlier entry. The replacement requires acceptance. |
| `ARCHIVE <memory-id>` | Remove it from current context while retaining its record and Git history. |
| `KEEP <memory-id>` | Leave the memory unchanged after review. |

Revision does not silently overwrite the earlier statement. The new entry names
the memory it supersedes. Archival does not rewrite the source session.

## 7. Memory loading

A session loads:

1. the constitution;
2. the selected character files;
3. shared memory relevant to the current question;
4. relevant memory owned by the selected figures;
5. relevant accepted decisions.

Deferred, rejected, superseded, and archived memory is not loaded by default.
Private memory is not silently exposed to another figure. The system lists the
memory files it proposes to load before dialogue begins.

## 8. Required repository artifacts

Implementation should create or update the following text artifacts:

- `START_HERE.md` — user-facing entry and shortest complete workflow;
- `prompts/role-selection.md` — recommendation, selection, and confirmation;
- `prompts/session-protocol.md` — open, dialogue, close, and handoff rules;
- `prompts/memory-review.md` — candidate and existing-memory commands;
- `prompts/council.md` — selected-member Council behavior;
- `prompts/one-on-one.md` — single-selection behavior;
- `prompts/memory-protocol.md` — align schema and lifecycle;
- `schemas/session-schema.md` — required session fields;
- `schemas/memory-schema.md` — candidate and accepted-memory fields;
- `templates/session.md` — copyable session record;
- `sessions/README.md` — naming and storage rules;
- `memory/aeris/current.md`;
- `memory/iron-regent/current.md`;
- `memory/avalokita/current.md`;
- `memory/metis/current.md`;
- `memory/socrates/current.md`;
- `memory/little-prince/current.md`;
- `memory/shared/current.md`;
- `memory/README.md` — loading, promotion, revision, and archival rules;
- `examples/stage-0-dry-run.md` — fictional, non-personal example covering
  routing, Council conversion, candidate review, and selective promotion;
- existing entry points and decision records where links or accepted decisions
  need updating.

The implementation should modify existing protocol files instead of introducing
conflicting duplicate rules.

## 9. Validation

Verification must demonstrate:

1. one selected figure resolves to one-on-one;
2. every selection of two through six figures resolves to Council;
3. an unconfirmed recommendation cannot begin dialogue;
4. an unselected figure cannot speak without user confirmation;
5. all session templates include the three closing outputs;
6. no memory candidate is written as accepted by default;
7. `EDIT` remains pending until `ACCEPT`;
8. rejected and deferred candidates are not loaded as memory;
9. revision preserves the superseded memory reference;
10. every referenced Markdown file and relative link exists;
11. no website framework, visual implementation, or Pages workflow is added;
12. no Aeris-authored expression or interpretation is modified without Aeris's
    explicit review and approval.

## 10. Completion condition

Another ChatGPT or Codex session can start from `START_HERE.md`, recommend and
confirm a selection, run either dialogue mode, close a session, present memory
candidates, apply selective review commands, and identify the exact Markdown
changes to make—without inventing a new role, changing canon, or automatically
promoting memory.

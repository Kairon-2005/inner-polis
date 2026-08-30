# Task 6 report: Council and GitHub-powered ChatGPT handoff

## Status

Implemented and verified.

## Changes

- Added a shared ChatGPT handoff component to every figure dialog and the new Council dialog.
- Labeled the destination as a handoff and stated plainly that the website does not transmit any figure or Council selection; the destination is an explicit `https://chatgpt.com/` link.
- Added a native Council `dialog` that explains the two-to-six confirmed-figure mode without checkboxes, radio buttons, figure pickers, chat simulation, or any other local selection flow.
- Generalized the existing native-dialog controller from throne-only wiring to explicit trigger/dialog IDs while preserving modal opening, native Escape behavior, close buttons, body scroll locking, cleanup, and focus restoration to the activating control.
- Added one-time ChatGPT Project Instructions requiring the connected GitHub plugin to read `Kairon-2005/inner-polis` on literal branch `main`, fetch `START_HERE.md`, ask the user's question, propose and confirm `1..n figures`, and load only the confirmed character, required prompt, allowed current-memory, and relevant accepted-decision material.
- Kept Aeris's final interpretive and memory-review authority explicit and prohibited invented accepted memory.
- Added focused content and browser coverage for the repository/branch protocol, Council's zero-selection-controls contract, both handoff entry paths, and Council focus restoration.

## TDD evidence

1. Created `site/tests/content/project-instructions.test.ts` and `site/tests/e2e/handoff.spec.ts` before production changes.
2. Ran the focused instructions test and observed both tests fail with the expected missing `prompts/chatgpt-project-instructions.md` error.
3. Built the unchanged production surface successfully, then ran the focused handoff browser tests and observed failures on the missing Council and figure handoff behavior.
4. Implemented the shared handoff, Council dialog, generic dialog wiring, styles, and Project Instructions.
5. Re-ran the focused instructions tests: 2 tests passed.
6. Rebuilt successfully and re-ran the focused handoff suite: 3 tests passed.

## Verification

- `npm test -- --run tests/content/project-instructions.test.ts` — 1 file, 2 tests passed.
- `npm run build` — Astro check reported 0 errors, 0 warnings, and 0 hints; static prerender completed.
- `npm run test:e2e -- handoff.spec.ts` — 3 tests passed.
- `npm test -- --run` — 6 files, 17 tests passed.
- `npm run test:e2e` — 13 tests passed, including all six figure-dialog mappings and existing entrance coverage.
- `git diff --check` — passed with no whitespace errors.

## Self-review

- Confirmed both Council and figure dialogs contain the same explicit ChatGPT handoff disclosure and link.
- Confirmed the Council dialog contains no checkbox, radio, figure picker, form, browser persistence, backend call, or simulated conversation.
- Confirmed the site does not claim to carry the inspected figure or Council state into ChatGPT.
- Confirmed native dialogs retain Escape/close behavior, body scroll unlocking, and focus restoration; new instance-specific heading IDs avoid duplicate accessible references.
- Confirmed the Project Instructions require a fresh live-repository read from `main`, explicit user question and selection confirmation, restricted post-confirmation loading, Aeris review authority, and no invented accepted memory.
- Confirmed no files under `characters/`, `constitution/`, `decisions/`, or `memory/` changed, and no canonical prose was added to the site.
- Confirmed no backend, API, persistence, authentication, or repository-write behavior was added.

## Concern

Playwright emits the existing environment-level `NO_COLOR`/`FORCE_COLOR` warning; all browser tests pass and the warning is unrelated to site code.

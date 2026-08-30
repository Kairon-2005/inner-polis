# Task 5 report: canonical figure reading layers

## Status

Implemented and verified.

## Changes

- Added one native, accessible `dialog` reading layer for each of the six figures.
- Loaded character Markdown and current accepted-memory records at build time through `loadCharacter` and `loadCurrentMemory`; the dialog component contains no copied or paraphrased character prose.
- Rendered the trusted character HTML, canonical loader-derived heading, figure portrait, accepted-memory section, and explicit `尚无已接受记忆` state for empty stores.
- Added a dialog controller that maps each throne to only its corresponding dialog, opens it with `showModal`, handles the close button and native Escape behavior, restores focus to the activating throne, locks body scrolling only while open, and returns a cleanup function.
- Added responsive dialog styling using the established temple palette and typography tokens.
- Added browser coverage for the Aeris canonical-content contract, empty-memory state, Escape close path, focus restoration, computed scroll lock, explicit close path, and all six throne-to-dialog mappings.
- Corrected repository path resolution to remain stable after Astro bundles loaders for prerendering. The previous `import.meta.url` anchor moved into `dist/.prerender/chunks` and incorrectly resolved canonical files under `site/`; project scripts now anchor from their stable `site/` working directory.

## TDD evidence

1. Created `site/tests/e2e/figure-dialog.spec.ts` before the dialog implementation.
2. Ran the required build and focused browser test. The build passed, and all seven tests failed at the expected missing-dialog assertion.
3. Implemented the dialogs, loader wiring, controller, and styling.
4. The first green build exposed the prerender path defect with `ENOENT` for `site/characters/aeris.md`. The failing production build served as the regression check; after the single path-root correction, the build and focused suite passed.

## Verification

- `npm run test:e2e -- figure-dialog.spec.ts` — 7 tests passed.
- `npm test -- --run` — 4 files, 13 tests passed.
- `npm run build` — Astro check reported 0 errors, 0 warnings, and 0 hints; static prerender completed.
- `npm run test:e2e` — 8 tests passed, including the existing entrance test.
- `git diff --check` — passed with no whitespace errors.

## Self-review

- Confirmed each throne opens exactly one dialog with the expected accessible name.
- Confirmed explicit close and Escape both hide the dialog, restore throne focus, and remove computed body scroll lock.
- Confirmed the character body is rendered only from `CharacterContent.html` and memory articles only from the `AcceptedMemory[]` supplied by `loadCurrentMemory`.
- Confirmed the controller exports `initDialogController(document): cleanup function` and does not attach behavior to the Council threshold.
- Confirmed no Task 6 dialogue handoff was added.
- Confirmed no files under `characters/`, `constitution/`, or `memory/` changed.

## Concern

Playwright emits the existing environment-level `NO_COLOR`/`FORCE_COLOR` warning; all browser tests pass and the warning is unrelated to site code.

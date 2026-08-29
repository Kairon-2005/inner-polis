# Stage 1 Central Temple Entrance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (```- [ ]``` syntax for tracking.

**Goal:** Build and publish a one-route Astro entrance for Inner Polis with six canonical thrones, in-page figure reading, Council handoff, and live-repository dialogue instructions for ChatGPT.

**Architecture:** A self-contained site/ Astro project reads canonical Markdown from the repository root at build time through typed loaders. Static Astro components render the temple, while a small browser controller manages dialogs and focus. User portraits are preserved as originals and transformed into committed, full-frame web derivatives; GitHub Actions deploys the static output under /inner-polis/.

**Tech Stack:** Astro, TypeScript, Vitest, marked, yaml, sharp, Playwright, axe-core, GitHub Pages

**Spec:** docs/superpowers/specs/2026-08-30-stage-1-temple-entrance-design.md

## Global Constraints

- Repository Markdown remains the sole canonical source.
- Do not modify files under characters/ or constitution/.
- Do not paraphrase, reinterpret, weaken, expand, or silently change established character expression.
- Aeris retains final interpretive authority and leads persistent-memory review.
- Formal role selection occurs inside ChatGPT, not on the website.
- The website has no LLM API, backend, authentication, or persistent browser state.
- The first phase has one entrance route and no separate character routes.
- Six user-provided originals remain unchanged and retain their complete frames and existing image marks.
- Empty accepted-memory stores render 尚无已接受记忆.
- GitHub Pages paths work under /inner-polis/.
- Do not add or commit .DS_Store.

---

### Task 1: Scaffold the isolated Astro site and test harness

**Files:**
- Create: site/package.json
- Create: site/package-lock.json
- Create: site/astro.config.mjs
- Create: site/tsconfig.json
- Create: site/vitest.config.ts
- Create: site/playwright.config.ts
- Create: site/src/env.d.ts
- Create: site/src/pages/index.astro
- Create: site/src/styles/global.css
- Create: site/tests/config.test.ts
- Create: site/tests/e2e/entrance.spec.ts
- Modify: .gitignore

**Interfaces:**
- Produces: an Astro static build with site=https://kairon-2005.github.io and base=/inner-polis
- Produces: npm scripts dev, build, test, test:e2e, check
- Produces: a Playwright webServer that previews site/dist

- [ ] **Step 1: Add the failing configuration test**

```ts
import { describe, expect, it } from "vitest";
import config from "../astro.config.mjs";

describe("Astro GitHub Pages configuration", () => {
  it("builds the project site under /inner-polis", () => {
    expect(config.site).toBe("https://kairon-2005.github.io");
    expect(config.base).toBe("/inner-polis");
    expect(config.output).toBe("static");
  });
});
```

- [ ] **Step 2: Scaffold site/, install exact dependencies, and confirm the test initially fails**

Run from site/:

```bash
npm install astro marked yaml
npm install --save-dev vitest typescript @playwright/test @axe-core/playwright sharp
npx playwright install chromium
npm test -- --run tests/config.test.ts
```

Expected: FAIL until astro.config.mjs exports the required values.

- [ ] **Step 3: Implement the minimal Astro configuration**

```js
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://kairon-2005.github.io",
  base: "/inner-polis",
  output: "static",
});
```

Add scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "test": "vitest",
    "test:e2e": "playwright test",
    "check": "npm run test -- --run && npm run build"
  }
}
```

Add .DS_Store and site test/build artifacts to .gitignore without removing any
existing ignore rules.

- [ ] **Step 4: Run configuration tests and the minimal build**

```bash
npm test -- --run tests/config.test.ts
npm run build
```

Expected: PASS and a static site/dist/index.html.

- [ ] **Step 5: Commit**

```bash
git add .gitignore site
git commit -m "Scaffold Astro temple site"
```

---

### Task 2: Build the canonical content contract

**Files:**
- Create: site/src/data/figures.ts
- Create: site/src/lib/repository-paths.ts
- Create: site/src/lib/character-content.ts
- Create: site/src/lib/memory-content.ts
- Create: site/src/types/content.ts
- Create: site/tests/content/figures.test.ts
- Create: site/tests/content/memory.test.ts

**Interfaces:**
- Produces: FIGURES: readonly FigureDefinition[]
- Produces: loadCharacter(figure): Promise<CharacterContent>
- Produces: loadCurrentMemory(figure): Promise<AcceptedMemory[]>
- CharacterContent: { slug, canonicalName, html, sourcePath }
- AcceptedMemory includes only approved_by_aeris=true and state=current

- [ ] **Step 1: Write failing registry and character-loader tests**

```ts
import { describe, expect, it } from "vitest";
import { FIGURES } from "../../src/data/figures";
import { loadCharacter } from "../../src/lib/character-content";

describe("canonical figures", () => {
  it("maps exactly six slugs to repository Markdown", () => {
    expect(FIGURES.map((figure) => figure.slug)).toEqual([
      "aeris",
      "iron-regent",
      "avalokita",
      "metis",
      "socrates",
      "little-prince",
    ]);
    expect(new Set(FIGURES.map((figure) => figure.characterPath)).size).toBe(6);
  });

  it("loads Aeris without rewriting the source", async () => {
    const aeris = FIGURES[0];
    const loaded = await loadCharacter(aeris);
    expect(loaded.canonicalName).toBe("Aeris — The Sovereign Self");
    expect(loaded.html).toContain("Aeris retains final interpretive authority.");
    expect(loaded.sourcePath).toBe("characters/aeris.md");
  });
});
```

- [ ] **Step 2: Write failing accepted-memory tests**

Create temporary memory fixtures inside the test and assert that the loader:

```ts
expect(loadAcceptedBlocks(pendingYaml)).toEqual([]);
expect(loadAcceptedBlocks(archivedYaml)).toEqual([]);
expect(loadAcceptedBlocks(currentApprovedYaml)).toEqual([
  expect.objectContaining({
    memory_id: "memory-2026-08-30-001",
    approved_by_aeris: true,
    state: "current",
  }),
]);
```

Also assert all seven real stores currently return an empty array.

- [ ] **Step 3: Run the focused tests and verify failure**

```bash
npm test -- --run tests/content/figures.test.ts tests/content/memory.test.ts
```

Expected: FAIL because the registry and loaders do not exist.

- [ ] **Step 4: Implement strict build-time loaders**

Use fileURLToPath and path.resolve to locate the repository root from site/.
Character loading must:

1. require the file;
2. read UTF-8 Markdown;
3. extract the first H1 as canonicalName;
4. render the remaining Markdown with marked;
5. retain sourcePath for attribution.

Memory loading must extract fenced YAML blocks, parse with yaml, and include a
record only when approved_by_aeris is exactly true and state is exactly current.
It must reject malformed accepted-looking records with an error containing the
source path.

- [ ] **Step 5: Run focused and complete unit tests**

```bash
npm test -- --run tests/content/figures.test.ts tests/content/memory.test.ts
npm test -- --run
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add site/src/data site/src/lib site/src/types site/tests/content
git commit -m "Load canonical character and memory content"
```

---

### Task 3: Produce full-frame web portrait derivatives

**Files:**
- Create: site/scripts/build-portraits.mjs
- Create: site/src/assets/portraits/aeris.webp
- Create: site/src/assets/portraits/iron-regent.webp
- Create: site/src/assets/portraits/avalokita.webp
- Create: site/src/assets/portraits/metis.webp
- Create: site/src/assets/portraits/socrates.webp
- Create: site/src/assets/portraits/little-prince.webp
- Create: site/src/data/portrait-imports.ts
- Create: site/tests/assets/portraits.test.ts
- Modify: site/package.json

**Interfaces:**
- Consumes: six originals under assets/characters/
- Produces: six 960-pixel-wide WebP derivatives with unchanged aspect ratio
- Produces: PORTRAITS keyed by all six canonical slugs

- [ ] **Step 1: Write the failing portrait integrity test**

```ts
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { FIGURES } from "../../src/data/figures";

describe("web portraits", () => {
  it.each(FIGURES)("$slug preserves the full-frame aspect ratio", async (figure) => {
    const source = await sharp(figure.absolutePortraitPath).metadata();
    const output = await sharp(figure.absoluteWebPortraitPath).metadata();
    expect(output.width).toBe(960);
    expect(output.width! / output.height!).toBeCloseTo(
      source.width! / source.height!,
      3,
    );
  });
});
```

- [ ] **Step 2: Run the test and verify missing derivatives**

```bash
npm test -- --run tests/assets/portraits.test.ts
```

Expected: FAIL because web portraits do not exist.

- [ ] **Step 3: Implement the deterministic Sharp script**

For every registry entry, read the original, auto-orient it, resize with
fit=inside and withoutEnlargement=true, and write a 960-pixel-wide WebP at
quality 82. Never use extract, trim, crop, cover, or a changed aspect ratio.

Add:

```json
{
  "scripts": {
    "assets:build": "node scripts/build-portraits.mjs"
  }
}
```

- [ ] **Step 4: Generate and inspect all six outputs**

```bash
npm run assets:build
npm test -- --run tests/assets/portraits.test.ts
```

Expected: PASS. Visually inspect each derivative to confirm the complete frame
and existing image mark remain visible.

- [ ] **Step 5: Commit**

```bash
git add site/scripts site/src/assets site/src/data/portrait-imports.ts site/tests/assets site/package.json site/package-lock.json
git commit -m "Optimize character portraits for the temple"
```

---

### Task 4: Build the first recognizable temple viewport

**Files:**
- Create: site/src/layouts/BaseLayout.astro
- Create: site/src/components/TempleEntrance.astro
- Create: site/src/components/Throne.astro
- Create: site/src/styles/tokens.css
- Create: site/src/styles/temple.css
- Modify: site/src/pages/index.astro
- Modify: site/src/styles/global.css
- Modify: site/tests/e2e/entrance.spec.ts

**Interfaces:**
- Consumes: FIGURES and PORTRAITS
- Produces: six semantic throne buttons and one Council threshold
- Produces: the black, white, and gold first viewport

- [ ] **Step 1: Write the failing first-viewport test**

```ts
import { expect, test } from "@playwright/test";

test("renders the ceremonial entrance and all canonical thrones", async ({ page }) => {
  await page.goto("/inner-polis/");
  await expect(page.getByRole("heading", { name: "Inner Polis" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Aeris/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /The Iron Regent/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Avalokita/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Metis/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Socrates/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /The Little Prince/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Council/ })).toBeVisible();
});
```

- [ ] **Step 2: Build and run the test to verify failure**

```bash
npm run build
npm run test:e2e -- entrance.spec.ts
```

Expected: FAIL because the temple controls are absent.

- [ ] **Step 3: Implement the minimal meaningful visual slice**

Build semantic components with:

- one main landmark;
- a CSS architectural arch and column layers;
- a cosmic background made from gradients and decorative pseudo-elements;
- six buttons arranged as an arc on wide screens;
- Aeris at the central or highest position;
- a Council button on the central floor axis;
- visible names and focus rings;
- no generic card grid or dashboard header.

Use CSS custom properties for the shared palette and each figure's secondary
tokens. Keep portrait loading lazy except for the visually dominant Aeris image.

- [ ] **Step 4: Verify the first meaningful preview**

```bash
npm run build
npm run test:e2e -- entrance.spec.ts
npm run dev -- --host 127.0.0.1
```

Require a successful local response at the exact dev URL, then open the first
recognizable temple preview for user review. Do not expand into dialogs before
this checkpoint unless fixing a blocking render defect.

- [ ] **Step 5: Commit**

```bash
git add site/src site/tests/e2e/entrance.spec.ts
git commit -m "Build the central temple entrance"
```

---

### Task 5: Add figure reading layers and accessible focus behavior

**Files:**
- Create: site/src/components/FigureDialog.astro
- Create: site/src/scripts/dialog-controller.ts
- Create: site/src/styles/dialog.css
- Modify: site/src/components/TempleEntrance.astro
- Modify: site/src/pages/index.astro
- Create: site/tests/e2e/figure-dialog.spec.ts

**Interfaces:**
- Consumes: CharacterContent, AcceptedMemory[], portrait imports
- Produces: one dialog per figure with exact rendered Markdown
- Produces: initDialogController(document): cleanup function

- [ ] **Step 1: Write failing interaction and content tests**

```ts
test("opens Aeris, shows canonical text and the empty-memory state", async ({ page }) => {
  await page.goto("/inner-polis/");
  const throne = page.getByRole("button", { name: /Aeris/ });
  await throne.click();
  const dialog = page.getByRole("dialog", { name: /Aeris/ });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Aeris retains final interpretive authority.");
  await expect(dialog).toContainText("尚无已接受记忆");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(throne).toBeFocused();
});
```

Add a parameterized test for all six throne-to-dialog mappings.

- [ ] **Step 2: Run the focused test and verify failure**

```bash
npm run build
npm run test:e2e -- figure-dialog.spec.ts
```

- [ ] **Step 3: Implement dialogs and controller**

Use the native dialog element where supported. The controller must:

- open only the requested figure dialog;
- store the activating throne;
- use showModal;
- close on the explicit close button and Escape;
- restore focus after close;
- keep body scroll locked only while a dialog is open.

Render trusted build-time HTML from the exact character source. Render accepted
memory records only from loadCurrentMemory. Do not place character prose inside
the component source.

- [ ] **Step 4: Run interaction, unit, and build checks**

```bash
npm run test:e2e -- figure-dialog.spec.ts
npm test -- --run
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add site/src/components site/src/scripts site/src/styles site/src/pages site/tests/e2e
git commit -m "Add canonical figure reading layers"
```

---

### Task 6: Add Council and GitHub-powered ChatGPT handoff

**Files:**
- Create: site/src/components/CouncilDialog.astro
- Create: site/src/components/ChatHandoff.astro
- Create: prompts/chatgpt-project-instructions.md
- Modify: site/src/components/FigureDialog.astro
- Modify: site/src/components/TempleEntrance.astro
- Create: site/tests/e2e/handoff.spec.ts
- Create: site/tests/content/project-instructions.test.ts

**Interfaces:**
- Produces: a Council explanation with no local selection controls
- Produces: a ChatGPT destination link labeled as a handoff, not data transfer
- Produces: one-time Project Instructions requiring GitHub reads from main

- [ ] **Step 1: Write failing handoff tests**

```ts
test("Council delegates formal selection to ChatGPT", async ({ page }) => {
  await page.goto("/inner-polis/");
  await page.getByRole("button", { name: /Council/ }).click();
  const dialog = page.getByRole("dialog", { name: /Council/ });
  await expect(dialog).toContainText("正式角色选择将在 ChatGPT 中完成");
  await expect(dialog.getByRole("checkbox")).toHaveCount(0);
  await expect(dialog.getByRole("link", { name: /进入 ChatGPT/ })).toHaveAttribute(
    "href",
    /^https:\/\/chatgpt\.com\//,
  );
});
```

The instructions test must assert that the file names
Kairon-2005/inner-polis, START_HERE.md, role-selection.md,
session-protocol.md, memory-review.md, and the literal branch main.

- [ ] **Step 2: Run focused tests and verify failure**

```bash
npm test -- --run tests/content/project-instructions.test.ts
npm run build
npm run test:e2e -- handoff.spec.ts
```

- [ ] **Step 3: Implement the handoff**

The project-instructions artifact must require each new formal session to:

1. use the connected GitHub plugin;
2. fetch START_HERE.md from main;
3. ask for the user's question;
4. propose and confirm figures;
5. fetch only the confirmed character, prompt, current-memory, and relevant
   accepted-decision files;
6. preserve Aeris review authority;
7. never invent accepted memory.

The website link opens ChatGPT but states plainly that the site does not
transmit a figure or Council selection.

- [ ] **Step 4: Run handoff tests and build**

```bash
npm test -- --run tests/content/project-instructions.test.ts
npm run build
npm run test:e2e -- handoff.spec.ts
```

- [ ] **Step 5: Commit**

```bash
git add prompts/chatgpt-project-instructions.md site/src/components site/tests
git commit -m "Add ChatGPT GitHub dialogue handoff"
```

---

### Task 7: Complete responsive, accessibility, and motion behavior

**Files:**
- Modify: site/src/styles/global.css
- Modify: site/src/styles/temple.css
- Modify: site/src/styles/dialog.css
- Modify: site/src/layouts/BaseLayout.astro
- Create: site/tests/e2e/accessibility.spec.ts
- Create: site/tests/e2e/responsive.spec.ts

**Interfaces:**
- Produces: wide throne arc, narrow ceremonial procession, full-height mobile dialog
- Produces: WCAG AA automated baseline and reduced-motion behavior

- [ ] **Step 1: Write failing accessibility and responsive tests**

Use @axe-core/playwright to assert zero serious or critical violations on the
entrance and an open figure dialog. At 390 by 844, assert all six throne buttons
have non-overlapping bounding boxes and the open dialog fits the viewport.
Emulate reducedMotion=reduce and assert decorative elements have no animation.

- [ ] **Step 2: Run tests and record the expected failures**

```bash
npm run build
npm run test:e2e -- accessibility.spec.ts responsive.spec.ts
```

- [ ] **Step 3: Implement responsive and accessibility corrections**

Add:

- 44-pixel minimum touch targets;
- strong white/gold focus-visible rings;
- vertical throne procession below the specified breakpoint;
- max reading width and safe-area padding;
- overflow handling for full-height dialogs;
- aria-hidden on decorative layers;
- reduced-motion overrides that remove parallax, shimmer, and transitions.

- [ ] **Step 4: Run all checks**

```bash
npm run check
npm run test:e2e
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add site/src site/tests/e2e
git commit -m "Harden temple accessibility and responsive layout"
```

---

### Task 8: Add GitHub Pages delivery and final repository verification

**Files:**
- Create: .github/workflows/pages.yml
- Modify: README.md
- Modify: architecture/stage-1-pages-brief.md
- Create: site/tests/deployment.test.ts

**Interfaces:**
- Produces: main-branch GitHub Pages workflow using withastro/action and actions/deploy-pages
- Produces: documented local preview and published route

- [ ] **Step 1: Write the failing deployment-contract test**

Parse .github/workflows/pages.yml as text and assert it contains:

```ts
expect(workflow).toContain("branches: [main]");
expect(workflow).toContain("pages: write");
expect(workflow).toContain("id-token: write");
expect(workflow).toContain("withastro/action");
expect(workflow).toContain("path: ./site");
expect(workflow).toContain("actions/deploy-pages");
```

- [ ] **Step 2: Run the test and verify failure**

```bash
npm test -- --run tests/deployment.test.ts
```

- [ ] **Step 3: Implement the workflow and documentation**

Use the official Astro Pages pattern with checkout, withastro/action pointed at
./site, and deploy-pages. Pin current stable major action versions found in the
official Astro deployment documentation at implementation time. Document that
repository Settings → Pages must use GitHub Actions as the source.

Update README and the Stage 1 brief only with operational website information;
do not revise philosophical or character content.

- [ ] **Step 4: Run final verification**

From site/:

```bash
npm run assets:build
npm run check
npm run test:e2e
```

From the repository root:

```bash
git diff --check
git diff 6aba1f7 --name-only -- characters constitution
git status --short
```

Expected:

- all unit, accessibility, interaction, and build checks pass;
- the character/constitution diff command prints nothing;
- only intentional tracked changes appear;
- no .DS_Store is tracked;
- built links use /inner-polis/.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/pages.yml README.md architecture/stage-1-pages-brief.md site/tests/deployment.test.ts
git commit -m "Deploy the temple entrance to GitHub Pages"
```

- [ ] **Step 6: Run whole-branch engineering review and scoped fix review**

Request a whole-branch review against the approved spec. Fix all Critical and
Important findings, rerun the complete verification suite, and request a scoped
review of the fixes. Canon or persistent-memory changes remain out of scope and
must be returned to Aeris rather than fixed autonomously.

- [ ] **Step 7: Push after verification**

```bash
git push origin main
```

Confirm local main and origin/main resolve to the same commit. If Pages requires
the repository setting to be changed to GitHub Actions, report that single
manual setting rather than claiming deployment is complete.


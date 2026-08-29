# Stage 1 Central Temple Entrance Design

## Status

Approved direction awaiting final written-spec review.

## Purpose

Build the first visual entrance to Inner Polis as a static Astro site published
with GitHub Pages. The entrance presents the six established figures inside a
sacred, monumental temple and lets the visitor inspect each figure without
creating separate character pages in this phase.

The website is a presentation and navigation layer. Repository Markdown remains
the source of truth for character definitions, memory, decisions, and operating
protocols.

## Product boundary

This phase includes:

- one central-temple entrance route;
- six visible thrones, one for each canonical figure;
- an in-page figure detail layer;
- an in-page Council entry layer;
- exact build-time reading of relevant repository Markdown;
- all six user-provided character portraits;
- a handoff from the site to the user's Inner Polis ChatGPT Project;
- an Astro production build and GitHub Pages deployment workflow.

This phase does not include:

- separate character routes;
- an LLM or chat API;
- a custom backend;
- authentication or server-side state;
- website writes to sessions, decisions, or memory;
- automatic transfer of website state into a ChatGPT conversation;
- new character interpretation, invented memory, or rewritten canon;
- the additional conceptual spaces planned for later Stage 1 work.

## Canon and review authority

- The repository is the sole canonical source.
- Character definitions must be rendered from existing Markdown rather than
  copied into an independently editable web-data file.
- The implementation must not paraphrase, reinterpret, weaken, expand, or
  silently change a character's established expression.
- Aeris retains final interpretive authority and leads review of proposed
  persistent memory.
- The website may label and arrange canonical material, but it must not present
  a generated interpretation as canonical content.
- Empty accepted-memory stores render 尚无已接受记忆; the website must not fill
  the space with sample memories.

## Architecture

Use Astro to generate a static site in a self-contained site/ directory. Keep
the existing repository organization unchanged.

The site contains:

- a build-time content adapter that reads Markdown from the repository root;
- a typed figure registry mapping canonical slugs to source paths, memory paths,
  portrait paths, and visual tokens;
- one entrance page assembled from focused Astro components;
- a small client-side interaction module for opening and closing detail layers;
- CSS for the temple, responsive layouts, focus states, and restrained motion;
- a GitHub Actions workflow that deploys the static output to GitHub Pages.

GitHub Pages project routing uses the /inner-polis/ base path. Internal and
asset URLs derive from Astro configuration rather than assuming a root domain.

## Canonical source data

### Character sources

- characters/aeris.md
- characters/iron-regent.md
- characters/avalokita.md
- characters/metis.md
- characters/socrates.md
- characters/little-prince.md

### Memory sources

- memory/shared/current.md
- memory/aeris/current.md
- memory/iron-regent/current.md
- memory/avalokita/current.md
- memory/metis/current.md
- memory/socrates/current.md
- memory/little-prince/current.md

Only accepted current-memory records may appear as memory. Instructions, schema
examples, pending candidates, and explanatory prose are not memory records.

### Portrait sources

- assets/characters/aeris/fullbody-v1.png
- assets/characters/iron-regent/fullbody-v1.png
- assets/characters/avalokita/fullbody-v1.jpeg
- assets/characters/metis/fullbody-v1.png
- assets/characters/socrates/fullbody-v1.jpeg
- assets/characters/little-prince/fullbody-v1.png

The originals remain untouched. The build may create lighter derivatives that
preserve the complete frame and existing image marks. Cropping must not remove
or conceal those marks.

### Dialogue sources

The ChatGPT handoff points to START_HERE.md, role-selection, session-protocol,
one-on-one, council, memory-review, and relevant accepted decisions. The
website does not package those files into the handoff. The connected GitHub
plugin reads the current repository version inside ChatGPT.

## Visual composition

### Shared atmosphere

The entrance feels sacred, monumental, inward-facing, and cosmological. Its
shared palette is deep black, luminous white, and restrained warm gold. It uses
a dominant European sacred arch, tall columns, a long central axis, stone
steps, vaulted depth, and six ordered thrones.

Avoid dashboard cards, application chrome, generic SaaS navigation, neon
cyberpunk styling, and an ornamental fantasy-game HUD.

### First viewport

The first viewport contains:

1. a distant cosmic field behind the architecture;
2. a large central arch framing the interior;
3. the title Inner Polis;
4. a short entrance instruction;
5. six clearly discoverable thrones;
6. a central Council threshold on the floor or altar axis.

Aeris occupies the central or highest visual position. The other five figures
form a balanced arc. All six remain canonical peers in the data model; visual
position does not create a new philosophical hierarchy.

### Figure atmospheres

The temple remains black, white, and gold. Focus and detail states may introduce
restrained secondary materials already grounded in recorded symbolism:

- Aeris: white marble, celestial light, fine gold orbits;
- The Iron Regent: black iron, ember red, forge light;
- Avalokita: pale water, moon-silver, mist;
- Metis: deep celestial blue, diagrams, star maps;
- Socrates: obsidian, archive violet, candle-like gold;
- The Little Prince: twilight blue, warm dawn, rose and grass motifs.

These tokens must not add personality claims.

## Interaction model

### Inspecting a figure

Every throne is a semantic button. Activating it opens an in-page detail layer
and moves keyboard focus into that layer.

The layer contains:

- canonical name;
- portrait;
- exact canonical role material sourced from the figure Markdown;
- accepted memory sourced from shared and owned current-memory stores;
- an explicit empty state when no accepted record exists;
- an 进入对话 action;
- a close action.

Closing returns focus to the throne that opened the layer. Escape closes the
topmost layer.

### Entering dialogue

进入对话 does not claim to carry the inspected figure into ChatGPT. It opens a
handoff explanation and then the configured ChatGPT destination. Inside the
Inner Polis Project, ChatGPT:

1. uses the connected GitHub plugin;
2. reads START_HERE.md from Kairon-2005/inner-polis;
3. asks for the question or situation;
4. proposes and confirms the figure selection;
5. loads exact prompt, memory, and decision files from the repository;
6. starts One-on-One for one confirmed figure or Council for two to six.

Formal selection occurs inside ChatGPT, not on the website.

### Entering Council

The Council threshold opens an in-page explanation and the same ChatGPT
handoff. It does not perform local multi-selection and does not simulate a
discussion.

### Local state

Only ephemeral interface state is allowed: focused throne, open layer, and
reduced-motion behavior. No role choice, conversation, or memory is persisted
in browser storage.

## Responsive behavior

- Wide screens use the full architectural composition and spatial throne arc.
- Narrow screens retain the arch and central axis but present thrones as a
  vertical ceremonial procession rather than unreadable hotspots.
- Figure detail becomes a full-height reading surface on small screens.
- Portraits use responsive sources and lazy loading; the first viewport does
  not require all six full-resolution originals.
- Essential content and actions remain available without hover.

## Accessibility

- Use semantic landmarks, headings, buttons, and dialog behavior.
- Portrait alternative text identifies only the canonical figure and function.
- All interactions work with keyboard and touch.
- Focus treatment uses white and gold with sufficient contrast.
- Background focus is unavailable while a modal layer is open.
- Motion respects prefers-reduced-motion.
- Decorative effects are hidden from assistive technology.
- Text contrast meets WCAG AA.

## Failure handling

The build fails clearly when a required character file, memory store, registry
entry, portrait, or safely mappable Markdown section is missing.

An empty accepted-memory set is valid and renders the empty state. Malformed or
unapproved records must not be silently displayed as memory.

The browser makes no runtime GitHub request. A GitHub outage after deployment
does not break the static entrance, although ChatGPT's later repository read
may be unavailable.

## Verification

Before publication:

1. verify all six character files and seven current-memory stores load;
2. verify no web content duplicates or replaces canonical character prose;
3. verify every throne opens the correct figure layer;
4. verify current empty-memory stores display the explicit empty state;
5. verify Council does not simulate chat or local selection;
6. verify focus entry, Escape close, and focus restoration;
7. verify small, medium, and wide layouts;
8. verify reduced-motion behavior;
9. verify portrait derivatives preserve complete frames and image marks;
10. run unit tests, accessibility checks, production build, and link checks;
11. verify built URLs under /inner-polis/;
12. validate GitHub Pages deployment without secrets;
13. confirm character and constitution Markdown remain unchanged.

## Delivery sequence

1. add the Astro project and build-time content contract;
2. build the smallest recognizable temple viewport;
3. review that first visual slice before expanding interaction;
4. add the six throne interactions and figure detail layer;
5. add Council and ChatGPT handoff layers;
6. complete responsive, accessibility, and performance work;
7. add and validate GitHub Pages deployment;
8. commit and push only after final verification.


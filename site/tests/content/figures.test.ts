import { describe, expect, it } from "vitest";
import { FIGURES } from "../../src/data/figures";
import { loadCharacter } from "../../src/lib/character-content";
import { repositoryPath } from "../../src/lib/repository-paths";

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
    expect(FIGURES.map((figure) => repositoryPath(figure.characterPath))).toHaveLength(6);
  });

  it("loads Aeris without rewriting the source", async () => {
    const aeris = FIGURES[0];
    const loaded = await loadCharacter(aeris);

    expect(loaded.canonicalName).toBe("Aeris — The Sovereign Self");
    expect(loaded.html).toContain("Aeris retains final interpretive authority.");
    expect(loaded.sourcePath).toBe("characters/aeris.md");
  });
});

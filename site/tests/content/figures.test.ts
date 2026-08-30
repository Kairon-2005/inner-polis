import { describe, expect, it } from "vitest";
import { readFile } from "node:fs/promises";
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

  it("gives every figure an operational dialogue profile without symbol sections", async () => {
    for (const figure of FIGURES) {
      const markdown = await readFile(repositoryPath(figure.characterPath), "utf8");

      expect(markdown).toMatch(/^## 思维方式$/m);
      expect(markdown).toMatch(/^## 特长$/m);
      expect(markdown).toMatch(/^## 角色功能$/m);
      expect(markdown).not.toMatch(/^## .*象征.*$/m);
    }
  });
});

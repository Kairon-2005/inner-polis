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

  it("locks the Aeris authority and Iron Regent traits approved for dialogue", async () => {
    const aeris = await readFile(repositoryPath("characters/aeris.md"), "utf8");
    const ironRegent = await readFile(
      repositoryPath("characters/iron-regent.md"),
      "utf8",
    );

    expect(aeris).toContain("- 白衣。");
    expect(aeris).toContain("- 无武器。");
    expect(aeris).toContain("- 无固定表情。");
    expect(aeris).toContain("对 interpretation 与 memory 保留最终决定权。");
    expect(aeris).toContain("Aeris retains final interpretive authority.");

    expect(ironRegent).toContain("- strong will。");
    expect(ironRegent).toContain("- 不受人性弱点支配。");
    expect(ironRegent).toContain("- 足够理性。");
    expect(ironRegent).toContain("- 坚定。");
    expect(ironRegent).toContain(
      "The Iron Regent may enforce commitments but may not determine ultimate goals.",
    );
  });
});

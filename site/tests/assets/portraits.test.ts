import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { FIGURES } from "../../src/data/figures";
import { repositoryPath, sitePath } from "../../src/lib/repository-paths";
import { PORTRAITS } from "../../src/data/portrait-imports";

describe("web portraits", () => {
  it("exports one imported portrait for every canonical figure", () => {
    expect(Object.keys(PORTRAITS)).toEqual(FIGURES.map((figure) => figure.slug));
  });

  it.each(FIGURES)("$slug preserves the full-frame aspect ratio", async (figure) => {
    const source = await sharp(repositoryPath(figure.portraitPath)).metadata();
    const output = await sharp(sitePath(figure.webPortraitPath)).metadata();

    expect(output.width).toBe(960);
    expect(output.width! / output.height!).toBeCloseTo(
      source.width! / source.height!,
      3,
    );
  });
});

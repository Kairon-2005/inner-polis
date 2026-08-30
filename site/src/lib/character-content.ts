import { access, readFile } from "node:fs/promises";
import { marked } from "marked";
import type { CharacterContent, FigureDefinition } from "../types/content";
import { repositoryPath } from "./repository-paths";

const H1 = /^#\s+(.+?)\s*$/m;

export async function loadCharacter(figure: FigureDefinition): Promise<CharacterContent> {
  const filePath = repositoryPath(figure.characterPath);
  await access(filePath);
  const markdown = await readFile(filePath, "utf8");
  const heading = markdown.match(H1);

  if (!heading || heading.index === undefined) {
    throw new Error(`Character source has no H1: ${figure.characterPath}`);
  }

  const body = markdown.slice(heading.index + heading[0].length).replace(/^\r?\n/, "");

  return {
    slug: figure.slug,
    canonicalName: heading[1],
    html: await marked.parse(body),
    sourcePath: figure.characterPath,
  };
}

import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { FIGURES } from "../src/data/figures.ts";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repositoryRoot = resolve(siteRoot, "..");

await Promise.all(
  FIGURES.map(async (figure) => {
    const sourcePath = resolve(repositoryRoot, figure.portraitPath);
    const outputPath = resolve(siteRoot, figure.webPortraitPath);

    await mkdir(dirname(outputPath), { recursive: true });
    await sharp(sourcePath)
      .autoOrient()
      .resize({
        width: 960,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toFile(outputPath);

    console.log(`Built ${figure.slug}: ${figure.webPortraitPath}`);
  }),
);

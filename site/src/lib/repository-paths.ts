import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = fileURLToPath(new URL("../../", import.meta.url));
const repositoryRoot = resolve(siteRoot, "..");

export function repositoryPath(relativePath: string): string {
  return resolve(repositoryRoot, relativePath);
}

export function sitePath(relativePath: string): string {
  return resolve(siteRoot, relativePath);
}

import { resolve } from "node:path";

const siteRoot = resolve(process.cwd());
const repositoryRoot = resolve(siteRoot, "..");

export function repositoryPath(relativePath: string): string {
  return resolve(repositoryRoot, relativePath);
}

export function sitePath(relativePath: string): string {
  return resolve(siteRoot, relativePath);
}

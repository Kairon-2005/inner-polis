import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";
import { parse } from "yaml";

const workflowPath = new URL("../../.github/workflows/pages.yml", import.meta.url);

describe("GitHub Pages deployment", () => {
  it("builds the site directory and deploys main with Pages permissions", async () => {
    const workflow = await readFile(workflowPath, "utf8");
    const config = parse(workflow);

    expect(workflow).toContain("branches: [main]");
    expect(workflow).toContain("pages: write");
    expect(workflow).toContain("id-token: write");
    expect(workflow).toContain("withastro/action");
    expect(workflow).toContain("path: ./site");
    expect(workflow).toContain("actions/deploy-pages");
    expect(config.permissions).toEqual({});
    expect(config.jobs.build.permissions).toEqual({ contents: "read" });
    expect(config.jobs.deploy.permissions).toEqual({
      pages: "write",
      "id-token": "write",
    });
  });
});

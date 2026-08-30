import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { repositoryPath } from "../../src/lib/repository-paths";

describe("repository entrance", () => {
  it("uses a minimal linked temple cover instead of exposing internal documentation", async () => {
    const readme = await readFile(repositoryPath("README.md"), "utf8");

    expect(readme).toContain("https://kairon-2005.github.io/inner-polis/");
    expect(readme).toContain("assets/readme/temple-entrance.webp");
    expect(readme).not.toContain("## 原始目标");
    expect(readme).not.toContain("## 六个角色");
    expect(readme).not.toContain("## Stage 0");
    expect(readme).not.toContain("## 阅读顺序");
    expect(readme).not.toContain("## Operational References");
  });
});

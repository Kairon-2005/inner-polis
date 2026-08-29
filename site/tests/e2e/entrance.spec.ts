import { expect, test } from "@playwright/test";

test("serves the Inner Polis entrance", async ({ page }) => {
  await page.goto("/inner-polis/");

  await expect(page.getByRole("heading", { name: "Inner Polis" })).toBeVisible();
});

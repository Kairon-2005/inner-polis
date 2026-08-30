import { expect, test } from "@playwright/test";

test("renders the ceremonial entrance and all canonical thrones", async ({ page }) => {
  await page.goto("/inner-polis/");

  await expect(page.getByRole("heading", { name: "Inner Polis" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Aeris/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /The Iron Regent/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Avalokita/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Metis/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Socrates/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /The Little Prince/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Council/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "圣典", exact: true })).toBeVisible();
});

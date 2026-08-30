import { expect, test } from "@playwright/test";

test("Council delegates formal selection to ChatGPT without local controls", async ({ page }) => {
  await page.goto("/inner-polis/");
  const council = page.getByRole("button", { name: /Council/ });

  await council.click();

  const dialog = page.getByRole("dialog", { name: /Council/ });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("正式角色选择将在 ChatGPT 中完成");
  await expect(dialog).toContainText("本站不会传送任何角色或 Council 选择");
  await expect(dialog.getByRole("checkbox")).toHaveCount(0);
  await expect(dialog.getByRole("radio")).toHaveCount(0);
  await expect(dialog.getByRole("link", { name: /进入 ChatGPT/ })).toHaveAttribute(
    "href",
    /^https:\/\/chatgpt\.com\//,
  );
});

test("figure dialogue is a disclosed ChatGPT handoff rather than a selection transfer", async ({
  page,
}) => {
  await page.goto("/inner-polis/");
  await page.getByRole("button", { name: "Aeris", exact: true }).click();

  const dialog = page.getByRole("dialog", { name: "Aeris", exact: true });
  await expect(dialog).toContainText("本站不会传送任何角色或 Council 选择");
  await expect(dialog.getByRole("link", { name: /进入 ChatGPT/ })).toHaveAttribute(
    "href",
    /^https:\/\/chatgpt\.com\//,
  );
});

test("closing the Council dialog restores focus to its threshold", async ({ page }) => {
  await page.goto("/inner-polis/");
  const council = page.getByRole("button", { name: /Council/ });

  await council.click();
  const dialog = page.getByRole("dialog", { name: /Council/ });
  await dialog.getByRole("button", { name: "Close" }).click();

  await expect(dialog).toBeHidden();
  await expect(council).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

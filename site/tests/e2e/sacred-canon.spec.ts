import { expect, test } from "@playwright/test";

test("opens the independent read-only Sacred Canon and restores focus", async ({ page }) => {
  await page.goto("/inner-polis/");
  const entrance = page.getByRole("button", { name: "圣典", exact: true });
  await entrance.click();
  const dialog = page.getByRole("dialog", { name: "圣典", exact: true });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("圣典尚无条目");
  await expect(dialog.locator("form, textarea, [contenteditable], [data-chat-handoff]"))
    .toHaveCount(0);
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(entrance).toBeFocused();
});

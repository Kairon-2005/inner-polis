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

test("keeps the Sacred Canon reading layer scrollable and viewport-safe", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/inner-polis/");
  await page.getByRole("button", { name: "圣典", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "圣典", exact: true });
  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  expect(box!.y + box!.height).toBeLessThanOrEqual(844);
  await expect(dialog.locator(".sacred-canon-dialog__reading"))
    .toHaveCSS("overflow-y", "auto");
});

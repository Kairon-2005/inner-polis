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

test("keeps the Sacred Canon reading layer scrollable and viewport-safe", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1470, height: 956 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/inner-polis/");
    await page.getByRole("button", { name: "圣典", exact: true }).click();
    const dialog = page.getByRole("dialog", { name: "圣典", exact: true });
    const reading = dialog.locator(".sacred-canon-dialog__reading");

    await reading.evaluate((element) => {
      for (let index = 0; index < 80; index += 1) {
        const probe = document.createElement("p");
        probe.textContent = "Viewport overflow probe";
        element.append(probe);
      }
    });

    const box = await dialog.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.y).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
    expect(box!.y + box!.height).toBeLessThanOrEqual(viewport.height);
    await expect(reading).toHaveCSS("overflow-y", "auto");
    expect(
      await reading.evaluate(
        (element) => element.scrollHeight > element.clientHeight,
      ),
    ).toBe(true);
    await reading.evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    expect(
      await reading.evaluate((element) => element.scrollTop),
    ).toBeGreaterThan(0);
  }
});

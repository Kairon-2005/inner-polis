import { expect, test } from "@playwright/test";

const figures = [
  { throneName: "Aeris", dialogName: "Aeris" },
  { throneName: "The Iron Regent", dialogName: "The Iron Regent" },
  { throneName: "Avalokita", dialogName: "Avalokita" },
  { throneName: "Metis", dialogName: "Metis" },
  { throneName: "Socrates", dialogName: "Socrates" },
  { throneName: "The Little Prince", dialogName: "The Little Prince" },
] as const;

test("opens Aeris, shows canonical text and the empty-memory state", async ({ page }) => {
  await page.goto("/inner-polis/");
  const throne = page.getByRole("button", { name: /Aeris/ });
  await throne.click();
  const dialog = page.getByRole("dialog", { name: /Aeris/ });
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Aeris retains final interpretive authority.");
  await expect(dialog).toContainText("尚无已接受记忆");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(throne).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("keeps long canonical content scrollable inside the desktop dialog", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto("/inner-polis/");
  await page.getByRole("button", { name: "Aeris", exact: true }).click();

  const dialog = page.getByRole("dialog", { name: "Aeris", exact: true });
  const reading = dialog.locator(".figure-dialog__reading");
  await expect(dialog).toBeVisible();

  const dimensions = await reading.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
    overflowY: getComputedStyle(element).overflowY,
  }));

  expect(dimensions.overflowY).toBe("auto");
  expect(dimensions.scrollHeight).toBeGreaterThan(dimensions.clientHeight);

  await reading.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
  });
  await expect(reading).toContainText("尚无已接受记忆");
  expect(await reading.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
});

test("identifies the canonical figure portrait to assistive technology", async ({ page }) => {
  await page.goto("/inner-polis/");
  await page.getByRole("button", { name: "Aeris", exact: true }).click();

  const dialog = page.getByRole("dialog", { name: "Aeris", exact: true });
  await expect(dialog.getByRole("img", { name: "Portrait of Aeris" })).toBeVisible();
});

for (const figure of figures) {
  test(`maps the ${figure.throneName} throne to its reading layer`, async ({ page }) => {
    await page.goto("/inner-polis/");
    const throne = page.getByRole("button", { name: figure.throneName, exact: true });

    await throne.click();

    const requestedDialog = page.getByRole("dialog", { name: figure.dialogName, exact: true });
    await expect(requestedDialog).toBeVisible();
    await expect(page.locator("dialog[open]")).toHaveCount(1);

    await requestedDialog.getByRole("button", { name: "Close" }).click();
    await expect(requestedDialog).toBeHidden();
    await expect(throne).toBeFocused();
    await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
  });
}

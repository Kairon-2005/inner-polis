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

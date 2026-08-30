import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const seriousOrCriticalViolations = async (page: Page) => {
  const results = await new AxeBuilder({ page }).analyze();

  return results.violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical",
  );
};

test("the temple entrance has no serious or critical accessibility violations", async ({
  page,
}) => {
  await page.goto("/inner-polis/");

  expect(await seriousOrCriticalViolations(page)).toEqual([]);
});

test("an open figure dialog has no serious or critical accessibility violations", async ({
  page,
}) => {
  await page.goto("/inner-polis/");
  await page.getByRole("button", { name: "Aeris", exact: true }).click();
  await expect(
    page.getByRole("dialog", { name: "Aeris", exact: true }),
  ).toBeVisible();

  expect(await seriousOrCriticalViolations(page)).toEqual([]);
});

test("every visible temple action provides a 44 pixel touch target", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/inner-polis/");

  for (const action of await page.locator("button:visible").all()) {
    const box = await action.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }

  await page.getByRole("button", { name: "Aeris", exact: true }).click();
  for (const action of await page
    .locator("dialog[open] :is(button, a):visible")
    .all()) {
    const box = await action.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
});

test("keyboard focus uses a strong white and gold treatment", async ({
  page,
}) => {
  await page.goto("/inner-polis/");

  const throne = page.getByRole("button", { name: "Aeris", exact: true });
  await throne.focus();
  const focusStyle = await throne.evaluate((element) => {
    const style = getComputedStyle(element);
    return {
      outlineColor: style.outlineColor,
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
      boxShadow: style.boxShadow,
    };
  });

  expect(focusStyle.outlineStyle).toBe("solid");
  expect(focusStyle.outlineWidth).toBeGreaterThanOrEqual(2);
  expect(focusStyle.outlineColor).toBe("rgb(243, 240, 232)");
  expect(focusStyle.boxShadow).toContain("rgb(221, 200, 137)");
});

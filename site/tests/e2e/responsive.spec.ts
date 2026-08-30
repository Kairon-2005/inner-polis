import { expect, test } from "@playwright/test";

const mobileViewport = { width: 390, height: 844 };

test("mobile thrones form a non-overlapping ceremonial procession", async ({
  page,
}) => {
  await page.setViewportSize(mobileViewport);
  await page.goto("/inner-polis/");

  const thrones = page.locator(".throne");
  await expect(thrones).toHaveCount(6);
  const boxes = await thrones.evaluateAll((elements) =>
    elements.map((element) => {
      const box = element.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    }),
  );

  for (const box of boxes) {
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(mobileViewport.width);
  }

  for (let firstIndex = 0; firstIndex < boxes.length; firstIndex += 1) {
    for (
      let secondIndex = firstIndex + 1;
      secondIndex < boxes.length;
      secondIndex += 1
    ) {
      const first = boxes[firstIndex];
      const second = boxes[secondIndex];
      const overlapWidth =
        Math.min(first.x + first.width, second.x + second.width) -
        Math.max(first.x, second.x);
      const overlapHeight =
        Math.min(first.y + first.height, second.y + second.height) -
        Math.max(first.y, second.y);

      expect(overlapWidth > 0 && overlapHeight > 0).toBe(false);
    }
  }

  const centers = boxes.map((box) => box.x + box.width / 2);
  expect(Math.max(...centers) - Math.min(...centers)).toBeLessThanOrEqual(2);
});

test("an open mobile figure dialog fits the viewport and remains scrollable", async ({
  page,
}) => {
  await page.setViewportSize(mobileViewport);
  await page.goto("/inner-polis/");
  await page.getByRole("button", { name: "Aeris", exact: true }).click();

  const dialog = page.getByRole("dialog", { name: "Aeris", exact: true });
  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(mobileViewport.width);
  expect(box!.y + box!.height).toBeLessThanOrEqual(mobileViewport.height);
  expect(box!.y).toBeLessThanOrEqual(1);
  expect(box!.height).toBeGreaterThanOrEqual(mobileViewport.height - 2);

  const reading = dialog.locator(".figure-dialog__reading");
  await expect(reading).toHaveCSS("overflow-y", "auto");
  expect(
    await reading.evaluate(
      (element) => element.scrollHeight > element.clientHeight,
    ),
  ).toBe(true);

  const portraitBox = await dialog
    .locator(".figure-dialog__portrait")
    .boundingBox();
  const imageBox = await dialog
    .locator(".figure-dialog__portrait img")
    .boundingBox();
  expect(portraitBox).not.toBeNull();
  expect(imageBox).not.toBeNull();
  expect(imageBox!.x).toBeGreaterThanOrEqual(portraitBox!.x);
  expect(imageBox!.y).toBeGreaterThanOrEqual(portraitBox!.y);
  expect(imageBox!.x + imageBox!.width).toBeLessThanOrEqual(
    portraitBox!.x + portraitBox!.width,
  );
  expect(imageBox!.y + imageBox!.height).toBeLessThanOrEqual(
    portraitBox!.y + portraitBox!.height,
  );
});

test("reduced motion removes decorative motion and interaction transitions", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/inner-polis/");

  for (const selector of [
    ".temple__cosmos",
    ".temple__architecture",
    ".throne__body",
    ".throne__aureole",
    ".council-threshold",
  ]) {
    const motion = await page
      .locator(selector)
      .first()
      .evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          animationName: style.animationName,
          transitionDuration: style.transitionDuration,
        };
      });

    expect(motion.animationName).toBe("none");
    expect(motion.transitionDuration).toBe("0s");
  }
});

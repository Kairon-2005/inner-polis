import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: "http://127.0.0.1:4321",
  },
  webServer: {
    command: "npx vite preview --host 127.0.0.1 --port 4321 --base /inner-polis",
    url: "http://127.0.0.1:4321/inner-polis/",
    reuseExistingServer: false,
  },
});

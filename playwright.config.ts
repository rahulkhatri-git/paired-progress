import { defineConfig, devices } from "@playwright/test"

const BASE_URL = process.env.BASE_URL || "https://paired-progress-qatiwm9qz-rahulkhatri-gits-projects.vercel.app"

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "html",
  outputDir: "test-results/artifacts",
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
})

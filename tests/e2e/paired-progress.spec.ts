import { test, expect } from "@playwright/test"

const BASE_URL = process.env.BASE_URL || "https://paired-progress-qatiwm9qz-rahulkhatri-gits-projects.vercel.app"

function randomEmail() {
  return `test-user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`
}

test.describe("Paired Progress - Comprehensive E2E", () => {
  test.beforeEach(async ({ page }) => {
    page.on("console", (msg) => {
      const type = msg.type()
      const text = msg.text()
      if (type === "error" || type === "warning") {
        console.log(`[Browser ${type}] ${text}`)
      }
    })
  })

  test("1. Landing page loads, Start Free visible", async ({ page }) => {
    await page.goto(BASE_URL)
    await expect(page).toHaveURL(new RegExp(BASE_URL.replace(/^https?:\/\//, ".*")))
    await expect(page.getByRole("button", { name: /Start Free/i }).first()).toBeVisible({ timeout: 10000 })
    await page.screenshot({ path: "test-results/01-landing.png" })
  })

  test("2. Sign up flow - auth modal opens, signup works, reach dashboard", async ({ page }) => {
    const email = randomEmail()
    await page.goto(BASE_URL)
    await page.getByRole("button", { name: /Start Free/i }).first().click()
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByText(/Create your account|Welcome back/i)).toBeVisible()

    await page.getByLabel(/Full name/i).fill("Test User")
    await page.getByLabel(/Email/i).fill(email)
    await page.getByLabel(/Password/i).fill("TestPassword123!")
    await page.getByRole("button", { name: /Create Account/i }).click()

    await page.waitForURL(/\/dashboard/, { timeout: 20000 })
    await expect(page).toHaveURL(/\/dashboard/)
    await page.screenshot({ path: "test-results/02-dashboard-after-signup.png" })
  })

  test("3. Create habit - FAB opens modal, create tiered habit, stay on dashboard", async ({ page }) => {
    const email = randomEmail()
    await page.goto(BASE_URL)
    await page.getByRole("button", { name: /Start Free/i }).first().click()
    await page.getByLabel(/Full name/i).fill("Test User")
    await page.getByLabel(/Email/i).fill(email)
    await page.getByLabel(/Password/i).fill("TestPassword123!")
    await page.getByRole("button", { name: /Create Account/i }).click()

    await page.waitForURL(/\/dashboard/, { timeout: 20000 })
    await page.screenshot({ path: "test-results/03-dashboard-before-habit.png" })

    const fab = page.getByRole("button", { name: /Create new habit/i })
    await fab.click()

    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5000 })
    await expect(page.getByText(/Create New Habit/i)).toBeVisible()

    await page.getByPlaceholder(/e.g., Morning Workout/i).fill("Morning Workout")
    await page.getByRole("button", { name: /^Tiered$/ }).click()
    await page.locator('input[type="number"]').first().fill("5000")
    await page.locator('input[type="number"]').nth(1).fill("8000")
    await page.locator('input[type="number"]').nth(2).fill("10000")

    await page.getByRole("combobox").first().click()
    await page.getByRole("option", { name: "steps" }).click()
    await page.getByRole("button", { name: /^Create Habit$/ }).click()

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 5000 })
    await page.screenshot({ path: "test-results/04-after-create-habit.png" })
    await expect(page.getByText("Morning Workout")).toBeVisible({ timeout: 10000 })
    await page.screenshot({ path: "test-results/05-habit-card-visible.png" })
  })

  test("4. Log habit - click card, enter value, log", async ({ page }) => {
    const email = randomEmail()
    await page.goto(BASE_URL)
    await page.getByRole("button", { name: /Start Free/i }).first().click()
    await page.getByLabel(/Full name/i).fill("Test User")
    await page.getByLabel(/Email/i).fill(email)
    await page.getByLabel(/Password/i).fill("TestPassword123!")
    await page.getByRole("button", { name: /Create Account/i }).click()
    await page.waitForURL(/\/dashboard/, { timeout: 20000 })

    const fab = page.getByRole("button", { name: /Create new habit/i })
    await fab.click()
    await page.getByPlaceholder(/e.g., Morning Workout/i).fill("Morning Workout")
    await page.getByRole("button", { name: /^Tiered$/ }).click()
    await page.locator('input[type="number"]').first().fill("5000")
    await page.locator('input[type="number"]').nth(1).fill("8000")
    await page.locator('input[type="number"]').nth(2).fill("10000")
    await page.getByRole("combobox").first().click()
    await page.getByRole("option", { name: "steps" }).click()
    await page.getByRole("button", { name: /^Create Habit$/ }).click()
    await expect(page.getByText("Morning Workout")).toBeVisible({ timeout: 10000 })

    await page.getByText("Morning Workout").first().click()
    await expect(page.getByRole("dialog")).toBeVisible({ timeout: 5000 })
    await page.getByRole("spinbutton").or(page.locator('input[type="number"]')).first().fill("7000")
    await page.getByRole("button", { name: /Log Habit/i }).click()
    await page.screenshot({ path: "test-results/06-after-log-habit.png" })
  })
})

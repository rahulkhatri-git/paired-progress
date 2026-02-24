# E2E Testing Guide - Paired Progress

This guide covers running comprehensive end-to-end tests for the Paired Progress app.

## Prerequisites

1. **Install Playwright** (first time only):
   ```bash
   npm install -D @playwright/test
   npx playwright install chromium
   ```

2. **Fix npm cache** (if you see EPERM errors):
   ```bash
   sudo chown -R $(whoami) ~/.npm
   ```

## Running Tests

### Deployed URL (default)
```bash
npm run test:e2e
# or
npx playwright test
```

### Local Development
```bash
# Terminal 1: Start the app
npm run dev

# Terminal 2: Run tests against localhost
BASE_URL=http://localhost:3000 npm run test:e2e
```

### Interactive UI Mode
```bash
npm run test:e2e:ui
```

## Test Scenarios

| # | Test | What it verifies |
|---|------|------------------|
| 1 | Landing page | Page loads, "Start Free" button visible |
| 2 | Sign up flow | Auth modal opens, signup works, redirect to dashboard |
| 3 | Create habit | FAB opens modal, tiered habit creation, **stays on dashboard** |
| 4 | Log habit | Click habit card, enter value, log successfully |

## Critical Assertion

**Test 3** explicitly verifies you remain on `/dashboard` after creating a habit—no redirect to home page.

## Screenshots

Screenshots are saved to `test-results/`:
- `01-landing.png` - Landing page
- `02-dashboard-after-signup.png` - After signup
- `03-dashboard-before-habit.png` - Before creating habit
- `04-after-create-habit.png` - After creating habit
- `05-habit-card-visible.png` - Habit card in list
- `06-after-log-habit.png` - After logging

## Troubleshooting

- **403 Forbidden**: The deployed Vercel URL may have password protection. Use local: `BASE_URL=http://localhost:3000 npx playwright test`
- **Supabase errors**: Ensure `.env.local` has valid `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Email confirmation**: If Supabase requires email confirmation, signup may not immediately log the user in

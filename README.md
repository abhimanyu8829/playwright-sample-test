# Nitroberry Playwright Test Suite

This repository contains end-to-end Playwright tests for the current Nitroberry platform:

- Main app and product hub: `https://app.nitroberry.com`
- Cockpit: `https://cockpit.nitroberry.com`
- Task: `https://task.nitroberry.com`
- Workflow: `https://workflow.nitroberry.com`
- Social: `https://social.nitroberry.com`
- Vault: `https://vault.nitroberry.com`
- Messenger: `https://messenger.nitroberry.com`

The old test suite was built for an older Nitroberry flow. The current suite has been updated for the new product hub flow where users log in to `/hub` and then access separate Nitroberry product apps.

## Test Count

Playwright currently discovers:

```bash
31 tests in 12 files
```

The suite is split into three Playwright projects:

- `setup`: creates authenticated storage state for product tests.
- `auth`: runs login and validation tests with a clean browser state.
- `chromium`: runs hub and product tests using the saved authenticated state.

## What Is Covered

### Auth

File:

- `tests/auth/auth.spec.js`

Coverage:

- Login required field validation.
- Invalid credential handling.
- Successful admin login.
- Redirect/landing check for the new `/hub` flow.

### Hub

File:

- `tests/hub/hub.spec.js`

Coverage:

- Product catalogue loads after login.
- Licensed product cards are visible.
- Survey is disabled/unavailable.
- CRM is shown as coming soon/not licensed.
- Compact catalogue view toggle works.

### Product Smoke Tests

File:

- `tests/products/product-smoke.spec.js`

Coverage:

- Cockpit dashboard loads and shows company administration modules.
- Task dashboard loads and shows delegation/calendar/create-task controls.
- Workflow dashboard loads and shows metrics and workflow board.
- Social home feed loads with community/post controls.
- Vault loads private-key unlock screen.
- Messenger loads contacts workspace and encrypted empty state.

### Task Flow

File:

- `tests/products/task-flow.spec.js`

Coverage:

- Opens the current Create Task dialog.
- Verifies current required fields.
- Fills task title, description, and end date.
- Cancels instead of submitting, so production data is not created.

### Vault Flow

File:

- `tests/products/vault-flow.spec.js`

Coverage:

- Validates access without private key.
- Verifies private-key show/hide toggle.
- Unlocks Vault with a saved local private key fixture.

### Messenger Flow

File:

- `tests/products/messenger-flow.spec.js`

Coverage:

- Contact search input.
- All/unread filter controls.
- Workspace empty state.

### Shared Shell Controls

File:

- `tests/products/shell-controls.spec.js`

Coverage:

- Notifications button.
- Product switcher.
- Theme toggle.

### Cockpit Dashboard Basics

File:

- `tests/products/cockpit-dashboard.spec.js`

Coverage:

- Main Cockpit sidebar modules.
- Dashboard overview sections such as users, organization structure, holidays, shifts, locations, tickets, and storage.

### Task Dashboard Controls

File:

- `tests/products/task-dashboard-controls.spec.js`

Coverage:

- Delegations/My Task switching.
- Dashboard view mode selector.

### Workflow Dashboard Controls

File:

- `tests/products/workflow-dashboard-controls.spec.js`

Coverage:

- My Dashboard/Company Dashboard controls.
- Workflow filters panel.
- Metrics remain visible.

### Social Dashboard Controls

File:

- `tests/products/social-dashboard-controls.spec.js`

Coverage:

- Home navigation.
- Communities/favorites context.
- Post type controls: Discussion, Question, Praise, Poll, Drafts.

## Verified Status

The following groups were run successfully against the live Nitroberry app:

```bash
npx playwright test tests/auth --reporter=line
npx playwright test tests/hub --reporter=line
npx playwright test tests/products --reporter=line
```

Verified result:

```bash
Auth: 4 passed
Hub: 4 passed
Products: 13 passed
```

Additional basic control tests were added after that. They are discovered by Playwright, but live verification was blocked during the last run because Nitroberry product subdomains timed out from the local environment.

## Prerequisites

Install these before running the tests:

- Node.js 18 or newer
- npm
- Git
- Internet access to Nitroberry app and product subdomains

Check your versions:

```bash
node --version
npm --version
git --version
```

## Setup On A New System

1. Clone the repository:

```bash
git clone <repository-url>
cd Nitroberry-Playwright-Test
```

2. Install project dependencies:

```bash
npm install
```

3. Install Playwright browsers:

```bash
npx playwright install
```

4. Confirm tests are detected:

```bash
npx playwright test --list
```

Expected output should show `31 tests in 12 files`.

## Credentials

The suite currently defaults to:

```bash
admin@nitroberry.com
123456
```

You can override credentials with environment variables.

PowerShell:

```powershell
$env:NITROBERRY_EMAIL="admin@nitroberry.com"
$env:NITROBERRY_PASSWORD="123456"
```

Command Prompt:

```bat
set NITROBERRY_EMAIL=admin@nitroberry.com
set NITROBERRY_PASSWORD=123456
```

Bash:

```bash
export NITROBERRY_EMAIL="admin@nitroberry.com"
export NITROBERRY_PASSWORD="123456"
```

## How Authentication Works

`tests/auth.setup.js` logs in once and saves browser session state to:

```bash
playwright/.auth/admin.json
```

Product and hub tests reuse this storage state so every test does not need to repeat the login flow.

The auth state folder is ignored by Git because it can contain active session data.

## Vault Test Key

Vault unlock tests can use either an environment variable or a local ignored fixture.

Environment variable:

```bash
NITROBERRY_VAULT_PRIVATE_KEY=<your-private-key>
```

Local fixture path:

```bash
playwright/.vault/admin-vault.json
```

This folder is ignored by Git because it contains sensitive Vault test data.

## Run Commands

Run everything:

```bash
npm test
```

Run headed mode:

```bash
npm run test:headed
```

Run auth and hub tests:

```bash
npm run test:auth
```

Run all product tests:

```bash
npm run test:products
```

Run only the newest added product-control tests:

```bash
npm run test:new
```

Run one file:

```bash
npx playwright test tests/products/task-flow.spec.js
```

Run one test by title:

```bash
npx playwright test -g "opens the create task dialog"
```

Run without re-running setup, using existing auth state:

```bash
npx playwright test tests/products/task-flow.spec.js --project=chromium --no-deps
```

## Reports And Debugging

Open the HTML report:

```bash
npx playwright show-report
```

Run with browser visible:

```bash
npx playwright test --headed
```

Run with Playwright UI mode:

```bash
npx playwright test --ui
```

Show trace for a failed test:

```bash
npx playwright show-trace <path-to-trace.zip>
```

Failed screenshots, videos, traces, and error contexts are saved under:

```bash
test-results/
```

## Project Structure

```text
.
├── playwright.config.js
├── package.json
├── README.md
├── tests
│   ├── auth.setup.js
│   ├── auth
│   │   └── auth.spec.js
│   ├── hub
│   │   └── hub.spec.js
│   └── products
│       ├── cockpit-dashboard.spec.js
│       ├── messenger-flow.spec.js
│       ├── product-smoke.spec.js
│       ├── shell-controls.spec.js
│       ├── social-dashboard-controls.spec.js
│       ├── task-dashboard-controls.spec.js
│       ├── task-flow.spec.js
│       ├── vault-flow.spec.js
│       └── workflow-dashboard-controls.spec.js
└── utils
    └── nitroberry.js
```

## Important Notes

- Tests use the current Nitroberry product architecture.
- Tests avoid destructive production changes by default.
- Task creation coverage fills the modal and cancels instead of submitting.
- Vault tests do not require a real private key.
- Survey is currently disabled in the hub.
- CRM is currently coming soon/not licensed.

## Still Left For Future Coverage

These deeper flows are not fully automated yet:

- Cockpit create/edit/delete flows for users, departments, job titles, groups, roles, facilities, shifts, holidays, and support tickets.
- Vault credential CRUD after private-key unlock.
- Social post creation and community management.
- Workflow template, indent, report, and analytics deep flows.
- Messenger real chat send/receive flow.
- Survey product flows, once licensed/enabled.
- CRM product flows, once available.

## Troubleshooting

If product tests fail at `page.goto` with `ERR_CONNECTION_TIMED_OUT`, the Nitroberry host or your local network is not reachable. Retry a smaller group first:

```bash
npm run test:auth
npx playwright test tests/products/product-smoke.spec.js --project=chromium --no-deps
```

If auth state is expired, delete the saved auth state and run again:

```bash
Remove-Item -Recurse -Force playwright/.auth
npm test
```

For Bash:

```bash
rm -rf playwright/.auth
npm test
```

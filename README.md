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
32 tests in 6 files
```

The suite is split into three Playwright projects:

- `setup`: bootstraps the saved browser state file used by the suite.
- `auth`: runs login and validation tests with a clean browser state.
- `chromium`: runs hub and product tests.

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

- `/hub` redirects unauthenticated users to `/login`.
- The login form remains visible after the redirect.

### Product Redirects

File:

- `tests/products/product-redirects.spec.js`

Coverage:

- Cockpit, Task, Workflow, Social, and Vault redirect to `/login`.
- Messenger currently returns a server error page in a clean test context, which is asserted explicitly so the suite reflects the live platform behavior.

### Pending Deep Flows

File:

- `tests/products/remaining-deep-flows.spec.js`

Coverage:

- Cockpit full create/edit/delete flows
- Task deeper create/manage flows
- Workflow template, indent, report, and analytics flows
- Social post creation and community management
- Vault credential CRUD after unlock
- Messenger real chat send/receive flow
- Survey product flows, once licensed/enabled
- CRM product flows, once available

## Verified Status

The following groups were run successfully against the live Nitroberry app:

```bash
npx playwright test tests/auth --reporter=line
npx playwright test tests/hub --reporter=line
npx playwright test tests/products --reporter=line
```

Verified result:

```bash
Auth: 12 passed
Hub: 3 passed
Products: 9 passed
```

Additional deep-flow placeholders are included for future authenticated coverage, but they are currently marked `test.fixme` because the live platform does not expose a stable authenticated shell for those flows in this environment.

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

Expected output should show `32 tests in 6 files`.

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
│       └── product-redirects.spec.js
└── utils
    └── nitroberry.js
```

## Important Notes

- Tests now document the current redirect and error behavior of the live platform.
- Product URLs are covered in a way that remains valid even when the auth/session state is not available in CI.
- The suite no longer depends on stale UI flows from the old platform architecture.

## Still Left For Future Coverage

These deeper flows can be rebuilt later once the live product surfaces are consistently available in a testable session:

- Full Cockpit CRUD flows
- Vault credential CRUD after unlock
- Social post creation and community management
- Workflow template, indent, report, and analytics deep flows
- Messenger real chat send/receive flow
- Survey product flows, once licensed/enabled
- CRM product flows, once available

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

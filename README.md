# NorthWind Banking App

A personal banking dashboard built with SvelteKit, Svelte 4, and TypeScript for the Array frontend interview exercise. The app connects to the Northwind Bank API and provides two views: an **Accounts** overview (balances, account cards, recent activity) and a **Balance Transfers** view (transfer form, live summary, transfer history).

---

## Getting Started

### Prerequisites

- **Node.js** v24.12.0 (see `.nvmrc` -- `nvm use` if you use nvm)
- **npm** (ships with Node)
- A **Northwind API key**

> This project uses **Svelte 4** ([legacy docs](https://svelte.dev/docs/svelte/legacy-overview)).

### Setup

```sh
npm install
```

Create a `.env` file in the project root:

```
NORTHWIND_API_KEY=your_api_key_here
```

### Running

```sh
# Development server
npm run dev

# Development server + open browser
npm run dev -- --open

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Architecture & Design Decisions

### Routing

The app uses SvelteKit's file-based routing with two top-level routes (`/accounts` and `/transfers`) rather than conditional rendering inside a single page. This gives each view its own URL, its own server load function, and independent data fetching -- the accounts page doesn't need to load transfer history, and vice versa. The root route (`/`) redirects to `/accounts`.

### Data Flow

```
Northwind API
     |
     v
Server load functions (+layout.server.ts, +page.server.ts)
     |
     v
Layout component hydrates Svelte stores (accounts, bank, domains)
     |
     v
Components read from stores and page data
```

All API calls live in `*.server.ts` files. This is a hard boundary -- SvelteKit guarantees these modules never ship to the client, which keeps the `NORTHWIND_API_KEY` out of the browser bundle entirely. The API client (`src/lib/api/client.server.ts`) is a thin wrapper around `fetch` that injects the auth header and standardizes error handling.

The root layout load function (`+layout.server.ts`) fetches accounts, bank info, and domain reference data in parallel via `Promise.all`. The layout component then hydrates three writable stores (`accounts`, `bank`, `domains`), making this data available to any component without prop drilling.

### State Management

Svelte stores handle reactive state:

- **`accounts`** (writable): the account list, set from server data
- **`totalBalance`** / **`activeAccountCount`** (derived): computed from `accounts`, automatically recalculate when the account list changes
- **`bank`** (writable): institution info; **`institutionName`** / **`currentRoutingNumber`** (derived)
- **`domains`** (writable): reference data (account types, statuses, transfer types)

After a successful transfer, `invalidateAll()` re-runs all active load functions, which refreshes the stores with current data from the API.

### Custom AccountSelect Dropdown

The transfer form uses a custom dropdown (`AccountSelect.svelte`) instead of a native `<select>` element. A native select can't display the balance alongside each account name, show disabled accounts with explanatory text ("Already selected", "Frozen"), or visually distinguish excluded accounts. The custom component provides:

- Full keyboard navigation (Arrow keys, Enter, Space, Escape, Tab)
- ARIA roles (`combobox`, `listbox`, `option`) and attributes (`aria-expanded`, `aria-activedescendant`, `aria-disabled`)
- Exclusion logic -- the already-selected account in the other field is grayed out and unselectable
- Inactive accounts (Frozen, Closed) displayed but disabled with their status label

### Transfer State Machine

The transfer page manages a four-state lifecycle via a discriminated union type (`ViewState`):

```
   form  ──(submit)──>  submitting  ──(success)──>  success
                             |                         |
                             └──(error)──>  failure    |
                                              |        |
                                              └──(done)┘──>  form
```

- **form**: Transfer form is visible, user fills fields
- **submitting**: Button shows "Transferring...", inputs are disabled
- **success**: Full-page result card with confirmation details, focus moves to heading
- **failure**: Error result card with message, "Back to transfers" button

The submit handler runs a pre-flight validation (`/api/transfers/validate`) before initiating the actual transfer, catching issues like invalid amounts or ineligible accounts before committing.

### Mock Data

The Northwind API doesn't provide endpoints for general account activity (purchases, deposits, interest), so `src/lib/data/mockActivity.ts` supplies static activity items for the accounts page. These are merged with real transfer history (fetched from the API) and sorted by date to create a unified "Recent Activity" feed.

### Account Display Names

The API returns raw `account_type` values like `CHECKING` or `SAVINGS`. A static mapping in `src/lib/utils/accounts.ts` converts these to user-friendly names:

| API Value  | Display Name           |
| ---------- | ---------------------- |
| `CHECKING` | Everyday Checking      |
| `SAVINGS`  | High-Yield Savings     |
| `CD`       | Certificate of Deposit |
| `LOAN`     | Personal Loan          |

---

## Project Structure

```
src/
├── lib/
│   ├── api/                          # Server-only API layer
│   │   ├── client.server.ts          # Base fetch wrapper (auth, error handling)
│   │   ├── accounts.server.ts        # GET /external/accounts
│   │   ├── bank.server.ts            # GET /external/bank
│   │   ├── domains.server.ts         # GET /external/domains
│   │   ├── transfers.server.ts       # Transfers CRUD + in-memory cache
│   │   └── index.ts                  # Re-exports
│   │
│   ├── components/
│   │   ├── accounts/
│   │   │   ├── AccountCard.svelte    # Individual account display
│   │   │   └── TotalBalanceCard.svelte
│   │   ├── shared/
│   │   │   ├── Header.svelte         # Nav bar with active-route highlighting
│   │   │   └── TransactionItem.svelte # Reused in both accounts & transfers
│   │   └── transfers/
│   │       ├── AccountSelect.svelte  # Custom accessible dropdown
│   │       ├── TransferForm.svelte   # Form with validation
│   │       ├── TransferSummary.svelte # Live balance preview
│   │       └── TransferResult.svelte # Success/failure screen
│   │
│   ├── stores/                       # Svelte writable + derived stores
│   │   ├── accounts.ts              # accounts, totalBalance, activeAccountCount
│   │   ├── bank.ts                  # bank, institutionName, currentRoutingNumber
│   │   ├── domains.ts              # domains
│   │   └── index.ts
│   │
│   ├── utils/
│   │   ├── format.ts               # Currency, date, account number formatting
│   │   ├── accounts.ts             # Display name mapping, transferability checks
│   │   └── index.ts
│   │
│   ├── types/index.ts              # All TypeScript interfaces
│   ├── data/mockActivity.ts        # Static activity data (no API endpoint)
│   ├── styles/
│   │   ├── tokens.css              # Design tokens (colors, spacing, typography)
│   │   └── reset.css               # CSS reset
│   └── assets/                     # SVG icons and logo
│
├── routes/
│   ├── +layout.server.ts           # Root data loader (accounts, bank, domains)
│   ├── +layout.svelte              # App shell, hydrates stores
│   ├── +error.svelte               # Custom error page (404, 500, etc.)
│   ├── +page.ts                    # Redirects / → /accounts
│   ├── accounts/
│   │   ├── +page.server.ts         # Loads transfer history for activity feed
│   │   └── +page.svelte            # Accounts view
│   ├── transfers/
│   │   ├── +page.server.ts         # Loads transfer list
│   │   └── +page.svelte            # Transfers view (form + history)
│   └── api/transfers/
│       ├── +server.ts              # POST proxy → initiate transfer
│       └── validate/+server.ts     # POST proxy → validate transfer
│
├── __mocks__/                      # Test mocks for SvelteKit virtual modules
│   ├── env.ts                      # $env/static/private
│   └── app-stores.ts              # $app/stores (writable page and navigating stores)
│
└── test-setup.ts                   # Vitest setup (jest-dom matchers)
```

---

## Testing

### Running Tests

```sh
# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage report
npm run test:coverage
```

### Stack

- **Vitest 2.x** -- test runner
- **@testing-library/svelte v5** -- component rendering and queries
- **jsdom** -- browser environment
- **@vitest/coverage-v8** -- code coverage

### Current Coverage

**21 test files, 166 tests, all passing.** Coverage spans utilities, stores, API layer, route loaders, and components.

| Layer      | Files                                                                          |
| ---------- | ------------------------------------------------------------------------------ |
| Utilities  | `format.test.ts` (20), `accounts.test.ts` (16)                                |
| Stores     | `accounts.test.ts` (10), `bank.test.ts` (4), `domains.test.ts` (2)            |
| API        | `client.server.test.ts` (10), `transfers.server.test.ts` (6)                  |
| Routes     | `layout.server` (4), `accounts/page.server` (5), `transfers/page.server` (3), `error` (6) |
| API routes | `api/transfers/server` (4), `api/transfers/validate/server` (4)               |
| Components | `AccountSelect` (18), `TransferForm` (15), `TransferResult` (10), `TransferSummary` (7), `AccountCard` (7), `Header` (6), `TransactionItem` (5), `TotalBalanceCard` (4) |

### Notable Testing Patterns

**Separate `vitest.config.ts`**: The test config uses the `svelte()` Vite plugin rather than `sveltekit()`. The SvelteKit plugin transforms files in a way that prevents `describe`/`it` blocks from registering with Vitest, so a dedicated config is necessary.

**SvelteKit virtual module mocks**: Modules like `$env/static/private` and `$app/stores` don't exist on disk -- they're provided by SvelteKit at build time. The Vitest config aliases these to mock files in `src/__mocks__/`:

```ts
// vitest.config.ts
resolve: {
  alias: {
    '$env/static/private': path.resolve('./src/__mocks__/env.ts'),
    '$app/stores': path.resolve('./src/__mocks__/app-stores.ts')
  }
}
```

The `$app/stores` mock exposes writable `page` and `navigating` stores. Tests can call `page.set(...)` to simulate different route and error states (used for testing `Header`'s active-link behavior and the `+error.svelte` status headings).

---

## Accessibility

- **Semantic HTML**: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<dl>`/`<dt>`/`<dd>` used throughout instead of generic `<div>`s
- **ARIA attributes**: `aria-current="page"` on active nav links, `role="combobox"`/`"listbox"`/`"option"` on the custom dropdown, `role="alert"` on error messages, `aria-expanded`/`aria-activedescendant` for dropdown state
- **Keyboard navigation**: AccountSelect supports Arrow keys, Enter, Space, Escape, and Tab. Focus returns to the trigger after selection or dismissal
- **Focus management**: On the transfer result screen, focus is programmatically moved to the heading (`tabindex="-1"` + `focus()`) so screen readers announce the outcome immediately
- **Visible focus styles**: All interactive elements (buttons, links, inputs, the custom dropdown trigger) have `:focus-visible` outlines with consistent `2px solid` styling and `outline-offset`
- **Distinct labels**: The amount input uses its own "Amount" label rather than sharing the "Transfer to" label with the destination dropdown *<strong>as is erroneously shown in the design</strong>*, ensuring each form control has a unique accessible name
- **Decorative images**: Icon images in transaction items use `alt=""` and `aria-hidden="true"` to avoid cluttering screen reader output

---

## API Quirks & Workarounds

Two behaviors in the Northwind API required workarounds at the application level.

### Incorrect Response Data on Transfer Initiation

A successful POST to `/external/transfers/initiate` returns a `source_account` with empty `account_number` and `account_holder_name` fields. It also appears to swap the source and destination routing numbers. The app patches this at the API boundary (`/api/transfers/+server.ts`) by overlaying the correct data from the original request onto the response before returning it to the client.

Additionally, the server caches the correct account data in memory (keyed by `transfer_id`) so that the transfer history list can display accurate values for any transfer the app initiated during the current session.  
*Note: the cache resets on server restart, so older transfers will still fall back to "Unknown"*.  


### Incorrect Account Data in Transfer History

The GET transfers list returns incorrect `source_account` and `destination_account` objects for any transfer submitted via the API. To work around this, the transfer description is set to a structured format when submitting:

```
Internal Transfer | from: <account_number> | to: <account_number>
```

On both the transfers page and accounts activity feed, if a transfer's description starts with `"Internal Transfer |"`, the app parses account numbers from the description string and resolves display names from the local account data rather than relying on the (incorrect) account objects in the response.

### Unreferenced Design Token

`--input-focus-outline` in `tokens.css` references `var(--focus-border-size)` and `var(--focus-border-ci)`, which are never defined in the token file. The token itself is unused by any component (all components define their own `:focus-visible` styles), so it resolves to a broken value. Left as-is since the tokens file was provided, but flagging it here.

---

## Trade-offs & What I'd Improve

- **End-to-end tests**: The test suite covers units and components but doesn't exercise full user flows. Playwright tests for the transfer lifecycle (fill form, submit, verify result screen, check history) would catch integration issues.
- **Error boundaries**: Route-level errors are caught by `src/routes/+error.svelte`, which renders a branded card with the HTTP status and message. Inline load errors (e.g., failed account fetch) still show banners rather than throwing — a future improvement could convert those to proper `error()` throws so they route through the same boundary.
- **Loading states**: The accounts activity feed uses SvelteKit streaming (`{#await data.transfers}`) to show a skeleton while transfer history loads, and a navigation bar appears during page transitions. The initial render still blocks on the layout load (accounts, bank, domains) — streaming those too would require reworking the store hydration pattern.
- **Transfer amount validation**: The current implementation validates against the displayed balance, but doesn't account for pending transfers that may have reduced the actual available balance.
- **In-memory cache**: The transfer account data cache in `transfers.server.ts` lives in server memory. This is acceptable for a single-server dev environment where the workaround exists solely to patch incorrect API responses — production use would require a shared store (Redis, database) or a corrected API.
- **Animation and transitions**: State changes (form to result, dropdown open/close) happen instantly. Svelte's built-in transitions would make these feel more polished.

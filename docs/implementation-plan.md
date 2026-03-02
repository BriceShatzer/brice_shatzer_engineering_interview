# NorthWind Banking App - Implementation Plan

## Context
This is Array's paid frontend interview exercise. We need to build a SvelteKit app (Svelte 4) with two views - **Accounts** and **Balance Transfer** - using the Northwind Bank API, matching the provided Figma designs. The project has a 48-hour deadline starting 3/2/2026 at 8 AM.

## Architecture Decisions

- **Navigation**: SvelteKit file-based routes (`/accounts`, `/transfers`) with shared layout. More idiomatic than conditional rendering and demonstrates SvelteKit competency.
- **State**: Svelte writable stores for shared account data across views.
- **API key**: Environment variable (`NORTHWIND_API_KEY`) in `.env`, accessed via `$env/static/private`. All API calls go through SvelteKit server load functions (`+page.server.ts`) or API routes (`src/routes/api/`), keeping the key out of the client bundle entirely. Transfer submission goes through a SvelteKit form action or server API route.
- **Mock data**: "Recent Activity" and "Recent Transfers" sections have no matching API endpoint - use documented mock data per instructions.
- **Account display names**: The API returns `account_type` (CHECKING/SAVINGS/CD/LOAN) but the Figma shows friendly names like "Everyday Checking". We'll derive display names from the account type. Document this mapping in the README.

## File Structure

```
src/
  lib/
    types/
      index.ts                    # All TS interfaces (AccountSummary, TransferRequest, etc.)
    api/
      client.server.ts            # Server-only fetch wrapper (base URL + auth from $env)
      accounts.server.ts          # fetchAccounts() - server only
      transfers.server.ts         # initiateTransfer() - server only
    stores/
      accounts.ts                 # Writable store + loadAccounts() + derived totalBalance
    components/
      Header.svelte               # Logo + Accounts/Transfers nav tabs
      TotalBalanceCard.svelte     # Blue gradient balance banner
      AccountCard.svelte          # Single account row in list
      ActivityItem.svelte         # Single recent activity row
      AccountSelect.svelte        # Custom dropdown for account picking
      TransferForm.svelte         # Transfer form (dropdowns + amount + validation)
      TransferSummary.svelte      # Right-side summary showing projected balances
      TransferResult.svelte       # Success/failure full-screen card
    data/
      mockActivity.ts             # Mock recent activity items
      mockTransfers.ts            # Mock recent transfer items
    utils/
      format.ts                   # Currency formatting, account number masking, dates
      accounts.ts                 # Display name mapping, isTransferable check
    assets/                       # (existing SVGs)
    styles/                       # (existing tokens.css, reset.css)
  routes/
    +layout.svelte                # Shared layout: gray bg, white card container, Header
    +layout.server.ts             # Server-side load: fetch accounts (shared across views)
    +page.ts                      # Redirect / -> /accounts
    accounts/
      +page.svelte                # Accounts view
    transfers/
      +page.svelte                # Transfers view (form + success/failure states)
      +page.server.ts             # Form action for transfer submission
    api/transfers/
      +server.ts                  # POST endpoint for transfer (alternative to form action)
```

## Implementation Steps

### Step 1: Foundation - Types & API Layer
**Files**: `src/lib/types/index.ts`, `src/lib/api/client.server.ts`, `src/lib/api/accounts.server.ts`, `src/lib/api/transfers.server.ts`

Define TypeScript interfaces matching the API swagger spec:
- `AccountSummary`, `AccountsResponse`, `PaginationInfo`
- `TransferRequest`, `TransferAccountInfo`, `TransferStatusResponse`
- `ApiError` for error responses
- `ActivityItem`, `RecentTransfer` for mock data shapes

API client (`*.server.ts` files - server-only): typed fetch wrapper using `NORTHWIND_API_KEY` from `$env/static/private`. Base URL: `https://northwind.dev.array.io`. Explicit error handling that parses error response bodies. These files can only be imported in server contexts (`+page.server.ts`, `+server.ts`, `+layout.server.ts`).

Create `.env` file:
```
NORTHWIND_API_KEY=REDACTED_API_KEY
```

### Step 2: Utilities
**Files**: `src/lib/utils/format.ts`, `src/lib/utils/accounts.ts`

- `formatCurrency(amount)` - Intl.NumberFormat USD formatting
- `maskAccountNumber(num)` - returns `****XXXX` (last 4 chars)
- `getDisplayName(account)` - maps CHECKING->"Everyday Checking", SAVINGS->"High-Yield Savings", CD->"Certificate of Deposit", LOAN->"Personal Loan"
- `isTransferable(account)` - returns true only if ACTIVE status and positive balance
- `formatAccountLabel(name, number)` - "Everyday Checking...8821" format

### Step 3: Store & Data Flow
**File**: `src/lib/stores/accounts.ts`

Data flows server -> client via SvelteKit's load functions:
- `+layout.server.ts` fetches accounts via `fetchAccounts()` and returns them as page data
- Client components receive accounts via `export let data` (page data) in the layout/pages
- `accountsStore`: writable store initialized from page data, used for client-side reactivity (e.g., updating balances after transfer without full page reload)
- `totalBalance`: derived store summing active account balances
- `activeAccountCount`: derived store
- After a successful transfer, call `invalidateAll()` to re-run the server load and refresh balances

### Step 4: Mock Data
**Files**: `src/lib/data/mockActivity.ts`, `src/lib/data/mockTransfers.ts`

Match the Figma exactly:
- Activity: Grocery Store (-$82.45), Salary Deposit (+$2,800), Coffee Shop (-$5.75), Interest Payment (+$5.24), Transfer to Savings (-$250)
- Transfers: To High-Yield Savings (-$250), To Everyday Checking (+$150), To Rewards Credit (+$430.12)

Use existing SVG assets (shopping-cart, money-bag, hot-beverage, bank) for icons.

### Step 5: Layout & Header
**Files**: `src/routes/+layout.svelte`, `src/routes/+page.ts`, `src/lib/components/Header.svelte`

- Layout: light gray page background, centered white card container (max-width ~1200px, rounded corners, shadow)
- Header: NorthWind logo (from `logo.svg`) + nav with Accounts/Transfers links. Active tab = blue, uses `aria-current="page"`.
- Root page redirects to `/accounts`

### Step 6: Accounts View
**Files**: `src/routes/accounts/+page.svelte`, `src/lib/components/TotalBalanceCard.svelte`, `src/lib/components/AccountCard.svelte`, `src/lib/components/ActivityItem.svelte`

Layout per Figma:
- **Desktop**: Two-column grid (~55% / 45%)
- **Mobile** (< 768px): Single column, stacked

Left column:
- `TotalBalanceCard`: Blue gradient background, large dollar amount, "Across N accounts"
- "Your accounts" heading
- List of `AccountCard` components showing: display name + balance, masked account number + type badge + status

Right column:
- "Recent Activity" card with mock data `ActivityItem` list

States: loading spinner, error banner with retry, populated view.

### Step 7: Transfer View - Form
**Files**: `src/routes/transfers/+page.svelte`, `src/lib/components/TransferForm.svelte`, `src/lib/components/AccountSelect.svelte`, `src/lib/components/TransferSummary.svelte`

Transfer page uses a state machine:
```
'form' -> 'submitting' -> 'success' | 'failure' -> 'form'
```

**AccountSelect** (custom dropdown):
- Button trigger showing "Choose account" (empty) or selected account info
- Dropdown list of all accounts; FROZEN/CLOSED accounts shown but visually disabled/not selectable
- Exclude already-selected account from the other dropdown
- ARIA: `role="listbox"`, `role="option"`, `aria-expanded`, keyboard nav

**TransferForm** validation (frontend, before API call):
- Source and destination must be selected
- Cannot transfer to same account
- Amount must be > 0
- Amount cannot exceed source account available balance
- Both accounts must be ACTIVE

**TransferSummary** (right side):
- Empty state: "From: - / To: -"
- Filled: Shows projected new balances after transfer

**Submit flow**:
1. Build `TransferRequest` (direction: OUTBOUND, transfer_type: ACH, institution_name: "Northwind Bank", generate reference_number)
2. POST to `/api/transfers` (SvelteKit server route that proxies to the Northwind API)
3. Success -> show TransferResult success, then `invalidateAll()` to refresh account balances from server
4. Failure -> show TransferResult failure with API error message

### Step 8: Transfer Result Screens
**File**: `src/lib/components/TransferResult.svelte`

- **Success**: Green checkmark circle, "Transfer Successful", details table (Amount, From, To, Date, Confirmation #), "Done" button -> resets to form
- **Failure**: Red X circle, "Transfer Failed", error message, "Back to transfers" button -> resets to form

Full-screen centered card (replaces the two-column layout).

### Step 9: Accessibility & Polish
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<section>`, proper headings hierarchy
- All form controls labeled (`<label for>`)
- Visible focus styles using `var(--input-focus-outline)` from tokens
- Color is never the only indicator (negative amounts have "-" sign + red color)
- Error messages use `role="alert"`
- `aria-current="page"` on active nav link
- Keyboard-navigable AccountSelect dropdown

### Step 10: README Updates
Document:
- How to run (npm install, add .env with API key, npm run dev)
- Assumptions: account display names derived from type, mock data for activity/transfers
- Trade-offs: custom dropdown vs native select, routes vs conditional rendering
- What I'd improve with more time

## Key Existing Files to Reuse
- `src/lib/styles/tokens.css` - All CSS variables for colors, spacing, typography, forms
- `src/lib/styles/reset.css` - CSS reset
- `src/lib/components/ComponentWrapper.svelte` - Card wrapper (border, radius, padding)
- `src/lib/assets/logo.svg` - NorthWind logo for header
- `src/lib/assets/bank.svg`, `shopping-cart.svg`, `money-bag.svg`, `hot-beverage.svg` - Activity icons

## Verification
1. `npm run dev` - app runs without errors
2. Navigate to `/` - redirects to `/accounts`
3. Accounts view: accounts load from API via server, display correctly with balances
4. Accounts view: FROZEN account (Michael Davis) visually distinguished
5. Navigate to `/transfers` - form renders, dropdowns populate with accounts
6. FROZEN accounts shown but disabled in dropdowns
7. Select accounts, enter amount - transfer summary updates in real-time
8. Submit invalid transfer (amount > balance) - frontend validation prevents submission
9. Submit valid transfer - success screen shows with confirmation details
10. "Done" button returns to form, account balances are refreshed
11. Simulate API failure - failure screen shows with error message and "Back to transfers" button
12. Resize browser - responsive layout switches at 768px breakpoint
13. `npm run check` - no TypeScript errors
14. `npm run lint` - no lint errors
15. Keyboard-only navigation works for all interactive elements

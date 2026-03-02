# NorthWind Banking App

A SvelteKit application built for the Array frontend interview exercise, featuring an Accounts view and a Balance Transfer view powered by the Northwind Bank API.

## Getting Started

### Prerequisites

- Node.js v24.12.0 (see `.nvmrc`)
- This project uses **Svelte v4** ([legacy docs](https://svelte.dev/docs/svelte/legacy-overview))

### Setup

1. Install dependencies:

```sh
npm install
```

2. Create a `.env` file in the project root with your API key:

```
NORTHWIND_API_KEY=your_api_key_here
```

3. Start the development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Building

```sh
npm run build
```

Preview the production build with `npm run preview`.

## Architecture

### Routing

The app uses SvelteKit's file-based routing with two views:

- `/accounts` - Displays all bank accounts with balances and recent activity
- `/transfers` - Transfer form with validation, summary, and result screens
- `/` redirects to `/accounts`

### API & Security

All API calls are made server-side through SvelteKit server load functions and API routes. The API key is stored in `.env` and accessed via `$env/static/private`, ensuring it never reaches the client bundle.

- `src/lib/api/client.server.ts` - Typed fetch wrapper with auth
- `src/routes/+layout.server.ts` - Fetches accounts on page load
- `src/routes/api/transfers/+server.ts` - Proxies transfer requests to the Northwind API

### State Management

- Account data flows from server load functions into a Svelte writable store (`src/lib/stores/accounts.ts`)
- Derived stores compute `totalBalance` and `activeAccountCount`
- After a successful transfer, `invalidateAll()` re-fetches accounts from the server to reflect updated balances

### Component Structure

```
Header.svelte              - Logo + nav tabs
TotalBalanceCard.svelte    - Blue gradient balance summary
AccountCard.svelte         - Individual account row
ActivityItem.svelte        - Recent activity row
AccountSelect.svelte       - Custom accessible dropdown for account selection
TransferForm.svelte        - Transfer form with validation
TransferSummary.svelte     - Real-time transfer impact preview
TransferResult.svelte      - Success/failure result screens
RecentTransferItem.svelte  - Recent transfer row
```

## Assumptions & Mock Data

### Account Display Names

The API returns generic `account_type` values (CHECKING, SAVINGS, CD, LOAN) rather than the friendly names shown in the Figma design (e.g., "Everyday Checking", "High-Yield Savings"). I derive display names from the account type using a simple mapping in `src/lib/utils/accounts.ts`:

- `CHECKING` -> "Everyday Checking"
- `SAVINGS` -> "High-Yield Savings"
- `CD` -> "Certificate of Deposit"
- `LOAN` -> "Personal Loan"

### Mock Data

The following UI sections use mock data because no corresponding API endpoint exists:

- **Recent Activity** (`src/lib/data/mockActivity.ts`) - The transaction history shown on the Accounts view
- **Recent Transfers** (`src/lib/data/mockTransfers.ts`) - The transfer history shown on the Transfers view

Mock data matches the items shown in the Figma design.

## Trade-offs

- **Custom dropdown vs native `<select>`**: Used a custom `AccountSelect` component to match the Figma design (showing account name, masked number, and balance in the dropdown). Includes keyboard navigation, ARIA roles, and focus management for accessibility.
- **SvelteKit routes vs conditional rendering**: Chose file-based routes for URL-addressable views and idiomatic SvelteKit usage. The instructions noted either approach was acceptable.
- **Transfer amount field label**: The Figma labels the amount input as "Transfer to" (appearing to be a design inconsistency). I kept the Figma label for visual fidelity.

## What I'd Improve With More Time

- Add loading skeleton states instead of empty content while accounts fetch
- Add unit tests for utility functions and component behavior
- Implement account number masking toggle (show/hide full number)
- Add transition animations between form/success/failure states
- Add more thorough form validation feedback (inline as-you-type)
- Implement the "Recent Activity" and "Recent Transfers" from real API data if an appropriate endpoint were available
- Add error boundary components for more graceful error recovery
- Responsive refinements for intermediate breakpoints (tablet)

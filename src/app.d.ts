// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { AccountSummary, BankResponse, DomainsResponse } from '$lib/types';

declare global {
	namespace App {
		interface Error {
			message: string;
		}
		// Layout load always provides these fields; page-specific data is merged in by SvelteKit.
		interface PageData {
			accounts: AccountSummary[];
			bank: BankResponse | null;
			domains: DomainsResponse | null;
			error?: string;
		}
		// interface Locals {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

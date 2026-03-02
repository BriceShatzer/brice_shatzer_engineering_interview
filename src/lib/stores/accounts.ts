import { writable, derived } from 'svelte/store';
import type { AccountSummary } from '$lib/types';

export const accounts = writable<AccountSummary[]>([]);

export const totalBalance = derived(accounts, ($accounts) =>
	$accounts.filter((a) => a.account_status === 'ACTIVE').reduce((sum, a) => sum + a.balance, 0)
);

export const activeAccountCount = derived(
	accounts,
	($accounts) => $accounts.filter((a) => a.account_status === 'ACTIVE').length
);

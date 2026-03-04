import { writable, derived } from 'svelte/store';
import type { BankResponse } from '$lib/types';

export const bank = writable<BankResponse | null>(null);

export const institutionName = derived(bank, ($bank) => $bank?.institution.name ?? 'Northwind Bank');

export const currentRoutingNumber = derived(bank, ($bank) => {
	const current = $bank?.routing_numbers.find((r) => r.status === 'current');
	return current?.routing_number ?? null;
});

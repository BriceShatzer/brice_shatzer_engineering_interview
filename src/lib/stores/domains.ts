import { writable, derived } from 'svelte/store';
import type { DomainsResponse, TransferTypeDomain } from '$lib/types';

export const domains = writable<DomainsResponse | null>(null);

export const accountTypeLabels = derived(domains, ($domains) => {
	if (!$domains) return {};
	return Object.fromEntries($domains.account_types.map((t) => [t.code, t.display_name]));
});

export const accountStatusLabels = derived(domains, ($domains) => {
	if (!$domains) return {};
	return Object.fromEntries($domains.account_statuses.map((s) => [s.code, s.display_name]));
});

export function getTransferTypeInfo(
	domainsData: DomainsResponse | null,
	code: string
): TransferTypeDomain | undefined {
	return domainsData?.transfer_types.find((t) => t.code === code);
}

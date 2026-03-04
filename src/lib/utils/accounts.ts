import type { AccountSummary, AccountType } from '$lib/types';
import { get } from 'svelte/store';
import { domains } from '$lib/stores';

const TYPE_DISPLAY_NAMES: Record<AccountType, string> = {
	CHECKING: 'Everyday Checking',
	SAVINGS: 'High-Yield Savings',
	CD: 'Certificate of Deposit',
	LOAN: 'Personal Loan'
};

export function getDisplayName(account: AccountSummary): string {
	return TYPE_DISPLAY_NAMES[account.account_type] ?? account.account_type;
}

export function getTypeBadgeLabel(type: AccountType): string {
	const domainsData = get(domains);
	const match = domainsData?.account_types.find((t) => t.code === type);
	return match?.display_name ?? type;
}

export function getStatusLabel(status: string): string {
	const domainsData = get(domains);
	const match = domainsData?.account_statuses.find((s) => s.code === status);
	return match?.display_name ?? status.charAt(0) + status.slice(1).toLowerCase();
}

export function isTransferable(account: AccountSummary): boolean {
	return account.account_status === 'ACTIVE' && account.balance > 0;
}

export function isActive(account: AccountSummary): boolean {
	return account.account_status === 'ACTIVE';
}

import type { AccountSummary, AccountType } from '$lib/types';

const TYPE_DISPLAY_NAMES: Record<AccountType, string> = {
	CHECKING: 'Everyday Checking',
	SAVINGS: 'High-Yield Savings',
	CD: 'Certificate of Deposit',
	LOAN: 'Personal Loan'
};

const TYPE_BADGE_LABELS: Record<AccountType, string> = {
	CHECKING: 'Checking',
	SAVINGS: 'Savings',
	CD: 'CD',
	LOAN: 'Loan'
};

export function getDisplayName(account: AccountSummary): string {
	return TYPE_DISPLAY_NAMES[account.account_type] ?? account.account_type;
}

export function getTypeBadgeLabel(type: AccountType): string {
	return TYPE_BADGE_LABELS[type] ?? type;
}

export function isTransferable(account: AccountSummary): boolean {
	return account.account_status === 'ACTIVE' && account.balance > 0;
}

export function isActive(account: AccountSummary): boolean {
	return account.account_status === 'ACTIVE';
}

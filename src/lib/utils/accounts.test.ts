import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { domains } from '$lib/stores';
import {
	getDisplayName,
	getTypeBadgeLabel,
	getStatusLabel,
	isTransferable,
	isActive
} from './accounts';
import type { AccountSummary, DomainsResponse } from '$lib/types';

const baseAccount: AccountSummary = {
	account_id: 'acc-1',
	account_number: '123456789',
	routing_number: '021000021',
	account_type: 'CHECKING',
	account_status: 'ACTIVE',
	account_holder_name: 'Jane Doe',
	balance: 1500,
	currency: 'USD',
	opened_date: '2020-01-01'
};

const mockDomainsData: DomainsResponse = {
	integration_statuses: [],
	account_types: [
		{ code: 'CHECKING', display_name: 'Checking Account', description: '' },
		{ code: 'SAVINGS', display_name: 'Savings Account', description: '' },
		{ code: 'CD', display_name: 'CD Account', description: '' },
		{ code: 'LOAN', display_name: 'Loan Account', description: '' }
	],
	account_statuses: [
		{ code: 'ACTIVE', display_name: 'Active', description: '' },
		{ code: 'FROZEN', display_name: 'Frozen', description: '' },
		{ code: 'CLOSED', display_name: 'Closed', description: '' }
	],
	transaction_types: [],
	transaction_statuses: [],
	transfer_statuses: [],
	transfer_types: [],
	external_transfer_statuses: [],
	directions: []
};

describe('getDisplayName', () => {
	it('should return the friendly name for CHECKING accounts', () => {
		expect(getDisplayName({ ...baseAccount, account_type: 'CHECKING' })).toBe('Everyday Checking');
	});

	it('should return the friendly name for SAVINGS accounts', () => {
		expect(getDisplayName({ ...baseAccount, account_type: 'SAVINGS' })).toBe('High-Yield Savings');
	});

	it('should return the friendly name for CD accounts', () => {
		expect(getDisplayName({ ...baseAccount, account_type: 'CD' })).toBe('Certificate of Deposit');
	});

	it('should return the friendly name for LOAN accounts', () => {
		expect(getDisplayName({ ...baseAccount, account_type: 'LOAN' })).toBe('Personal Loan');
	});
});

describe('getTypeBadgeLabel', () => {
	beforeEach(() => {
		domains.set(null);
	});

	it('should return the domain display name when domains are loaded', () => {
		domains.set(mockDomainsData);
		expect(getTypeBadgeLabel('CHECKING')).toBe('Checking Account');
	});

	it('should fall back to the raw type code when domains are not loaded', () => {
		expect(getTypeBadgeLabel('SAVINGS')).toBe('SAVINGS');
	});
});

describe('getStatusLabel', () => {
	beforeEach(() => {
		domains.set(null);
	});

	it('should return the domain display name for a known status when domains are loaded', () => {
		domains.set(mockDomainsData);
		expect(getStatusLabel('FROZEN')).toBe('Frozen');
	});

	it('should return a title-cased fallback when domains are not loaded', () => {
		expect(getStatusLabel('CLOSED')).toBe('Closed');
	});

	it('should title-case single-word statuses as fallback', () => {
		expect(getStatusLabel('ACTIVE')).toBe('Active');
	});
});

describe('isTransferable', () => {
	it('should return true when an account is ACTIVE and has a positive balance', () => {
		expect(isTransferable({ ...baseAccount, account_status: 'ACTIVE', balance: 100 })).toBe(true);
	});

	it('should return false when an account is FROZEN', () => {
		expect(isTransferable({ ...baseAccount, account_status: 'FROZEN', balance: 100 })).toBe(false);
	});

	it('should return false when balance is zero', () => {
		expect(isTransferable({ ...baseAccount, account_status: 'ACTIVE', balance: 0 })).toBe(false);
	});

	it('should return false when balance is negative', () => {
		expect(isTransferable({ ...baseAccount, account_status: 'ACTIVE', balance: -1 })).toBe(false);
	});
});

describe('isActive', () => {
	it('should return true for ACTIVE accounts', () => {
		expect(isActive({ ...baseAccount, account_status: 'ACTIVE' })).toBe(true);
	});

	it('should return false for FROZEN accounts', () => {
		expect(isActive({ ...baseAccount, account_status: 'FROZEN' })).toBe(false);
	});

	it('should return false for CLOSED accounts', () => {
		expect(isActive({ ...baseAccount, account_status: 'CLOSED' })).toBe(false);
	});
});

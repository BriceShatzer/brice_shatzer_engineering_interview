import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { domains, accountTypeLabels, accountStatusLabels, getTransferTypeInfo } from './domains';
import type { DomainsResponse } from '$lib/types';

const mockDomains: DomainsResponse = {
	integration_statuses: [],
	account_types: [
		{ code: 'CHECKING', display_name: 'Checking Account', description: '' },
		{ code: 'SAVINGS', display_name: 'Savings Account', description: '' }
	],
	account_statuses: [
		{ code: 'ACTIVE', display_name: 'Active', description: '' },
		{ code: 'FROZEN', display_name: 'Frozen', description: '' }
	],
	transaction_types: [],
	transaction_statuses: [],
	transfer_statuses: [],
	transfer_types: [
		{
			code: 'ACH',
			display_name: 'ACH Transfer',
			description: 'Standard ACH',
			processing_days: 3,
			fee: 0,
			min_amount: 1,
			max_amount: 10000,
			is_reversible: true
		}
	],
	external_transfer_statuses: [],
	directions: []
};

describe('domains store', () => {
	beforeEach(() => {
		domains.set(null);
	});

	it('should start as null', () => {
		expect(get(domains)).toBeNull();
	});

	it('should update when set', () => {
		domains.set(mockDomains);
		expect(get(domains)).toEqual(mockDomains);
	});
});

describe('accountTypeLabels derived store', () => {
	beforeEach(() => {
		domains.set(null);
	});

	it('should return an empty object when domains are null', () => {
		expect(get(accountTypeLabels)).toEqual({});
	});

	it('should return a map of code to display_name when domains are loaded', () => {
		domains.set(mockDomains);
		expect(get(accountTypeLabels)).toEqual({
			CHECKING: 'Checking Account',
			SAVINGS: 'Savings Account'
		});
	});
});

describe('accountStatusLabels derived store', () => {
	beforeEach(() => {
		domains.set(null);
	});

	it('should return an empty object when domains are null', () => {
		expect(get(accountStatusLabels)).toEqual({});
	});

	it('should return a map of code to display_name when domains are loaded', () => {
		domains.set(mockDomains);
		expect(get(accountStatusLabels)).toEqual({
			ACTIVE: 'Active',
			FROZEN: 'Frozen'
		});
	});
});

describe('getTransferTypeInfo', () => {
	it('should return undefined when domainsData is null', () => {
		expect(getTransferTypeInfo(null, 'ACH')).toBeUndefined();
	});

	it('should return the matching transfer type by code', () => {
		const result = getTransferTypeInfo(mockDomains, 'ACH');
		expect(result).toBeDefined();
		expect(result?.display_name).toBe('ACH Transfer');
	});

	it('should return undefined for an unknown transfer type code', () => {
		expect(getTransferTypeInfo(mockDomains, 'WIRE')).toBeUndefined();
	});
});

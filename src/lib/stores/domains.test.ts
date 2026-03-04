import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { domains } from './domains';
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

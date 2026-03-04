import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { accounts, totalBalance, activeAccountCount } from './accounts';
import type { AccountSummary } from '$lib/types';

const makeAccount = (overrides: Partial<AccountSummary> = {}): AccountSummary => ({
	account_id: 'acc-1',
	account_number: '111111111',
	routing_number: '021000021',
	account_type: 'CHECKING',
	account_status: 'ACTIVE',
	account_holder_name: 'Jane Doe',
	balance: 1000,
	currency: 'USD',
	opened_date: '2020-01-01',
	...overrides
});

describe('accounts store', () => {
	beforeEach(() => {
		accounts.set([]);
	});

	it('should start empty', () => {
		expect(get(accounts)).toEqual([]);
	});

	it('should update when set', () => {
		const accs = [makeAccount()];
		accounts.set(accs);
		expect(get(accounts)).toEqual(accs);
	});
});

describe('totalBalance derived store', () => {
	beforeEach(() => {
		accounts.set([]);
	});

	it('should return 0 when there are no accounts', () => {
		expect(get(totalBalance)).toBe(0);
	});

	it('should sum balances of all ACTIVE accounts', () => {
		accounts.set([
			makeAccount({ account_id: 'a1', balance: 1000 }),
			makeAccount({ account_id: 'a2', balance: 500 })
		]);
		expect(get(totalBalance)).toBe(1500);
	});

	it('should exclude FROZEN accounts from the total', () => {
		accounts.set([
			makeAccount({ account_id: 'a1', balance: 1000, account_status: 'ACTIVE' }),
			makeAccount({ account_id: 'a2', balance: 500, account_status: 'FROZEN' })
		]);
		expect(get(totalBalance)).toBe(1000);
	});

	it('should exclude CLOSED accounts from the total', () => {
		accounts.set([
			makeAccount({ account_id: 'a1', balance: 1000, account_status: 'ACTIVE' }),
			makeAccount({ account_id: 'a2', balance: 200, account_status: 'CLOSED' })
		]);
		expect(get(totalBalance)).toBe(1000);
	});

	it('should return 0 when all accounts are inactive', () => {
		accounts.set([makeAccount({ account_status: 'FROZEN', balance: 999 })]);
		expect(get(totalBalance)).toBe(0);
	});
});

describe('activeAccountCount derived store', () => {
	beforeEach(() => {
		accounts.set([]);
	});

	it('should return 0 when there are no accounts', () => {
		expect(get(activeAccountCount)).toBe(0);
	});

	it('should count only ACTIVE accounts', () => {
		accounts.set([
			makeAccount({ account_id: 'a1', account_status: 'ACTIVE' }),
			makeAccount({ account_id: 'a2', account_status: 'FROZEN' }),
			makeAccount({ account_id: 'a3', account_status: 'ACTIVE' })
		]);
		expect(get(activeAccountCount)).toBe(2);
	});

	it('should return 0 when all accounts are closed', () => {
		accounts.set([makeAccount({ account_status: 'CLOSED' })]);
		expect(get(activeAccountCount)).toBe(0);
	});
});

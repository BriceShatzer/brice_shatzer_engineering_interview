import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('$lib/api', () => ({
	fetchAccounts: vi.fn(),
	fetchDomains: vi.fn(),
	fetchBank: vi.fn()
}));

import { load } from './+layout.server';
import { fetchAccounts, fetchDomains, fetchBank } from '$lib/api';
const mockFetchAccounts = vi.mocked(fetchAccounts);
const mockFetchDomains = vi.mocked(fetchDomains);
const mockFetchBank = vi.mocked(fetchBank);

const mockAccounts = [
	{
		account_id: 'acc-1',
		account_number: '111111111',
		routing_number: '021000021',
		account_type: 'CHECKING' as const,
		account_status: 'ACTIVE' as const,
		account_holder_name: 'Jane',
		balance: 1000,
		currency: 'USD',
		opened_date: '2020-01-01'
	}
];

const mockDomainsData = {
	account_types: [],
	account_statuses: [],
	transfer_types: [],
	directions: [],
	integration_statuses: [],
	transaction_types: [],
	transaction_statuses: [],
	transfer_statuses: [],
	external_transfer_statuses: []
};
const mockBankData = {
	institution: {
		name: 'Test Bank',
		established: '',
		address: '',
		city: '',
		state: '',
		zip_code: '',
		website: '',
		phone: '',
		email: ''
	},
	routing_numbers: [],
	services: {
		ach_transfers: true,
		wire_transfers: true,
		check_processing: false,
		mobile_banking: true
	},
	business_hours: { customer_service: '', wire_cutoff: '' }
};

describe('layout server load', () => {
	beforeEach(() => {
		mockFetchAccounts.mockReset();
		mockFetchDomains.mockReset();
		mockFetchBank.mockReset();
		vi.spyOn(console, 'error').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should return accounts, domains, and bank data on success', async () => {
		mockFetchAccounts.mockResolvedValue({
			accounts: mockAccounts,
			pagination: { total: 1, page: 1, per_page: 10 }
		});
		mockFetchDomains.mockResolvedValue(mockDomainsData);
		mockFetchBank.mockResolvedValue(mockBankData);

		const result = (await load({} as any)) as Record<string, any>;

		expect(result.accounts).toEqual(mockAccounts);
		expect(result.domains).toEqual(mockDomainsData);
		expect(result.bank).toEqual(mockBankData);
	});

	it('should return null for domains when fetchDomains fails', async () => {
		mockFetchAccounts.mockResolvedValue({
			accounts: mockAccounts,
			pagination: { total: 1, page: 1, per_page: 10 }
		});
		mockFetchDomains.mockRejectedValue(new Error('Network error'));
		mockFetchBank.mockResolvedValue(mockBankData);

		const result = (await load({} as any)) as Record<string, any>;

		expect(result.domains).toBeNull();
		expect(result.accounts).toEqual(mockAccounts);
	});

	it('should return null for bank when fetchBank fails', async () => {
		mockFetchAccounts.mockResolvedValue({
			accounts: mockAccounts,
			pagination: { total: 1, page: 1, per_page: 10 }
		});
		mockFetchDomains.mockResolvedValue(mockDomainsData);
		mockFetchBank.mockRejectedValue(new Error('Network error'));

		const result = (await load({} as any)) as Record<string, any>;

		expect(result.bank).toBeNull();
	});

	it('should return empty accounts array and error message when fetchAccounts fails', async () => {
		mockFetchAccounts.mockRejectedValue(new Error('API down'));
		mockFetchDomains.mockResolvedValue(mockDomainsData);
		mockFetchBank.mockResolvedValue(mockBankData);

		const result = (await load({} as any)) as Record<string, any>;

		expect(result.accounts).toEqual([]);
		expect((result as { error?: string }).error).toBe('API down');
	});
});

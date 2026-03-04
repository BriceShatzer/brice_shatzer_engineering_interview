import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('$lib/api', () => ({
	fetchTransfersByDateRange: vi.fn()
}));

vi.mock('$lib/data/mockActivity', () => ({
	mockActivity: [
		{ id: '1', description: 'Recent', date: '2025-12-14T10:30:00Z', accountName: 'Checking', amount: -10, icon: 'x' },
		{ id: '2', description: 'Middle', date: '2025-12-10T00:00:00Z', accountName: 'Checking', amount: -5, icon: 'x' },
		{ id: '3', description: 'Oldest', date: '2025-12-01T08:00:00Z', accountName: 'Savings', amount: 5, icon: 'x' }
	]
}));

import { load } from './+page.server';
import { fetchTransfersByDateRange } from '$lib/api';

const mockFetch = vi.mocked(fetchTransfersByDateRange);

const mockTransfer = {
	transfer_id: 'txn-1',
	amount: 100,
	currency: 'USD',
	description: 'Internal Transfer',
	transfer_type: 'ACH',
	status: 'COMPLETED',
	direction: 'OUTBOUND',
	reference_number: 'REF-1',
	fee: 0,
	initiated_date: '2025-12-14T00:00:00Z',
	processing_date: '2025-12-15T00:00:00Z',
	expected_completion_date: '2025-12-17T00:00:00Z',
	source_account: { account_number: '111', account_holder_name: 'Jane', institution_name: 'Bank', routing_number: '021' },
	destination_account: { account_number: '222', account_holder_name: 'Jane', institution_name: 'Bank', routing_number: '021' }
};

describe('accounts page server load', () => {
	beforeEach(() => {
		mockFetch.mockReset();
		vi.spyOn(console, 'error').mockImplementation(() => {});
		vi.spyOn(console, 'log').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('returns transfers from the API on success', async () => {
		mockFetch.mockResolvedValue({ transfers: [mockTransfer], pagination: { total: 1, page: 1, per_page: 10 } });

		const result = await load({} as any) as Record<string, any>;

		expect(result.transfers).toHaveLength(1);
		expect(result.transfers[0].transfer_id).toBe('txn-1');
	});

	it('returns empty transfers array on API failure', async () => {
		mockFetch.mockRejectedValue(new Error('Network error'));

		const result = await load({} as any) as Record<string, any>;

		expect(result.transfers).toEqual([]);
	});

	it('calls fetchTransfersByDateRange with the oldest mock activity date as dateFrom', async () => {
		mockFetch.mockResolvedValue({ transfers: [], pagination: { total: 0, page: 1, per_page: 10 } });

		await load({} as any);

		const [dateFrom] = mockFetch.mock.calls[0];
		expect(dateFrom).toBe('2025-12-01');
	});

	it('calls fetchTransfersByDateRange with tomorrow as dateTo', async () => {
		mockFetch.mockResolvedValue({ transfers: [], pagination: { total: 0, page: 1, per_page: 10 } });

		const before = new Date();
		await load({} as any);

		const [, dateTo] = mockFetch.mock.calls[0];
		const tomorrow = new Date();
		tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
		const expectedDate = tomorrow.toISOString().slice(0, 10);

		// Allow for the date being either today's tomorrow or the day after (rare midnight edge case)
		expect(dateTo).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		const dateToMs = new Date(dateTo).getTime();
		const beforeMs = new Date(before.toISOString().slice(0, 10)).getTime();
		expect(dateToMs).toBeGreaterThan(beforeMs);
	});

	it('logs error on API failure', async () => {
		const error = new Error('Something failed');
		mockFetch.mockRejectedValue(error);

		await load({} as any);

		expect(console.error).toHaveBeenCalledWith('Failed to load transfers for activity:', error);
	});
});

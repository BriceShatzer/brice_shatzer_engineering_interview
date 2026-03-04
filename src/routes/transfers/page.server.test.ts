import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('$lib/api', () => ({
	fetchTransfers: vi.fn()
}));

import { load } from './+page.server';
import { fetchTransfers } from '$lib/api';
const mockFetchTransfers = vi.mocked(fetchTransfers);

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
	initiated_date: '2024-12-14T00:00:00Z',
	processing_date: '2024-12-15T00:00:00Z',
	expected_completion_date: '2024-12-17T00:00:00Z',
	source_account: { account_number: '111', account_holder_name: 'Jane', institution_name: 'Bank', routing_number: '021' },
	destination_account: { account_number: '222', account_holder_name: 'Jane', institution_name: 'Bank', routing_number: '021' }
};

describe('transfers page server load', () => {
	beforeEach(() => {
		mockFetchTransfers.mockReset();
	});
	it('should return transfers on success', async () => {
		mockFetchTransfers.mockResolvedValue({
			transfers: [mockTransfer],
			pagination: { total: 1, page: 1, per_page: 10 }
		});

		const result = await load();
		expect(result.transfers).toHaveLength(1);
		expect(result.transfers[0].transfer_id).toBe('txn-1');
	});

	it('should return empty transfers array and error on failure', async () => {
		mockFetchTransfers.mockRejectedValue(new Error('Network error'));

		const result = await load();
		expect(result.transfers).toEqual([]);
		expect((result as { error?: string }).error).toBe('Network error');
	});

	it('should return generic error message for non-Error throws', async () => {
		mockFetchTransfers.mockRejectedValue('string error');

		const result = await load();
		expect((result as { error?: string }).error).toBe('Failed to load transfers');
	});
});


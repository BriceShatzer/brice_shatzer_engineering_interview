import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
	cacheTransferAccountData,
	fetchTransfers,
	initiateTransfer,
	validateTransfer
} from './transfers.server';
import type { TransferAccountDetails, TransferListResponse, TransferRequest } from '$lib/types';

vi.mock('./client.server', () => ({
	apiGet: vi.fn(),
	apiPost: vi.fn(),
	ApiError: class ApiError extends Error {
		status: number;
		code: string;
		constructor(status: number, message: string, code = 'UNKNOWN') {
			super(message);
			this.status = status;
			this.code = code;
		}
	}
}));

import { apiGet, apiPost } from './client.server';
const mockApiGet = vi.mocked(apiGet);
const mockApiPost = vi.mocked(apiPost);

const sourceAccount: TransferAccountDetails = {
	account_number: '111111111',
	account_holder_name: 'Jane Doe',
	institution_name: 'Test Bank',
	routing_number: '021000021'
};

const destinationAccount: TransferAccountDetails = {
	account_number: '222222222',
	account_holder_name: 'Jane Doe',
	institution_name: 'Test Bank',
	routing_number: '021000021'
};

const makeTransfer = (overrides = {}) => ({
	transfer_id: 'txn-1',
	amount: 100,
	currency: 'USD',
	description: 'Internal Transfer | from: 111111111 | to: 222222222',
	transfer_type: 'ACH',
	status: 'PENDING',
	direction: 'OUTBOUND',
	reference_number: 'REF-1',
	fee: 0,
	initiated_date: '2024-12-14T00:00:00Z',
	processing_date: '2024-12-15T00:00:00Z',
	expected_completion_date: '2024-12-17T00:00:00Z',
	source_account: {
		account_number: '',
		account_holder_name: '',
		institution_name: 'API Bank',
		routing_number: '000000000'
	},
	destination_account: {
		account_number: '',
		account_holder_name: '',
		institution_name: 'API Bank',
		routing_number: '000000000'
	},
	...overrides
});

describe('cacheTransferAccountData + fetchTransfers patching', () => {
	beforeEach(() => {
		mockApiGet.mockReset();
		mockApiPost.mockReset();
	});
	it('should patch transfer account data from cache when fetching transfers', async () => {
		const transfer = makeTransfer({ transfer_id: 'txn-patch' });
		const listResponse: TransferListResponse = {
			transfers: [transfer],
			pagination: { total: 1, page: 1, per_page: 10 }
		};
		mockApiGet.mockResolvedValue(listResponse);

		cacheTransferAccountData('txn-patch', sourceAccount, destinationAccount);
		const result = await fetchTransfers();

		expect(result.transfers[0].source_account.account_number).toBe('111111111');
		expect(result.transfers[0].destination_account.account_number).toBe('222222222');
	});

	it('should not patch transfers that are not in the cache', async () => {
		const transfer = makeTransfer({ transfer_id: 'txn-unknown' });
		mockApiGet.mockResolvedValue({
			transfers: [transfer],
			pagination: { total: 1, page: 1, per_page: 10 }
		});

		const result = await fetchTransfers();
		expect(result.transfers[0].source_account.account_number).toBe('');
	});
});

describe('initiateTransfer', () => {
	beforeEach(() => {
		mockApiPost.mockReset();
	});

	it('should call apiPost with the correct path and request body', async () => {
		const request: TransferRequest = {
			amount: 250,
			currency: 'USD',
			description: 'Test transfer',
			direction: 'OUTBOUND',
			reference_number: 'REF-123',
			transfer_type: 'ACH',
			source_account: sourceAccount,
			destination_account: destinationAccount
		};
		mockApiPost.mockResolvedValue({ transfer_id: 'new-txn' });

		await initiateTransfer(request);

		expect(mockApiPost).toHaveBeenCalledWith('/external/transfers/initiate', request);
	});

	it('should return the API response', async () => {
		mockApiPost.mockResolvedValue({ transfer_id: 'new-txn', status: 'PENDING' });
		const result = await initiateTransfer({} as TransferRequest);
		expect(result).toMatchObject({ transfer_id: 'new-txn' });
	});
});

describe('validateTransfer', () => {
	beforeEach(() => {
		mockApiPost.mockReset();
	});

	it('should call apiPost with the validate path', async () => {
		mockApiPost.mockResolvedValue({ validation: { valid: true, issues: [], validation_time: '' } });
		await validateTransfer({} as TransferRequest);
		expect(mockApiPost).toHaveBeenCalledWith('/external/transfers/validate', {});
	});

	it('should return the validation response', async () => {
		const validationResult = {
			validation: {
				valid: false,
				issues: [
					{ field: 'amount', code: 'TOO_LOW', message: 'Too low', severity: 'error' as const }
				],
				validation_time: ''
			}
		};
		mockApiPost.mockResolvedValue(validationResult);
		const result = await validateTransfer({} as TransferRequest);
		expect(result.validation.valid).toBe(false);
	});
});

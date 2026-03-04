import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('$lib/api', () => ({
	initiateTransfer: vi.fn(),
	cacheTransferAccountData: vi.fn(),
	ApiError: class ApiError extends Error {
		status: number;
		code: string;
		constructor(status: number, message: string, code = 'UNKNOWN') {
			super(message);
			this.name = 'ApiError';
			this.status = status;
			this.code = code;
		}
	}
}));

import { POST } from './+server';
import { initiateTransfer, cacheTransferAccountData } from '$lib/api';
const mockInitiateTransfer = vi.mocked(initiateTransfer);
const mockCacheTransferAccountData = vi.mocked(cacheTransferAccountData);

function makeRequest(body: unknown): Request {
	return {
		json: () => Promise.resolve(body)
	} as unknown as Request;
}

const transferRequest = {
	amount: 100,
	currency: 'USD',
	description: 'Internal Transfer | from: 111 | to: 222',
	direction: 'OUTBOUND',
	reference_number: 'REF-1',
	transfer_type: 'ACH',
	source_account: {
		account_number: '111',
		account_holder_name: 'Jane',
		institution_name: 'Bank',
		routing_number: '021'
	},
	destination_account: {
		account_number: '222',
		account_holder_name: 'Jane',
		institution_name: 'Bank',
		routing_number: '021'
	}
};

const apiResponse = {
	transfer_id: 'txn-new',
	status: 'PENDING',
	reference_number: 'REF-1',
	amount: 100,
	currency: 'USD',
	description: 'Internal Transfer',
	direction: 'OUTBOUND',
	transfer_type: 'ACH',
	source_account: {
		account_number: '',
		account_holder_name: '',
		institution_name: 'API Bank',
		routing_number: '000'
	},
	destination_account: {
		account_number: '',
		account_holder_name: '',
		institution_name: 'API Bank',
		routing_number: '000'
	},
	initiated_date: '2024-12-14T00:00:00Z',
	expected_completion_date: '2024-12-17T00:00:00Z',
	fee: 0
};

describe('POST /api/transfers', () => {
	beforeEach(() => {
		mockInitiateTransfer.mockReset();
		mockCacheTransferAccountData.mockReset();
	});
	it('should return 201 with patched account data on success', async () => {
		mockInitiateTransfer.mockResolvedValue({ ...apiResponse });

		const response = await POST({ request: makeRequest(transferRequest) } as never);

		expect(response.status).toBe(201);
		const body = await response.json();
		expect(body.source_account.account_number).toBe('111');
		expect(body.destination_account.account_number).toBe('222');
	});

	it('should call cacheTransferAccountData with the transfer id and account details', async () => {
		mockInitiateTransfer.mockResolvedValue({ ...apiResponse });

		await POST({ request: makeRequest(transferRequest) } as never);

		expect(mockCacheTransferAccountData).toHaveBeenCalledWith(
			'txn-new',
			transferRequest.source_account,
			transferRequest.destination_account
		);
	});

	it('should return the ApiError status and message on ApiError', async () => {
		const ApiErrorClass = (await import('$lib/api')).ApiError;
		mockInitiateTransfer.mockRejectedValue(
			new ApiErrorClass(422, 'Validation failed', 'VALIDATION_ERROR')
		);

		const response = await POST({ request: makeRequest(transferRequest) } as never);

		expect(response.status).toBe(422);
		const body = await response.json();
		expect(body.error.message).toBe('Validation failed');
		expect(body.error.code).toBe('VALIDATION_ERROR');
	});

	it('should return 500 on an unexpected error', async () => {
		mockInitiateTransfer.mockRejectedValue(new Error('Unexpected'));

		const response = await POST({ request: makeRequest(transferRequest) } as never);

		expect(response.status).toBe(500);
		const body = await response.json();
		expect(body.error.message).toBe('Unexpected');
	});
});

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('$lib/api', () => ({
	validateTransfer: vi.fn(),
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
import { validateTransfer } from '$lib/api';
const mockValidateTransfer = vi.mocked(validateTransfer);

function makeRequest(body: unknown): Request {
	return {
		json: () => Promise.resolve(body)
	} as unknown as Request;
}

describe('POST /api/transfers/validate', () => {
	beforeEach(() => {
		mockValidateTransfer.mockReset();
	});

	it('should return 200 with validation result when transfer is valid', async () => {
		const validResult = {
			validation: { valid: true, issues: [], validation_time: '2024-12-14T00:00:00Z' }
		};
		mockValidateTransfer.mockResolvedValue(validResult);

		const response = await POST({ request: makeRequest({}) } as never);

		expect(response.status).toBe(200);
		const body = await response.json();
		expect(body.validation.valid).toBe(true);
	});

	it('should return 200 with validation issues when transfer is invalid', async () => {
		const invalidResult = {
			validation: {
				valid: false,
				issues: [
					{
						field: 'amount',
						code: 'TOO_LOW',
						message: 'Amount too low',
						severity: 'error' as const
					}
				],
				validation_time: '2024-12-14T00:00:00Z'
			}
		};
		mockValidateTransfer.mockResolvedValue(invalidResult);

		const response = await POST({ request: makeRequest({}) } as never);

		expect(response.status).toBe(200);
		const body = await response.json();
		expect(body.validation.valid).toBe(false);
		expect(body.validation.issues).toHaveLength(1);
	});

	it('should return the ApiError status on ApiError', async () => {
		const ApiErrorClass = (await import('$lib/api')).ApiError;
		mockValidateTransfer.mockRejectedValue(new ApiErrorClass(400, 'Bad request', 'BAD_REQUEST'));

		const response = await POST({ request: makeRequest({}) } as never);

		expect(response.status).toBe(400);
		const body = await response.json();
		expect(body.error.message).toBe('Bad request');
	});

	it('should return 500 on an unexpected error', async () => {
		mockValidateTransfer.mockRejectedValue(new Error('Unexpected'));

		const response = await POST({ request: makeRequest({}) } as never);

		expect(response.status).toBe(500);
		const body = await response.json();
		expect(body.error.code).toBe('UNKNOWN');
	});
});

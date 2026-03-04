import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiError, apiGet, apiPost } from './client.server';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

function makeResponse(body: unknown, ok: boolean, status = 200): Response {
	return {
		ok,
		status,
		statusText: ok ? 'OK' : 'Error',
		json: () => Promise.resolve(body)
	} as unknown as Response;
}

describe('ApiError', () => {
	it('should store status, message, and code', () => {
		const err = new ApiError(404, 'Not found', 'NOT_FOUND');
		expect(err.status).toBe(404);
		expect(err.message).toBe('Not found');
		expect(err.code).toBe('NOT_FOUND');
		expect(err.name).toBe('ApiError');
	});

	it('should default code to UNKNOWN when not provided', () => {
		const err = new ApiError(500, 'Server error');
		expect(err.code).toBe('UNKNOWN');
	});

	it('should be an instance of Error', () => {
		expect(new ApiError(400, 'Bad request')).toBeInstanceOf(Error);
	});
});

describe('apiGet', () => {
	beforeEach(() => {
		mockFetch.mockReset();
	});

	it('should call fetch with correct URL and auth header', async () => {
		mockFetch.mockResolvedValue(makeResponse({ data: 'ok' }, true));
		await apiGet('/test');
		expect(mockFetch).toHaveBeenCalledWith(
			'https://northwind.dev.array.io/test',
			expect.objectContaining({
				headers: expect.objectContaining({
					Authorization: 'Bearer test-api-key'
				})
			})
		);
	});

	it('should return parsed JSON on a successful response', async () => {
		mockFetch.mockResolvedValue(makeResponse({ result: 'hello' }, true));
		const data = await apiGet<{ result: string }>('/test');
		expect(data).toEqual({ result: 'hello' });
	});

	it('should throw ApiError with message and code from the response body on failure', async () => {
		mockFetch.mockResolvedValue(
			makeResponse({ error: { message: 'Unauthorized', code: 'AUTH_ERROR' } }, false, 401)
		);
		await expect(apiGet('/test')).rejects.toMatchObject({
			status: 401,
			message: 'Unauthorized',
			code: 'AUTH_ERROR'
		});
	});

	it('should throw ApiError with fallback message when response body has no error field', async () => {
		mockFetch.mockResolvedValue(makeResponse(null, false, 500));
		await expect(apiGet('/test')).rejects.toMatchObject({
			status: 500,
			code: 'UNKNOWN'
		});
	});
});

describe('apiPost', () => {
	beforeEach(() => {
		mockFetch.mockReset();
	});

	it('should call fetch with POST method and serialized body', async () => {
		mockFetch.mockResolvedValue(makeResponse({ id: '1' }, true, 201));
		await apiPost('/transfers', { amount: 100 });
		expect(mockFetch).toHaveBeenCalledWith(
			'https://northwind.dev.array.io/transfers',
			expect.objectContaining({
				method: 'POST',
				body: JSON.stringify({ amount: 100 }),
				headers: expect.objectContaining({ 'Content-Type': 'application/json' })
			})
		);
	});

	it('should return parsed JSON on a successful response', async () => {
		mockFetch.mockResolvedValue(makeResponse({ transfer_id: 'txn-1' }, true, 201));
		const data = await apiPost<{ transfer_id: string }>('/transfers', {});
		expect(data).toEqual({ transfer_id: 'txn-1' });
	});

	it('should throw ApiError with body error details on failure', async () => {
		mockFetch.mockResolvedValue(
			makeResponse({ error: { message: 'Insufficient funds', code: 'FUNDS_ERROR' } }, false, 422)
		);
		await expect(apiPost('/transfers', {})).rejects.toMatchObject({
			status: 422,
			message: 'Insufficient funds',
			code: 'FUNDS_ERROR'
		});
	});
});

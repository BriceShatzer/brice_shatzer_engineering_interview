import { NORTHWIND_API_KEY } from '$env/static/private';

const BASE_URL = 'https://northwind.dev.array.io';

export class ApiError extends Error {
	status: number;
	code: string;

	constructor(status: number, message: string, code: string = 'UNKNOWN') {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.code = code;
	}
}

export async function apiGet<T>(path: string): Promise<T> {
	const response = await fetch(`${BASE_URL}${path}`, {
		headers: {
			Authorization: `Bearer ${NORTHWIND_API_KEY}`,
			'Content-Type': 'application/json'
		}
	});

	if (!response.ok) {
		const body = await response.json().catch(() => null);
		const message = body?.error?.message ?? `API error: ${response.status} ${response.statusText}`;
		const code = body?.error?.code ?? 'UNKNOWN';
		throw new ApiError(response.status, message, code);
	}

	return response.json() as Promise<T>;
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
	const response = await fetch(`${BASE_URL}${path}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${NORTHWIND_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(body)
	});

	if (!response.ok) {
		const errorBody = await response.json().catch(() => null);
		const message =
			errorBody?.error?.message ?? `API error: ${response.status} ${response.statusText}`;
		const code = errorBody?.error?.code ?? 'UNKNOWN';
		throw new ApiError(response.status, message, code);
	}

	return response.json() as Promise<T>;
}

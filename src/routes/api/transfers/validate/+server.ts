import { json } from '@sveltejs/kit';
import { validateTransfer, ApiError } from '$lib/api';
import type { RequestHandler } from './$types';
import type { TransferRequest } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = (await request.json()) as TransferRequest;
		const result = await validateTransfer(body);
		return json(result);
	} catch (e) {
		if (e instanceof ApiError) {
			return json({ error: { message: e.message, code: e.code } }, { status: e.status });
		}
		const message = e instanceof Error ? e.message : 'Validation failed';
		return json({ error: { message, code: 'UNKNOWN' } }, { status: 500 });
	}
};

import { json } from '@sveltejs/kit';
import { initiateTransfer } from '$lib/api/transfers.server';
import { ApiError } from '$lib/api/client.server';
import type { RequestHandler } from './$types';
import type { TransferRequest } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = (await request.json()) as TransferRequest;
		const result = await initiateTransfer(body);
		return json(result, { status: 201 });
	} catch (e) {
		if (e instanceof ApiError) {
			return json({ error: { message: e.message, code: e.code } }, { status: e.status });
		}
		const message = e instanceof Error ? e.message : 'Transfer failed';
		return json({ error: { message, code: 'UNKNOWN' } }, { status: 500 });
	}
};

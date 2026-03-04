import { json } from '@sveltejs/kit';
import { cacheTransferAccountData, initiateTransfer, ApiError } from '$lib/api';
import type { RequestHandler } from './$types';
import type { TransferRequest } from '$lib/types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = (await request.json()) as TransferRequest;
		const result = await initiateTransfer(body);
		// The API returns incomplete account data (empty account_number/account_holder_name)
		// and swaps source/destination routing numbers. Patch with correct data from the original request.
		result.source_account = { ...result.source_account, ...body.source_account };
		result.destination_account = { ...result.destination_account, ...body.destination_account };
		cacheTransferAccountData(result.transfer_id, body.source_account, body.destination_account);
		return json(result, { status: 201 });
	} catch (e) {
		if (e instanceof ApiError) {
			return json({ error: { message: e.message, code: e.code } }, { status: e.status });
		}
		const message = e instanceof Error ? e.message : 'Transfer failed';
		return json({ error: { message, code: 'UNKNOWN' } }, { status: 500 });
	}
};

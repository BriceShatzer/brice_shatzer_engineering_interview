import { json } from '@sveltejs/kit';
import { initiateTransfer } from '$lib/api/transfers.server';
import { fetchAccounts } from '$lib/api/accounts.server';
import { ApiError } from '$lib/api/client.server';
import { getDisplayName } from '$lib/utils/accounts';
import type { RequestHandler } from './$types';
import type { TransferRequest } from '$lib/types';

interface TransferPayload {
	source_account_id: string;
	destination_account_id: string;
	amount: number;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { source_account_id, destination_account_id, amount } =
			(await request.json()) as TransferPayload;

		const { accounts } = await fetchAccounts();
		const source = accounts.find((a) => a.account_id === source_account_id);
		const destination = accounts.find((a) => a.account_id === destination_account_id);

		if (!source || !destination) {
			return json({ error: { message: 'Account not found', code: 'NOT_FOUND' } }, { status: 404 });
		}

		const transferRequest: TransferRequest = {
			amount,
			currency: 'USD',
			description: `Transfer from ${getDisplayName(source)} to ${getDisplayName(destination)}`,
			direction: 'OUTBOUND',
			transfer_type: 'ACH',
			reference_number: `REF-${Date.now()}`,
			source_account: {
				account_number: source.account_number,
				account_holder_name: source.account_holder_name,
				institution_name: 'Northwind Bank',
				routing_number: source.routing_number
			},
			destination_account: {
				account_number: destination.account_number,
				account_holder_name: destination.account_holder_name,
				institution_name: 'Northwind Bank',
				routing_number: destination.routing_number
			}
		};

		const result = await initiateTransfer(transferRequest);
		return json(result, { status: 201 });
	} catch (e) {
		if (e instanceof ApiError) {
			return json({ error: { message: e.message, code: e.code } }, { status: e.status });
		}
		const message = e instanceof Error ? e.message : 'Transfer failed';
		return json({ error: { message, code: 'UNKNOWN' } }, { status: 500 });
	}
};

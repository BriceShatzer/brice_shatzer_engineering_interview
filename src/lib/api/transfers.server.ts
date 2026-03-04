import { apiGet, apiPost } from './client.server';
import type {
	TransferAccountDetails,
	TransferListResponse,
	TransferRequest,
	TransferStatusResponse,
	ValidationResponse
} from '$lib/types';

// Cache of correct account data from transfers we initiate, keyed by transfer_id.
// Used to patch incomplete data returned by the API when fetching transfer history.
const accountDataCache = new Map<
	string,
	{ source_account: TransferAccountDetails; destination_account: TransferAccountDetails }
>();

export function cacheTransferAccountData(
	transferId: string,
	source: TransferAccountDetails,
	destination: TransferAccountDetails
) {
	accountDataCache.set(transferId, {
		source_account: source,
		destination_account: destination
	});
}

export async function fetchTransfersByDateRange(
	dateFrom: string,
	dateTo: string
): Promise<TransferListResponse> {
	const params = new URLSearchParams({ page: '1', per_page: '20', date_from: dateFrom, date_to: dateTo });
	return apiGet<TransferListResponse>(`/external/transfers?${params.toString()}`);
}

export async function fetchTransfers(): Promise<TransferListResponse> {
	const data = await apiGet<TransferListResponse>('/external/transfers');

	for (const transfer of data.transfers) {
		const cached = accountDataCache.get(transfer.transfer_id);
		if (cached) {
			transfer.source_account = { ...transfer.source_account, ...cached.source_account };
			transfer.destination_account = {
				...transfer.destination_account,
				...cached.destination_account
			};
		}
	}

	return data;
}

export function initiateTransfer(request: TransferRequest): Promise<TransferStatusResponse> {
	return apiPost<TransferStatusResponse>('/external/transfers/initiate', request);
}

export function validateTransfer(request: TransferRequest): Promise<ValidationResponse> {
	return apiPost<ValidationResponse>('/external/transfers/validate', request);
}

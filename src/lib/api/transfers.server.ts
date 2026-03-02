import { apiGet, apiPost } from './client.server';
import type { TransferListResponse, TransferRequest, TransferStatusResponse } from '$lib/types';

export function fetchTransfers(): Promise<TransferListResponse> {
	return apiGet<TransferListResponse>('/external/transfers');
}

export function initiateTransfer(request: TransferRequest): Promise<TransferStatusResponse> {
	return apiPost<TransferStatusResponse>('/external/transfers/initiate', request);
}

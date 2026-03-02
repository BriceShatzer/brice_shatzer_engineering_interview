import { apiPost } from './client.server';
import type { TransferRequest, TransferStatusResponse } from '$lib/types';

export function initiateTransfer(request: TransferRequest): Promise<TransferStatusResponse> {
	return apiPost<TransferStatusResponse>('/external/transfers/initiate', request);
}

import { apiGet } from './client.server';
import type { BankResponse } from '$lib/types';

export function fetchBank(): Promise<BankResponse> {
	return apiGet<BankResponse>('/bank');
}

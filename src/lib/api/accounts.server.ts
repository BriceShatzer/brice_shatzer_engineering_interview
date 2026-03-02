import { apiGet } from './client.server';
import type { AccountsResponse } from '$lib/types';

export function fetchAccounts(): Promise<AccountsResponse> {
	return apiGet<AccountsResponse>('/external/accounts');
}

import { apiGet } from './client.server';
import type { DomainsResponse } from '$lib/types';

export function fetchDomains(): Promise<DomainsResponse> {
	return apiGet<DomainsResponse>('/domains');
}

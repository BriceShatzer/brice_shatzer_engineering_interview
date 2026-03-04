import { fetchTransfers } from '$lib/api';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	try {
		const data = await fetchTransfers();
		return {
			transfers: data.transfers
		};
	} catch (e) {
		console.error('Failed to load transfers:', e);
		return {
			transfers: [],
			error: e instanceof Error ? e.message : 'Failed to load transfers'
		};
	}
};

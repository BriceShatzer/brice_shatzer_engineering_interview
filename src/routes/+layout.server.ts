import { fetchAccounts } from '$lib/api/accounts.server';
import { maskAccountNumber } from '$lib/utils/format';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	try {
		const data = await fetchAccounts();
		return {
			accounts: data.accounts.map((account) => ({
				...account,
				account_number: maskAccountNumber(account.account_number)
			}))
		};
	} catch (e) {
		console.error('Failed to load accounts:', e);
		return {
			accounts: [],
			error: e instanceof Error ? e.message : 'Failed to load accounts'
		};
	}
};

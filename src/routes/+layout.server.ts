import { fetchAccounts } from '$lib/api/accounts.server';
import { fetchBank } from '$lib/api/bank.server';
import { fetchDomains } from '$lib/api/domains.server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	try {
		const [accountsData, domainsData, bankData] = await Promise.all([
			fetchAccounts(),
			fetchDomains().catch((e) => {
				console.error('Failed to load domains:', e);
				return null;
			}),
			fetchBank().catch((e) => {
				console.error('Failed to load bank:', e);
				return null;
			})
		]);

		return {
			accounts: accountsData.accounts,
			domains: domainsData,
			bank: bankData
		};
	} catch (e) {
		console.error('Failed to load accounts:', e);
		return {
			accounts: [],
			domains: null,
			bank: null,
			error: e instanceof Error ? e.message : 'Failed to load accounts'
		};
	}
};

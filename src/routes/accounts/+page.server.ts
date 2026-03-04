import { fetchTransfersByDateRange } from '$lib/api';
import { mockActivity } from '$lib/data/mockActivity';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = () => {
	const oldestDate = mockActivity.reduce((oldest, item) =>
		new Date(item.date) < new Date(oldest) ? item.date : oldest,
		mockActivity[0].date
	);

	const dateFrom = oldestDate.slice(0, 10);
	const tomorrow = new Date();
	tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
	const dateTo = tomorrow.toISOString().slice(0, 10);

	const transfers = fetchTransfersByDateRange(dateFrom, dateTo)
		.then((data) => data.transfers)
		.catch((e) => {
			console.error('Failed to load transfers for activity:', e);
			return [];
		});

	return { transfers };
};

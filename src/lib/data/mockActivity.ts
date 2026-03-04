import type { ActivityItem } from '$lib/types';

export const mockActivity: ActivityItem[] = [
	{
		id: '1',
		description: 'Grocery Store',
		date: '2025-12-14T10:30:00Z',
		accountName: 'Everyday Checking',
		amount: -82.45,
		icon: 'shopping-cart'
	},
	{
		id: '2',
		description: 'Salary Deposit',
		date: '2025-12-13T09:00:00Z',
		accountName: 'Everyday Checking',
		amount: 2800.0,
		icon: 'briefcase'
	},
	{
		id: '3',
		description: 'Coffee Shop',
		date: '2025-12-12T14:15:00Z',
		accountName: 'Rewards Credit',
		amount: -5.75,
		icon: 'hot-beverage'
	},
	{
		id: '5',
		description: 'Transfer to Savings',
		date: '2025-12-10T16:00:00Z',
		accountName: 'Internal transfer',
		amount: -250.0,
		icon: 'bank'
	},
	{
		id: '4',
		description: 'Interest Payment',
		date: '2025-12-01T08:00:00Z',
		accountName: 'High-Yield Savings',
		amount: 5.24,
		icon: 'money-bag'
	}
];

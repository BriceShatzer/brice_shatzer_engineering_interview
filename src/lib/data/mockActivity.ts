import type { ActivityItem } from '$lib/types';

export const mockActivity: ActivityItem[] = [
	{
		id: '1',
		description: 'Grocery Store',
		date: 'Dec 14',
		accountName: 'Everyday Checking',
		amount: -82.45,
		icon: 'shopping-cart'
	},
	{
		id: '2',
		description: 'Salary Deposit',
		date: 'Dec 13',
		accountName: 'Everyday Checking',
		amount: 2800.0,
		icon: 'money-bag'
	},
	{
		id: '3',
		description: 'Coffee Shop',
		date: 'Dec 12',
		accountName: 'Rewards Credit',
		amount: -5.75,
		icon: 'hot-beverage'
	},
	{
		id: '4',
		description: 'Interest Payment',
		date: 'Dec 1',
		accountName: 'High-Yield Savings',
		amount: 5.24,
		icon: 'bank'
	},
	{
		id: '5',
		description: 'Transfer to Savings',
		date: 'Dec 10',
		accountName: 'Internal transfer',
		amount: -250.0,
		icon: 'bank'
	}
];

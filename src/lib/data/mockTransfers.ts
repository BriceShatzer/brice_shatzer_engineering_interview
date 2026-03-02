import type { RecentTransfer } from '$lib/types';

export const mockTransfers: RecentTransfer[] = [
	{
		id: '1',
		toAccountName: 'To High-Yield Savings',
		date: 'Dec 10',
		fromDescription: 'From Everyday Checking',
		amount: -250.0,
		icon: 'bank'
	},
	{
		id: '2',
		toAccountName: 'To Everyday Checking',
		date: 'Dec 3',
		fromDescription: 'From High-Yield Savings',
		amount: 150.0,
		icon: 'bank'
	},
	{
		id: '3',
		toAccountName: 'To Rewards Credit',
		date: 'Nov 28',
		fromDescription: 'Payment from Checking',
		amount: 430.12,
		icon: 'bank'
	}
];

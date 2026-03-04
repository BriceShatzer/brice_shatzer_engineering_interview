<script lang="ts">
	import { accounts, totalBalance, activeAccountCount } from '$lib/stores';
	import TotalBalanceCard from '$lib/components/accounts/TotalBalanceCard.svelte';
	import AccountCard from '$lib/components/accounts/AccountCard.svelte';
	import TransactionItem from '$lib/components/shared/TransactionItem.svelte';
	import { mockActivity } from '$lib/data/mockActivity';
	import { formatDate, getDisplayName } from '$lib/utils';
	import type { PageData } from './$types';
	import type { ActivityItem, TransferSummary } from '$lib/types';

	export let data: PageData;

	function resolveAccountName(accountNumber: string): string | null {
		const match = $accounts.find((a) => a.account_number === accountNumber);
		return match ? getDisplayName(match) : null;
	}

	function buildActivity(transfers: TransferSummary[]): ActivityItem[] {
		const transferActivity = transfers.map((t): ActivityItem => {
			let accountName: string;

			if (t.description?.startsWith('Internal Transfer |')) {
				const fromMatch = t.description.match(/from:\s*(\S+)/);
				const toMatch = t.description.match(/to:\s*(\S+)/);
				accountName =
					t.direction === 'OUTBOUND'
						? `${(fromMatch && resolveAccountName(fromMatch[1])) ?? 'Unknown'}`
						: `${(toMatch && resolveAccountName(toMatch[1])) ?? 'Unknown'}`;
			} else {
				accountName =
					t.direction === 'OUTBOUND'
						? t.destination_account.account_holder_name
						: t.source_account.account_holder_name;
			}

			return {
				id: t.transfer_id,
				description: t.description.startsWith('Internal Transfer | ')
					? 'Internal Transfer'
					: t.description,
				date: t.initiated_date,
				accountName,
				amount: t.direction === 'OUTBOUND' ? -t.amount : t.amount,
				icon: 'bank'
			};
		});

		return [...mockActivity, ...transferActivity].sort(
			(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
		);
	}
</script>

<svelte:head>
	<title>Accounts - NorthWind</title>
</svelte:head>

<div class="accounts-page">
	{#if data.error}
		<div class="error-banner" role="alert">
			<p>Failed to load accounts: {data.error}</p>
			<a href="/accounts">Retry</a>
		</div>
	{:else}
		<div class="content-grid">
			<div class="left-column">
				<TotalBalanceCard totalBalance={$totalBalance} accountCount={$activeAccountCount} />

				<section aria-labelledby="accounts-heading">
					<h2 id="accounts-heading" class="section-heading">Your accounts</h2>
					<div class="account-list">
						{#each $accounts as account (account.account_id)}
							<AccountCard {account} />
						{/each}
					</div>
				</section>
			</div>

			<div class="right-column">
				<section class="activity-card" aria-labelledby="activity-heading">
					<h2 id="activity-heading" class="card-heading">Recent Activity</h2>
					<p class="card-subtitle">Latest movements across all accounts</p>
					<div class="activity-list">
						{#await data.transfers}
							{#each Array(5) as _, i (i)}
								<div class="skeleton-item" aria-hidden="true"></div>
							{/each}
						{:then transfers}
							{#each buildActivity(transfers) as item (item.id)}
								<TransactionItem
									title={item.description}
									meta="{formatDate(item.date)} · {item.accountName}"
									amount={item.amount}
									icon={item.icon}
								/>
							{/each}
						{/await}
					</div>
				</section>
			</div>
		</div>
	{/if}
</div>

<style>
	.accounts-page {
		padding: var(--s-6);
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--s-6);
	}

	.left-column {
		display: flex;
		flex-direction: column;
		gap: var(--s-6);
	}

	.section-heading {
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-medium);
		color: var(--text-light-fg-ci);
		margin-bottom: var(--s-3);
	}

	.account-list {
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
	}

	.activity-card {
		background-color: var(--c-gray-lighter);
		border: var(--border-size-thin) solid var(--c-gray);
		border-radius: var(--radius-lg);
		padding: var(--s-4);
	}

	.card-heading {
		font-size: var(--title-fs);
		font-weight: var(--fw-semi-bold);
		color: var(--text-fg-ci);
		margin-bottom: var(--s-1);
	}

	.card-subtitle {
		font-size: var(--text-xs-fs);
		color: var(--text-light-fg-ci);
		margin-bottom: var(--s-3);
	}

	.skeleton-item {
		height: 52px;
		border-radius: var(--radius-md);
		background: linear-gradient(
			90deg,
			var(--c-gray-light) 25%,
			var(--c-gray) 50%,
			var(--c-gray-light) 75%
		);
		background-size: 200% 100%;
		animation: skeleton-shimmer 1.4s ease-in-out infinite;
		margin-bottom: var(--s-2);
	}

	@keyframes skeleton-shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.error-banner {
		background-color: var(--c-red-lighter);
		border: var(--border-size-thin) solid var(--c-red);
		border-radius: var(--radius-lg);
		padding: var(--s-4);
		text-align: center;
		color: var(--c-red-dark);
	}

	.error-banner a {
		color: var(--c-blue);
		font-weight: var(--fw-medium);
		text-decoration: underline;
		margin-left: var(--s-2);
	}

	@media (max-width: 768px) {
		.content-grid {
			grid-template-columns: 1fr;
		}

		.accounts-page {
			padding: var(--s-4);
		}
	}
</style>

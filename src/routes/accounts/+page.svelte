<script lang="ts">
	import { accounts, totalBalance, activeAccountCount } from '$lib/stores';
	import TotalBalanceCard from '$lib/components/accounts/TotalBalanceCard.svelte';
	import AccountCard from '$lib/components/accounts/AccountCard.svelte';
	import TransactionItem from '$lib/components/shared/TransactionItem.svelte';
	import { mockActivity } from '$lib/data/mockActivity';
	import { formatDate } from '$lib/utils';
	import type { PageData } from './$types';

	export let data: PageData;

	$: sortedActivity = [...mockActivity].sort((a, b) =>
		new Date(b.date).getTime() - new Date(a.date).getTime()
	);
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
						{#each sortedActivity as item (item.id)}
							<TransactionItem title={item.description} meta="{formatDate(item.date)} · {item.accountName}" amount={item.amount} icon={item.icon} />
						{/each}
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

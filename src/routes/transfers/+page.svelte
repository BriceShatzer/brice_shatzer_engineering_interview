<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { accounts } from '$lib/stores/accounts';
	import type { AccountSummary, RecentTransfer, TransferStatusResponse } from '$lib/types';
	import { getDisplayName } from '$lib/utils/accounts';
	import { formatAccountLabel, formatDate } from '$lib/utils/format';
	import TransferForm from '$lib/components/TransferForm.svelte';
	import TransferSummary from '$lib/components/TransferSummary.svelte';
	import TransferResult from '$lib/components/TransferResult.svelte';
	import RecentTransferItem from '$lib/components/RecentTransferItem.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	$: recentTransfers = (data.transfers ?? []).map((t): RecentTransfer => ({
		id: t.transfer_id,
		toAccountName: `To ${t.destination_account.account_holder_name}`,
		date: formatDate(t.initiated_date),
		fromDescription: `From ${t.source_account.account_holder_name}`,
		amount: t.direction === 'OUTBOUND' ? -t.amount : t.amount,
		icon: 'bank'
	}));

	type ViewState =
		| { kind: 'form' }
		| { kind: 'submitting' }
		| {
				kind: 'success';
				result: TransferStatusResponse;
				source: AccountSummary;
				destination: AccountSummary;
				amount: number;
		  }
		| { kind: 'failure'; errorMessage: string };

	let viewState: ViewState = { kind: 'form' };
	let sourceAccount: AccountSummary | null = null;
	let destinationAccount: AccountSummary | null = null;
	let amount: number = 0;

	async function handleSubmit(
		e: CustomEvent<{ source: AccountSummary; destination: AccountSummary; amount: number }>
	) {
		const { source, destination, amount: transferAmount } = e.detail;
		viewState = { kind: 'submitting' };

		try {
			const response = await fetch('/api/transfers', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					source_account_id: source.account_id,
					destination_account_id: destination.account_id,
					amount: transferAmount
				})
			});

			if (!response.ok) {
				const errorBody = await response.json().catch(() => null);
				throw new Error(errorBody?.error?.message ?? `Transfer failed (${response.status})`);
			}

			const result: TransferStatusResponse = await response.json();
			viewState = { kind: 'success', result, source, destination, amount: transferAmount };
			await invalidateAll();
		} catch (e) {
			const message = e instanceof Error ? e.message : 'An unexpected error occurred';
			viewState = { kind: 'failure', errorMessage: message };
		}
	}

	function handleDone() {
		viewState = { kind: 'form' };
		sourceAccount = null;
		destinationAccount = null;
		amount = 0;
	}
</script>

<svelte:head>
	<title>Transfers - NorthWind</title>
</svelte:head>

<div class="transfers-page">
	{#if viewState.kind === 'success'}
		<TransferResult
			type="success"
			amount={viewState.amount}
			sourceLabel={formatAccountLabel(
				getDisplayName(viewState.source),
				viewState.source.account_number
			)}
			destinationLabel={formatAccountLabel(
				getDisplayName(viewState.destination),
				viewState.destination.account_number
			)}
			date={viewState.result.initiated_date || new Date().toISOString()}
			confirmationNumber={viewState.result.reference_number}
			on:done={handleDone}
		/>
	{:else if viewState.kind === 'failure'}
		<TransferResult type="failure" errorMessage={viewState.errorMessage} on:done={handleDone} />
	{:else}
		<div class="content-grid">
			<div class="left-column">
				<TransferForm
					accounts={$accounts}
					bind:sourceAccount
					bind:destinationAccount
					bind:amount
					submitting={viewState.kind === 'submitting'}
					on:submit={handleSubmit}
				/>
			</div>

			<div class="right-column">
				<TransferSummary source={sourceAccount} destination={destinationAccount} {amount} />

				<section class="recent-card" aria-label="Recent transfers">
					<h3 class="card-heading">Recent transfers</h3>
					<p class="card-subtitle">Quick reference of your latest internal transfers.</p>
					<div class="transfer-list">
						{#each recentTransfers as item (item.id)}
							<RecentTransferItem {item} />
						{/each}
					</div>
				</section>
			</div>
		</div>
	{/if}
</div>

<style>
	.transfers-page {
		padding: var(--s-6);
	}

	.content-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--s-6);
	}

	.right-column {
		display: flex;
		flex-direction: column;
		gap: var(--s-6);
	}

	.recent-card {
		border: var(--border-size-thin) solid var(--border-ci-light);
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

	@media (max-width: 768px) {
		.content-grid {
			grid-template-columns: 1fr;
		}

		.transfers-page {
			padding: var(--s-4);
		}
	}
</style>

<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { accounts, institutionName } from '$lib/stores';
	import type { AccountSummary, RecentTransfer, TransferRequest, TransferStatusResponse, ValidationResponse } from '$lib/types';
	import { getDisplayName, formatAccountLabel, formatDate } from '$lib/utils';
	import TransferForm from '$lib/components/transfers/TransferForm.svelte';
	import TransferSummary from '$lib/components/transfers/TransferSummary.svelte';
	import TransferResult from '$lib/components/transfers/TransferResult.svelte';
	import TransactionItem from '$lib/components/shared/TransactionItem.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function resolveAccountName(accountNumber: string): string | null {
		const match = $accounts.find((a) => a.account_number === accountNumber);
		return match ? getDisplayName(match) : null;
	}

	$: recentTransfers = [...(data.transfers ?? [])].sort((a, b) =>
		new Date(b.initiated_date).getTime() - new Date(a.initiated_date).getTime()
	).map((t): RecentTransfer => {
		let toAccountName: string;
		let fromDescription: string;

		if (t.description?.startsWith('Internal Transfer |')) {
			const fromMatch = t.description.match(/from:\s*(\S+)/);
			const toMatch = t.description.match(/to:\s*(\S+)/);
			fromDescription = `From ${(fromMatch && resolveAccountName(fromMatch[1])) ?? 'Unknown'}`;
			toAccountName = `To ${(toMatch && resolveAccountName(toMatch[1])) ?? 'Unknown'}`;
		} else {
			toAccountName = `To ${resolveAccountName(t.destination_account.account_number) ?? t.destination_account.institution_name ?? 'Unknown'}`;
			fromDescription = `From ${resolveAccountName(t.source_account.account_number) ?? t.source_account.institution_name ?? 'Unknown'}`;
		}

		return {
			id: t.transfer_id,
			toAccountName,
			date: formatDate(t.initiated_date),
			fromDescription,
			amount: t.direction === 'OUTBOUND' ? -t.amount : t.amount,
			icon: 'bank'
		};
	});

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

		const transferRequest: TransferRequest = {
			amount: transferAmount,
			currency: 'USD',
			description: `Internal Transfer | from: ${source.account_number} | to: ${destination.account_number}`, // `Transfer from ${getDisplayName(source)} to ${getDisplayName(destination)}` 
			direction: 'OUTBOUND',
			transfer_type: 'ACH',
			reference_number: `REF-${Date.now()}`,
			source_account: {
				account_number: source.account_number,
				account_holder_name: source.account_holder_name,
				institution_name: $institutionName,
				routing_number: source.routing_number
			},
			destination_account: {
				account_number: destination.account_number,
				account_holder_name: destination.account_holder_name,
				institution_name: $institutionName,
				routing_number: destination.routing_number
			}
		};

		try {
			// Pre-flight validation call
			const validateResponse = await fetch('/api/transfers/validate', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(transferRequest)
			});

			if (!validateResponse.ok) {
				const errorBody = await validateResponse.json().catch(() => null);
				throw new Error(errorBody?.error?.message ?? `Validation failed (${validateResponse.status})`);
			}

			const validation: ValidationResponse = await validateResponse.json();
			if (!validation.validation.valid) {
				const errorMessages = validation.validation.issues
					.filter((issue) => issue.severity === 'error')
					.map((issue) => issue.message);
				throw new Error(errorMessages.join('. ') || 'Transfer validation failed');
			}

			// Initiate transfer
			const response = await fetch('/api/transfers', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(transferRequest)
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

				<section class="recent-card" aria-labelledby="recent-transfers-heading">
					<h3 id="recent-transfers-heading" class="card-heading">Recent transfers</h3>
					<p class="card-subtitle">Quick reference of your latest internal transfers.</p>
					<div class="transfer-list">
						{#each recentTransfers as item (item.id)}
							<TransactionItem title={item.toAccountName} meta="{item.date} · {item.fromDescription}" amount={item.amount} />
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
		background-color: var(--c-gray-lighter);
		border: var(--border-size-thin) solid var(--c-gray);
		/* border: var(--border-size-thin) solid var(--border-ci-light); */
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

<script lang="ts">
	import type { AccountSummary } from '$lib/types';
	import { getDisplayName, formatCurrency } from '$lib/utils';

	export let source: AccountSummary | null = null;
	export let destination: AccountSummary | null = null;
	export let amount: number = 0;

	$: hasAccounts = source !== null && destination !== null;
	$: hasAmount = amount > 0;
	$: sourceNewBalance = source ? source.balance - amount : 0;
	$: destNewBalance = destination ? destination.balance + amount : 0;
</script>

<section class="summary-card" aria-label="Transfer summary">
	<h3 class="card-heading">Transfer summary</h3>
	<p class="card-subtitle">A quick view of how this transfer affects your balances.</p>

	<div class="summary-content">
		<div class="summary-row">
			<div class="summary-col">
				<span class="col-label">
					{#if hasAmount}${amount}{/if} From
				</span>
				<span class="col-value">
					{source ? getDisplayName(source) : '-'}
				</span>
				{#if hasAccounts}
					<span class="col-balance">
						{hasAmount ? 'New balance' : 'Current'} &middot; {formatCurrency(
							hasAmount ? sourceNewBalance : (source?.balance ?? 0)
						)}
					</span>
				{/if}
			</div>
			<div class="summary-col">
				<span class="col-label">
					{#if hasAmount}${amount}{/if} To
				</span>
				<span class="col-value">
					{destination ? getDisplayName(destination) : '-'}
				</span>
				{#if hasAccounts}
					<span class="col-balance">
						{hasAmount ? 'New balance' : 'Current'} &middot; {formatCurrency(
							hasAmount ? destNewBalance : (destination?.balance ?? 0)
						)}
					</span>
				{/if}
			</div>
		</div>
	</div>
</section>

<style>
	.summary-card {
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
		margin-bottom: var(--s-4);
	}

	.summary-row {
		display: flex;
		gap: var(--s-8);
	}

	.summary-col {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: var(--s-025);
	}

	.col-label {
		font-size: var(--text-xs-fs);
		color: var(--text-light-fg-ci);
	}

	.col-value {
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-semi-bold);
		color: var(--text-fg-ci);
	}

	.col-balance {
		font-size: var(--text-xs-fs);
		color: var(--text-light-fg-ci);
	}
</style>

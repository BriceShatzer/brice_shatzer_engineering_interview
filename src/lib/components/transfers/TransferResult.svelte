<script lang="ts">
	import { createEventDispatcher, onMount, tick } from 'svelte';
	import { formatCurrency, formatFullDate } from '$lib/utils';

	export let type: 'success' | 'failure';
	export let amount: number = 0;
	export let sourceLabel: string = '';
	export let destinationLabel: string = '';
	export let date: string = '';
	export let confirmationNumber: string = '';
	export let errorMessage: string = '';

	const dispatch = createEventDispatcher<{ done: void }>();

	let headingEl: HTMLHeadingElement;

	onMount(async () => {
		await tick();
		headingEl?.focus();
	});
</script>

<div class="result-overlay">
	<div class="result-card" role={type === 'failure' ? 'alert' : 'status'}>
		{#if type === 'success'}
			<div class="icon-circle success-icon">
				<svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="white" />
				</svg>
			</div>
			<h2 class="result-heading" bind:this={headingEl} tabindex="-1">Transfer Successful</h2>
			<p class="result-subtitle">Your transfer has successfully been completed</p>

			<dl class="details-table">
				<div class="detail-row">
					<dt>Amount</dt>
					<dd>{formatCurrency(amount)}</dd>
				</div>
				<div class="detail-row">
					<dt>Transfer from</dt>
					<dd>{sourceLabel}</dd>
				</div>
				<div class="detail-row">
					<dt>Transfer to</dt>
					<dd>{destinationLabel}</dd>
				</div>
				<div class="detail-row">
					<dt>Transfer date</dt>
					<dd>{formatFullDate(date)}</dd>
				</div>
				<div class="detail-row">
					<dt>Confirmation</dt>
					<dd>{confirmationNumber}</dd>
				</div>
			</dl>

			<button class="action-btn" on:click={() => dispatch('done')}>Done</button>
		{:else}
			<div class="icon-circle failure-icon">
				<svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden="true">
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"
						fill="white"
					/>
				</svg>
			</div>
			<h2 class="result-heading" bind:this={headingEl} tabindex="-1">Transfer Failed</h2>
			<p class="result-subtitle">{errorMessage}</p>

			<button class="action-btn" on:click={() => dispatch('done')}>Back to transfers</button>
		{/if}
	</div>
</div>

<style>
	.result-overlay {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		padding: var(--s-6);
	}

	.result-card {
		max-width: 480px;
		width: 100%;
		border: var(--border-size-thin) solid var(--border-ci-light);
		border-radius: var(--radius-xl);
		padding: var(--s-8) var(--s-6);
		text-align: center;
	}

	.icon-circle {
		width: 56px;
		height: 56px;
		border-radius: var(--radius-round);
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 0 auto var(--s-4);
	}

	.success-icon {
		background-color: var(--c-green-dark);
	}

	.failure-icon {
		background-color: var(--c-red);
	}

	.result-heading {
		font-size: var(--header-xs-fs);
		font-weight: var(--fw-semi-bold);
		color: var(--text-fg-ci);
		margin-bottom: var(--s-2);
	}

	.result-subtitle {
		font-size: var(--text-sm-fs);
		color: var(--text-light-fg-ci);
		margin-bottom: var(--s-6);
	}

	.details-table {
		text-align: left;
		margin-bottom: var(--s-6);
	}

	.detail-row {
		display: flex;
		justify-content: space-between;
		padding: var(--s-3) 0;
		border-bottom: var(--border-size-thin) solid var(--border-ci-light);
	}

	.detail-row dt {
		font-size: var(--text-sm-fs);
		color: var(--text-light-fg-ci);
	}

	.detail-row dd {
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-medium);
		color: var(--text-fg-ci);
		text-align: right;
	}

	.action-btn {
		width: 100%;
		padding: var(--s-3) var(--s-4);
		border: var(--border-size-thin) solid var(--border-ci);
		border-radius: var(--radius-lg);
		background: var(--c-white);
		font-family: var(--text-font);
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-semi-bold);
		color: var(--text-fg-ci);
		cursor: pointer;
		transition: background-color 0.15s ease;
	}

	.action-btn:hover {
		background-color: var(--c-gray-lightest);
	}

	.action-btn:focus-visible {
		outline: 2px solid var(--c-blue);
		outline-offset: 2px;
	}
</style>

<script lang="ts">
	import { formatCurrency } from '$lib/utils';

	export let totalBalance: number;
	export let accountCount: number;
</script>

<section class="balance-card" aria-label="Total balance summary">
	<p class="label">Total balance</p>
	<p class="amount">{formatCurrency(totalBalance)}</p>
	<p class="subtitle">Across {accountCount} accounts</p>
</section>

<style>
	.balance-card {
		background-color: var(--c-blue);
		/* background: linear-gradient(135deg, var(--c-blue) 0%, var(--c-blue-dark) 100%); */
		border-radius: var(--radius-xl);
		padding: var(--s-5) var(--s-6);
		color: var(--c-white);
	}

	.label {
		font-size: var(--text-xs-fs);
		font-weight: var(--fw-medium);
		opacity: 0.85;
		margin-bottom: var(--s-1);
	}

	.amount {
		font-size: var(--header-md-fs);
		font-weight: var(--fw-bold);
		line-height: 1.2;
		margin-bottom: var(--s-1);
	}

	.subtitle {
		font-size: var(--text-xs-fs);
		opacity: 0.75;
	}
</style>

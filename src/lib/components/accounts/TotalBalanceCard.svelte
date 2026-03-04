<script lang="ts">
	import { formatCurrency } from '$lib/utils';

	export let totalBalance: number;
	export let accountCount: number;
</script>

<section class="balance-card" aria-labelledby="total-balance-heading">
	<h2 id="total-balance-heading" class="label">Total balance</h2>
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
		color: var(--c-blue-lighter);
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
		color: var(--c-blue-lighter);
	}
</style>

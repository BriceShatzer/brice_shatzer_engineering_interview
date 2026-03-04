<script lang="ts">
	import type { AccountSummary } from '$lib/types';
	import {
		formatCurrency,
		maskAccountNumber,
		getDisplayName,
		getTypeBadgeLabel,
		getStatusLabel
	} from '$lib/utils';

	export let account: AccountSummary;

	$: displayName = getDisplayName(account);
	$: masked = maskAccountNumber(account.account_number);
	$: badge = getTypeBadgeLabel(account.account_type);
	$: isInactive = account.account_status !== 'ACTIVE';
	$: isNegative = account.balance < 0;
	$: statusLabel = isInactive ? getStatusLabel(account.account_status) : 'Available';
</script>

<article class="account-card" class:inactive={isInactive}>
	<div class="row-top">
		<span class="account-name">{displayName}</span>
		<span class="balance" class:negative={isNegative}>
			{formatCurrency(account.balance)}
		</span>
	</div>
	<div class="row-bottom">
		<span class="account-number">{masked}</span>
		<span class="badge">{badge}</span>
		<span class="status" class:inactive-status={isInactive}>{statusLabel}</span>
	</div>
</article>

<style>
	.account-card {
		border: var(--border-size-thin) solid var(--border-ci-light);
		border-radius: var(--radius-lg);
		padding: var(--s-4);
		transition: box-shadow 0.15s ease;
	}

	.account-card:hover {
		box-shadow: var(--shadow-sm);
	}

	.account-card.inactive {
		opacity: 0.6;
	}

	.row-top {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		margin-bottom: var(--s-2);
	}

	.account-name {
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-medium);
		color: var(--text-fg-ci);
	}

	.balance {
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-semi-bold);
		color: var(--text-fg-ci);
	}

	.balance.negative {
		color: var(--c-red-dark);
	}

	.row-bottom {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		font-size: var(--text-xs-fs);
		color: var(--text-light-fg-ci);
	}

	.badge {
		background-color: var(--c-gray-lighter);
		color: var(--text-light-fg-ci);
		padding: var(--s-025) var(--s-2);
		border-radius: var(--radius-round);
		font-size: var(--text-xxs-fs);
		font-weight: var(--fw-medium);
	}

	.status {
		margin-left: auto;
	}

	.inactive-status {
		color: var(--c-red-dark);
		font-weight: var(--fw-medium);
	}
</style>

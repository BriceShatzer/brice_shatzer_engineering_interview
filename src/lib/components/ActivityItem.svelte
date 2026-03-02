<script lang="ts">
	import type { ActivityItem } from '$lib/types';
	import { formatSignedCurrency } from '$lib/utils/format';
	import bankIcon from '$lib/assets/bank.svg';
	import shoppingCartIcon from '$lib/assets/shopping-cart.svg';
	import moneyBagIcon from '$lib/assets/money-bag.svg';
	import hotBeverageIcon from '$lib/assets/hot-beverage.svg';

	export let item: ActivityItem;

	const iconMap: Record<string, string> = {
		bank: bankIcon,
		'shopping-cart': shoppingCartIcon,
		'money-bag': moneyBagIcon,
		'hot-beverage': hotBeverageIcon
	};

	$: iconSrc = iconMap[item.icon] ?? bankIcon;
	$: isNegative = item.amount < 0;
</script>

<div class="activity-item">
	<div class="icon-wrapper">
		<img src={iconSrc} alt="" aria-hidden="true" class="icon" />
	</div>
	<div class="details">
		<p class="description">{item.description}</p>
		<p class="meta">{item.date} &middot; {item.accountName}</p>
	</div>
	<span class="amount" class:negative={isNegative} class:positive={!isNegative}>
		{formatSignedCurrency(item.amount)}
	</span>
</div>

<style>
	.activity-item {
		display: flex;
		align-items: center;
		gap: var(--s-3);
		padding: var(--s-3) 0;
	}

	.activity-item:not(:last-child) {
		border-bottom: var(--border-size-thin) solid var(--border-ci-light);
	}

	.icon-wrapper {
		width: 36px;
		height: 36px;
		border-radius: var(--radius-round);
		background-color: var(--c-gray-lighter);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.icon {
		width: 20px;
		height: 20px;
	}

	.details {
		flex: 1;
		min-width: 0;
	}

	.description {
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-medium);
		color: var(--text-fg-ci);
	}

	.meta {
		font-size: var(--text-xs-fs);
		color: var(--text-light-fg-ci);
	}

	.amount {
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-semi-bold);
		white-space: nowrap;
	}

	.negative {
		color: var(--c-red);
	}

	.positive {
		color: var(--text-fg-ci);
	}
</style>

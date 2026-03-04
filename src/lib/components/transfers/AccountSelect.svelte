<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import type { AccountSummary } from '$lib/types';
	import { getDisplayName, getStatusLabel, isActive, formatCurrency, maskAccountNumber } from '$lib/utils';

	export let accounts: AccountSummary[] = [];
	export let selected: AccountSummary | null = null;
	export let excludeAccountId: string | null = null;
	export let label: string;
	export let id: string;
	export let errorId: string | undefined = undefined;

	const dispatch = createEventDispatcher<{ select: AccountSummary }>();

	let open = false;
	let triggerEl: HTMLDivElement;
	let listEl: HTMLUListElement;
	let focusedIndex = -1;

	$: listboxId = `${id}-listbox`;
	$: filteredAccounts = accounts;
	$: activeDescendantId = open && focusedIndex >= 0 && focusedIndex < filteredAccounts.length
		? `${id}-option-${filteredAccounts[focusedIndex].account_id}`
		: undefined;
	$: selectedLabel = selected
		? `${getDisplayName(selected)}...${selected.account_number.slice(-4)}`
		: 'Choose account';
	$: selectedSubtitle = selected ? `${formatCurrency(selected.balance)} available` : '';

	function toggle() {
		open = !open;
		if (open) {
			focusedIndex = -1;
		}
	}

	function close() {
		open = false;
		focusedIndex = -1;
	}

	function selectAccount(account: AccountSummary) {
		if (!isActive(account)) return;
		if (account.account_id === excludeAccountId) return;
		dispatch('select', account);
		close();
		triggerEl?.focus();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!open) {
			if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				open = true;
				focusedIndex = 0;
			}
			return;
		}

		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				focusedIndex = Math.min(focusedIndex + 1, filteredAccounts.length - 1);
				break;
			case 'ArrowUp':
				e.preventDefault();
				focusedIndex = Math.max(focusedIndex - 1, 0);
				break;
			case 'Enter':
			case ' ':
				e.preventDefault();
				if (focusedIndex >= 0 && focusedIndex < filteredAccounts.length) {
					selectAccount(filteredAccounts[focusedIndex]);
				}
				break;
			case 'Escape':
				e.preventDefault();
				close();
				triggerEl?.focus();
				break;
			case 'Tab':
				close();
				break;
		}
	}

	function handleClickOutside(e: MouseEvent) {
		const target = e.target as Node;
		if (triggerEl && !triggerEl.contains(target) && listEl && !listEl.contains(target)) {
			close();
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => document.removeEventListener('click', handleClickOutside);
	});
</script>

<div class="account-select">
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label id="{id}-label" class="select-label">{label}</label>
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		bind:this={triggerEl}
		{id}
		class="trigger"
		class:has-selection={selected !== null}
		role="combobox"
		tabindex="0"
		aria-labelledby="{id}-label"
		aria-haspopup="listbox"
		aria-expanded={open}
		aria-controls={open ? listboxId : undefined}
		aria-activedescendant={activeDescendantId}
		aria-describedby={errorId}
		on:click={toggle}
		on:keydown={handleKeydown}
	>
		<div class="trigger-content">
			<span class="trigger-text" class:placeholder={!selected}>{selectedLabel}</span>
			{#if selectedSubtitle}
				<span class="trigger-subtitle">{selectedSubtitle}</span>
			{/if}
		</div>
		<span class="chevron" aria-hidden="true">&rsaquo;</span>
	</div>

	{#if open}
		<ul
			bind:this={listEl}
			id={listboxId}
			class="dropdown"
			role="listbox"
			aria-label="{label} options"
			tabindex="-1"
		>
			{#each filteredAccounts as account, i (account.account_id)}
				{@const disabled = !isActive(account) || account.account_id === excludeAccountId}
				<li
					id="{id}-option-{account.account_id}"
					role="option"
					class="option"
					class:disabled
					class:focused={i === focusedIndex}
					class:selected={selected?.account_id === account.account_id}
					aria-selected={selected?.account_id === account.account_id}
					aria-disabled={disabled}
					on:click={() => selectAccount(account)}
					on:keydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							selectAccount(account);
						}
					}}
					on:mouseenter={() => {
						focusedIndex = i;
					}}
				>
					<div class="option-main">
						<span class="option-name"
							>{getDisplayName(account)}...{account.account_number.slice(-4)}</span
						>
						<span class="option-balance">{formatCurrency(account.balance)}</span>
					</div>
					<div class="option-meta">
						<span>{maskAccountNumber(account.account_number)}</span>
						{#if disabled}
							<span class="option-status">
								{account.account_id === excludeAccountId
									? 'Already selected'
									: getStatusLabel(account.account_status)}
							</span>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>

<style>
	.account-select {
		position: relative;
	}

	.select-label {
		display: block;
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-medium);
		color: var(--text-fg-ci);
		margin-bottom: var(--s-2);
	}

	.trigger {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--s-3) var(--s-4);
		border: var(--border-size-thin) solid var(--border-ci);
		border-radius: var(--radius-lg);
		background: var(--c-white);
		cursor: pointer;
		text-align: left;
		font-family: var(--text-font);
		min-height: var(--input-height);
		transition: border-color 0.15s ease;
	}

	.trigger:hover {
		border-color: var(--c-blue);
	}

	.trigger:focus-visible {
		outline: 2px solid var(--c-blue);
		outline-offset: 2px;
	}

	.trigger-content {
		display: flex;
		flex-direction: column;
		gap: var(--s-025);
	}

	.trigger-text {
		font-size: var(--text-sm-fs);
		color: var(--text-fg-ci);
		font-weight: var(--fw-medium);
	}

	.trigger-text.placeholder {
		color: var(--c-blue);
	}

	.trigger-subtitle {
		font-size: var(--text-xs-fs);
		color: var(--text-light-fg-ci);
	}

	.chevron {
		font-size: var(--title-lg-fs);
		color: var(--text-light-fg-ci);
		line-height: 1;
	}

	.dropdown {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		z-index: var(--layer-3);
		background: var(--c-white);
		border: var(--border-size-thin) solid var(--border-ci);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
		margin-top: var(--s-1);
		max-height: 300px;
		overflow-y: auto;
		list-style: none;
		padding: var(--s-1) 0;
	}

	.option {
		padding: var(--s-3) var(--s-4);
		cursor: pointer;
		transition: background-color 0.1s ease;
	}

	.option:hover:not(.disabled),
	.option.focused:not(.disabled) {
		background-color: var(--c-blue-lightest);
	}

	.option.selected {
		background-color: var(--c-blue-lightest);
	}

	.option.disabled {
		cursor: not-allowed;
		opacity: 0.5;
	}

	.option-main {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	.option-name {
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-medium);
		color: var(--text-fg-ci);
	}

	.option-balance {
		font-size: var(--text-sm-fs);
		color: var(--text-light-fg-ci);
	}

	.option-meta {
		display: flex;
		justify-content: space-between;
		font-size: var(--text-xs-fs);
		color: var(--text-light-fg-ci);
		margin-top: var(--s-025);
	}

	.option-status {
		color: var(--c-red-dark);
		font-weight: var(--fw-medium);
		text-transform: capitalize;
	}
</style>

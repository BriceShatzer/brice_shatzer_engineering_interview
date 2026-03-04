<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { AccountSummary } from '$lib/types';
	import { institutionName } from '$lib/stores';
	import { isActive } from '$lib/utils';
	import AccountSelect from './AccountSelect.svelte';

	export let accounts: AccountSummary[] = [];
	export let sourceAccount: AccountSummary | null = null;
	export let destinationAccount: AccountSummary | null = null;
	export let amount: number = 0;
	export let submitting: boolean = false;

	let amountInput = '';
	let errors: Record<string, string> = {};

	const dispatch = createEventDispatcher<{
		submit: { source: AccountSummary; destination: AccountSummary; amount: number };
	}>();

	function handleAmountInput(e: Event) {
		const target = e.target as HTMLInputElement;
		const raw = target.value.replace(/[^0-9.]/g, '');
		const parts = raw.split('.');
		// Allow at most one decimal point — keep only the first two parts
		const integer = parts[0] ?? '';
		const decimal = parts.length > 1 ? parts[1] : null;

		const cleanedInteger = integer.length > 1 ? integer.replace(/^0+/, '') || '0' : integer;
		let cleaned = cleanedInteger;
		if (decimal !== null) {
			cleaned += '.' + decimal.slice(0, 2);
		}

		amountInput = cleaned;
		target.value = cleaned;
		amount = parseFloat(cleaned) || 0;
		if (errors.amount) {
			errors = { ...errors, amount: '' };
		}
	}

	function validate(): boolean {
		const newErrors: Record<string, string> = {};

		// Note: the checks that are noted below are defensive. $:canSubmit already prevents
		// submission when these fields are invalid, but these guard against programmatic calls.

		if (!sourceAccount) {
			// defensive
			newErrors.source = 'Please select a source account';
		} else if (!isActive(sourceAccount)) {
			newErrors.source = 'Source account is not active';
		} else if (sourceAccount.account_type === 'CD') {
			newErrors.source = 'Transfers are not available from CD accounts';
		}

		if (!destinationAccount) {
			// defensive
			newErrors.destination = 'Please select a destination account';
		} else if (!isActive(destinationAccount)) {
			newErrors.destination = 'Destination account is not active';
		}

		if (
			sourceAccount &&
			destinationAccount &&
			sourceAccount.account_id === destinationAccount.account_id
		) {
			newErrors.destination = 'Cannot transfer to the same account';
		}

		if (amount <= 0) {
			// defensive
			newErrors.amount = 'Please enter an amount greater than $0';
		} else if (sourceAccount && amount > sourceAccount.balance) {
			newErrors.amount = `Amount exceeds available balance of $${sourceAccount.balance.toFixed(2)}`;
		}

		errors = newErrors;
		return Object.values(newErrors).every((v) => !v);
	}

	function handleSubmit() {
		if (!validate() || !sourceAccount || !destinationAccount) return;
		dispatch('submit', { source: sourceAccount, destination: destinationAccount, amount });
	}

	$: canSubmit = sourceAccount && destinationAccount && amount > 0 && !submitting;
</script>

<form class="transfer-form" on:submit|preventDefault={handleSubmit} novalidate>
	<h2 class="form-heading">Transfer between accounts</h2>
	<p class="form-subtitle">Move money instantly between your accounts.</p>

	<div class="form-card">
		<div class="field">
			<AccountSelect
				id="transfer-from"
				label="Transfer from"
				{accounts}
				selected={sourceAccount}
				excludeAccountId={destinationAccount?.account_id ?? null}
				errorId={errors.source ? 'source-error' : undefined}
				on:select={(e) => {
					sourceAccount = e.detail;
					if (errors.source) errors = { ...errors, source: '' };
				}}
			/>
			{#if errors.source}
				<p class="field-error" id="source-error" role="alert">{errors.source}</p>
			{/if}
		</div>

		<div class="field">
			<AccountSelect
				id="transfer-to"
				label="Transfer to"
				{accounts}
				selected={destinationAccount}
				excludeAccountId={sourceAccount?.account_id ?? null}
				errorId={errors.destination ? 'destination-error' : undefined}
				on:select={(e) => {
					destinationAccount = e.detail;
					if (errors.destination) errors = { ...errors, destination: '' };
				}}
			/>
			{#if errors.destination}
				<p class="field-error" id="destination-error" role="alert">{errors.destination}</p>
			{/if}
		</div>

		<div class="field">
			<label class="field-label" for="transfer-amount">Amount</label>
			<div class="amount-input-wrapper">
				<span class="currency-prefix">$</span>
				<input
					id="transfer-amount"
					type="text"
					inputmode="decimal"
					class="amount-input"
					class:error={!!errors.amount}
					placeholder="0.00"
					value={amountInput}
					on:input={handleAmountInput}
					disabled={submitting}
					aria-describedby={errors.amount ? 'amount-error' : undefined}
				/>
			</div>
			{#if errors.amount}
				<p class="field-error" id="amount-error" role="alert">{errors.amount}</p>
			{/if}
		</div>

		<p class="disclaimer">
			By continuing, I authorize {$institutionName} to transfer money as indicated
		</p>

		<button
			type="submit"
			class="submit-btn"
			class:enabled={canSubmit}
			disabled={!canSubmit || submitting}
		>
			{#if submitting}
				Transferring...
			{:else}
				Complete transfer
			{/if}
		</button>
	</div>
</form>

<style>
	.form-heading {
		font-size: var(--title-fs);
		font-weight: var(--fw-semi-bold);
		color: var(--text-fg-ci);
		margin-bottom: var(--s-1);
	}

	.form-subtitle {
		font-size: var(--text-sm-fs);
		color: var(--text-light-fg-ci);
		margin-bottom: var(--s-5);
	}

	.form-card {
		border: var(--border-size-thin) solid var(--border-ci-light);
		border-radius: var(--radius-lg);
		padding: var(--s-5);
	}

	.field {
		margin-bottom: var(--s-4);
	}

	.field-label {
		display: block;
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-medium);
		color: var(--text-fg-ci);
		margin-bottom: var(--s-2);
	}

	.amount-input-wrapper {
		display: flex;
		align-items: center;
		border: var(--border-size-thin) solid var(--border-ci);
		border-radius: var(--radius-lg);
		padding: var(--s-3) var(--s-4);
		background: var(--c-white);
		transition: border-color 0.15s ease;
	}

	.amount-input-wrapper:focus-within {
		border-color: var(--c-blue);
		outline: 2px solid var(--c-blue);
		outline-offset: -2px;
	}

	.currency-prefix {
		font-size: var(--text-sm-fs);
		color: var(--text-light-fg-ci);
		margin-right: var(--s-2);
	}

	.amount-input {
		flex: 1;
		border: none;
		outline: none;
		font-family: var(--text-font);
		font-size: var(--text-sm-fs);
		color: var(--text-fg-ci);
		background: transparent;
	}

	.amount-input::placeholder {
		color: var(--input-placeholder-fg-ci);
	}

	.amount-input.error {
		color: var(--c-red-dark);
	}

	.field-error {
		font-size: var(--text-xs-fs);
		color: var(--c-red-dark);
		margin-top: var(--s-1);
	}

	.disclaimer {
		font-size: var(--text-xs-fs);
		color: var(--text-light-fg-ci);
		text-align: center;
		margin: var(--s-4) 0;
	}

	.submit-btn {
		width: 100%;
		padding: var(--s-3) var(--s-4);
		border: none;
		border-radius: var(--radius-lg);
		font-family: var(--text-font);
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-semi-bold);
		color: var(--c-white);
		background-color: var(--c-gray);
		cursor: not-allowed;
		transition: background-color 0.15s ease;
	}

	.submit-btn.enabled {
		background-color: var(--c-blue);
		cursor: pointer;
	}

	.submit-btn.enabled:hover {
		background-color: var(--c-blue-dark);
	}

	.submit-btn:focus-visible {
		outline: 2px solid var(--c-blue);
		outline-offset: 2px;
	}

	.submit-btn:disabled {
		opacity: 0.7;
	}
</style>

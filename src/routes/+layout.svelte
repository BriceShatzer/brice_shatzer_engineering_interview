<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/shared/Header.svelte';
	import { accounts, bank, domains } from '$lib/stores';
	import { navigating } from '$app/stores';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: accounts.set(data.accounts);
	$: domains.set(data.domains ?? null);
	$: bank.set(data.bank ?? null);
</script>

{#if $navigating}
	<div class="nav-loading-bar" role="progressbar" aria-label="Loading page"></div>
{/if}

<div class="app-background">
	<div class="app-container">
		<Header />
		<main>
			<slot />
		</main>
	</div>
</div>

<style>
	.nav-loading-bar {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(90deg, transparent, var(--c-blue), transparent);
		background-size: 200% 100%;
		animation: nav-progress 1.2s ease-in-out infinite;
		z-index: 9999;
	}

	@keyframes nav-progress {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	.app-background {
		min-height: 100vh;
		background-color: var(--c-gray-lightest);
		padding: var(--s-8);
	}

	.app-container {
		max-width: 1200px;
		margin: 0 auto;
		background-color: var(--c-white);
		border-radius: var(--radius-xl);
		border: 1px solid var(--c-gray);
		padding: var(--s-6);
		gap: var(--s-6);
		overflow: hidden;
	}

	@media (max-width: 768px) {
		.app-background {
			padding: var(--s-2);
		}
	}
</style>

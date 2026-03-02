<script lang="ts">
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import { accounts } from '$lib/stores/accounts';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	$: accounts.set(data.accounts);
</script>

<div class="app-background">
	<main class="app-container">
		<Header />
		<slot />
	</main>
</div>

<style>
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
		box-shadow: var(--shadow-lg);
		overflow: hidden;
	}

	@media (max-width: 768px) {
		.app-background {
			padding: var(--s-2);
		}
	}
</style>

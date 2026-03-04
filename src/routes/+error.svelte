<script lang="ts">
	import { page } from '$app/stores';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>Error {$page.status} - NorthWind</title>
</svelte:head>

<div class="error-page">
	<div class="error-card" role="alert">
		<p class="error-status">{$page.status}</p>
		<h1 class="error-heading">
			{#if $page.status === 404}
				Page not found
			{:else if $page.status === 403}
				Access denied
			{:else}
				Something went wrong
			{/if}
		</h1>
		<p class="error-message">{$page.error?.message ?? 'An unexpected error occurred.'}</p>
		<a href={resolve('/accounts')} class="error-link">Go to accounts</a>
	</div>
</div>

<style>
	.error-page {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		padding: var(--s-8);
	}

	.error-card {
		background-color: var(--c-white);
		border: var(--border-size) solid var(--border-ci);
		border-radius: var(--radius-lg);
		padding: var(--s-8);
		text-align: center;
		max-width: 28rem;
		width: 100%;
	}

	.error-status {
		font-size: var(--number-fs);
		font-weight: var(--fw-bold);
		color: var(--c-gray-dark);
		margin: 0 0 var(--s-2);
		line-height: 1;
	}

	.error-heading {
		font-size: var(--title-lg-fs);
		font-weight: var(--fw-semi-bold);
		color: var(--c-black);
		margin: 0 0 var(--s-3);
	}

	.error-message {
		font-size: var(--text-sm-fs);
		color: var(--text-light-fg-ci);
		margin: 0 0 var(--s-6);
	}

	.error-link {
		display: inline-block;
		background-color: var(--primary-ci);
		color: var(--c-white);
		padding: var(--s-2) var(--s-5);
		border-radius: var(--radius-md);
		font-size: var(--text-sm-fs);
		font-weight: var(--fw-medium);
		text-decoration: none;
	}

	.error-link:focus-visible {
		outline: 2px solid var(--primary-ci);
		outline-offset: 3px;
	}
</style>

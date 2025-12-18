<script lang="ts">
	export let card = false;
</script>

<div class:card>
	<slot />
</div>

<style>
	.card {
		background-color: var(--c-white);
		border-color: var(--border-ci);
		border-width: var(--border-size);
		border-style: solid;
		border-radius: var(--radius-lg);
		padding: var(--s-4);
	}
</style>

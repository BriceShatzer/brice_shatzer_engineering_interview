<script lang="ts">
	export let card = false;
</script>

<div class:card>
	<slot />
</div>

<style>
	.card {
		background-color: rgba(255, 255, 255, 1);
		border-color: rgba(215, 222, 228, 1);
		border-width: 1px;
		border-style: solid;
		border-radius: 6px;
		padding: 20px;
	}
</style>

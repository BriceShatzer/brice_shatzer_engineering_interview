<script lang="ts">
	import '../app.css';
	import ComponentWrapper from '$lib/components/ComponentWrapper.svelte';
	import HelloWorld from '$lib/components/HelloWorld.svelte';

	let name = 'World';
	let svelteVersion = '4';
</script>

<ComponentWrapper card>
	<HelloWorld {name} {svelteVersion} />
</ComponentWrapper>

<script lang="ts">
	export let name: string;
	export let svelteVersion: string;
</script>

<h1>Hello {name}</h1>

<p>We're using <strong>Svelte {svelteVersion}</strong> in this project.</p>
<p>
	Visit <a href="https://svelte.dev/docs/svelte/legacy-overview">svelte.dev/docs/kit</a> to read the documentation
</p>

<style>
	h1 {
		font-size: var(--header-lg-fs);
		font-weight: var(--header-fw);
		font-family: var(--header-font);
		color: var(--title-fg-ci);
	}

	p {
		font-size: var(--text-fs);
		font-weight: var(--text-fw);
		font-family: var(--text-font);
	}

	a {
		color: var(--link-fg-ci);
		text-decoration: var(--link-text-decoration);
		text-transform: var(--link-text-transform);
		font-weight: var(--link-fw);
		font-family: var(--link-font);
	}
</style>

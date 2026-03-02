<script lang="ts">
	import { page } from '$app/stores';
	import { resolveRoute } from '$app/paths';
	import logo from '$lib/assets/logo.svg';
</script>

<header class="header">
	<a href={resolveRoute('/accounts')} class="logo" aria-label="NorthWind home">
		<img src={logo} alt="NorthWind" />
	</a>
	<nav aria-label="Main navigation">
		<a
			href={resolveRoute('/accounts')}
			class="nav-link"
			class:active={$page.url.pathname.startsWith('/accounts')}
			aria-current={$page.url.pathname.startsWith('/accounts') ? 'page' : undefined}
		>
			Accounts
		</a>
		<a
			href={resolveRoute('/transfers')}
			class="nav-link"
			class:active={$page.url.pathname.startsWith('/transfers')}
			aria-current={$page.url.pathname.startsWith('/transfers') ? 'page' : undefined}
		>
			Transfers
		</a>
	</nav>
</header>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--s-4) var(--s-6);
		border-bottom: var(--border-thin) solid var(--border-light-ci);
	}

	.logo {
		display: flex;
		align-items: center;
	}

	.logo img {
		height: 24px;
	}

	nav {
		display: flex;
		gap: var(--s-6);
	}

	.nav-link {
		font-family: var(--text-font);
		font-size: var(--text-fs);
		font-weight: var(--fw-medium);
		line-height: 1;
		letter-spacing: 0;
		text-align: center;
		color: var(--c-gray-dark);
		text-decoration: none;
		padding: var(--s-1) 0;
		transition: color 0.15s ease;
	}

	.nav-link:hover {
		color: var(--c-blue);
	}

	.nav-link.active {
		color: var(--c-blue);
	}

	.nav-link:focus-visible {
		outline: 2px solid var(--c-blue);
		outline-offset: 2px;
		border-radius: var(--radius-sm);
	}
</style>

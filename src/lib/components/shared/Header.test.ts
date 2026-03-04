import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import { page } from '$app/stores';
import type { Writable } from 'svelte/store';
import Header from './Header.svelte';

const writablePage = page as unknown as Writable<{ url: { pathname: string } }>;

// The $app/stores alias in vitest.config.ts points to src/__mocks__/app-stores.ts,
// which exports a writable `page` store. Both this test and the Header component
// import the same store instance, so calling page.set() here updates the component.

describe('Header – structure', () => {
	it('renders a logo link with an accessible label', () => {
		const { getByRole } = render(Header);
		expect(getByRole('link', { name: /NorthWind home/i })).toBeTruthy();
	});

	it('renders Accounts and Transfers nav links', () => {
		const { getByRole } = render(Header);
		expect(getByRole('link', { name: /^Accounts$/i })).toBeTruthy();
		expect(getByRole('link', { name: /^Transfers$/i })).toBeTruthy();
	});
});

describe('Header – active link on /accounts', () => {
	beforeEach(() => {
		writablePage.set({ url: { pathname: '/accounts' } });
	});

	it('marks the Accounts link as current page', () => {
		const { getByRole } = render(Header);
		expect(getByRole('link', { name: /^Accounts$/i })).toHaveAttribute('aria-current', 'page');
	});

	it('does not mark the Transfers link as current page', () => {
		const { getByRole } = render(Header);
		expect(getByRole('link', { name: /^Transfers$/i })).not.toHaveAttribute('aria-current', 'page');
	});
});

describe('Header – active link on /transfers', () => {
	beforeEach(() => {
		writablePage.set({ url: { pathname: '/transfers' } });
	});

	it('marks the Transfers link as current page', () => {
		const { getByRole } = render(Header);
		expect(getByRole('link', { name: /^Transfers$/i })).toHaveAttribute('aria-current', 'page');
	});

	it('does not mark the Accounts link as current page', () => {
		const { getByRole } = render(Header);
		expect(getByRole('link', { name: /^Accounts$/i })).not.toHaveAttribute('aria-current', 'page');
	});
});

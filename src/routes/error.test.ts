import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/svelte';
import { page } from '$app/stores';
import type { Writable } from 'svelte/store';
import ErrorPage from './+error.svelte';

type ErrorPageState = { status: number; error: { message: string } | null };
const writablePage = page as unknown as Writable<ErrorPageState>;

describe('ErrorPage – status headings', () => {
	it('shows "Page not found" for 404', () => {
		writablePage.set({ status: 404, error: null });
		const { getByRole } = render(ErrorPage);
		expect(getByRole('heading', { name: /page not found/i })).toBeTruthy();
	});

	it('shows "Access denied" for 403', () => {
		writablePage.set({ status: 403, error: null });
		const { getByRole } = render(ErrorPage);
		expect(getByRole('heading', { name: /access denied/i })).toBeTruthy();
	});

	it('shows "Something went wrong" for other status codes', () => {
		writablePage.set({ status: 500, error: null });
		const { getByRole } = render(ErrorPage);
		expect(getByRole('heading', { name: /something went wrong/i })).toBeTruthy();
	});
});

describe('ErrorPage – error message', () => {
	it('displays the error message when present', () => {
		writablePage.set({ status: 500, error: { message: 'Internal server error' } });
		const { getByText } = render(ErrorPage);
		expect(getByText('Internal server error')).toBeTruthy();
	});

	it('shows fallback text when error is null', () => {
		writablePage.set({ status: 500, error: null });
		const { getByText } = render(ErrorPage);
		expect(getByText('An unexpected error occurred.')).toBeTruthy();
	});
});

describe('ErrorPage – navigation', () => {
	beforeEach(() => {
		writablePage.set({ status: 404, error: null });
	});

	it('renders a link to /accounts', () => {
		const { getByRole } = render(ErrorPage);
		expect(getByRole('link', { name: /go to accounts/i })).toHaveAttribute('href', '/accounts');
	});
});

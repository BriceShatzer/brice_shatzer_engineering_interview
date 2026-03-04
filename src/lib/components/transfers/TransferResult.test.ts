import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import TransferResult from './TransferResult.svelte';

describe('TransferResult — success', () => {
	const successProps = {
		type: 'success' as const,
		amount: 250,
		sourceLabel: 'Everyday Checking...1111',
		destinationLabel: 'High-Yield Savings...2222',
		date: '2024-12-14T00:00:00Z',
		confirmationNumber: 'REF-9999'
	};

	it('should render the success heading', () => {
		render(TransferResult, { props: successProps });
		expect(screen.getByRole('heading', { name: 'Transfer Successful' })).toBeInTheDocument();
	});

	it('should display the formatted transfer amount', () => {
		render(TransferResult, { props: successProps });
		expect(screen.getByText('$250.00')).toBeInTheDocument();
	});

	it('should display the source and destination labels', () => {
		render(TransferResult, { props: successProps });
		expect(screen.getByText('Everyday Checking...1111')).toBeInTheDocument();
		expect(screen.getByText('High-Yield Savings...2222')).toBeInTheDocument();
	});

	it('should display the confirmation number', () => {
		render(TransferResult, { props: successProps });
		expect(screen.getByText('REF-9999')).toBeInTheDocument();
	});

	it('should emit a done event when the Done button is clicked', async () => {
		const { component } = render(TransferResult, { props: successProps });
		const doneEvents: unknown[] = [];
		component.$on('done', () => doneEvents.push(true));

		await fireEvent.click(screen.getByRole('button', { name: 'Done' }));
		expect(doneEvents).toHaveLength(1);
	});

	it('should use role="status" for the success card', () => {
		render(TransferResult, { props: successProps });
		expect(screen.getByRole('status')).toBeInTheDocument();
	});
});

describe('TransferResult — failure', () => {
	const failureProps = {
		type: 'failure' as const,
		errorMessage: 'Insufficient funds'
	};

	it('should render the failure heading', () => {
		render(TransferResult, { props: failureProps });
		expect(screen.getByRole('heading', { name: 'Transfer Failed' })).toBeInTheDocument();
	});

	it('should display the error message', () => {
		render(TransferResult, { props: failureProps });
		expect(screen.getByText('Insufficient funds')).toBeInTheDocument();
	});

	it('should use role="alert" for the failure card', () => {
		render(TransferResult, { props: failureProps });
		expect(screen.getByRole('alert')).toBeInTheDocument();
	});

	it('should emit a done event when Back to transfers is clicked', async () => {
		const { component } = render(TransferResult, { props: failureProps });
		const doneEvents: unknown[] = [];
		component.$on('done', () => doneEvents.push(true));

		await fireEvent.click(screen.getByRole('button', { name: 'Back to transfers' }));
		expect(doneEvents).toHaveLength(1);
	});
});

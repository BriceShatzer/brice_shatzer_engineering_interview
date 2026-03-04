import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { bank, institutionName, currentRoutingNumber } from './bank';
import type { BankResponse } from '$lib/types';

const mockBank: BankResponse = {
	institution: {
		name: 'Test Bank',
		established: '2000',
		address: '123 Main St',
		city: 'Springfield',
		state: 'IL',
		zip_code: '62701',
		website: 'https://testbank.com',
		phone: '555-0100',
		email: 'info@testbank.com'
	},
	routing_numbers: [
		{ routing_number: '021000021', status: 'current', description: 'Primary', valid_for: ['ACH'], acquired_from: undefined },
		{ routing_number: '011000015', status: 'legacy', description: 'Legacy', valid_for: ['ACH'], acquired_from: undefined }
	],
	services: {
		ach_transfers: true,
		wire_transfers: true,
		check_processing: false,
		mobile_banking: true
	},
	business_hours: {
		customer_service: '9am-5pm',
		wire_cutoff: '4pm'
	}
};

describe('bank store', () => {
	beforeEach(() => {
		bank.set(null);
	});

	it('should start as null', () => {
		expect(get(bank)).toBeNull();
	});

	it('should update when set', () => {
		bank.set(mockBank);
		expect(get(bank)).toEqual(mockBank);
	});
});

describe('institutionName derived store', () => {
	beforeEach(() => {
		bank.set(null);
	});

	it('should return the default name when bank is null', () => {
		expect(get(institutionName)).toBe('Northwind Bank');
	});

	it('should return the institution name from bank data', () => {
		bank.set(mockBank);
		expect(get(institutionName)).toBe('Test Bank');
	});
});

describe('currentRoutingNumber derived store', () => {
	beforeEach(() => {
		bank.set(null);
	});

	it('should return null when bank is null', () => {
		expect(get(currentRoutingNumber)).toBeNull();
	});

	it('should return the routing number with status "current"', () => {
		bank.set(mockBank);
		expect(get(currentRoutingNumber)).toBe('021000021');
	});

	it('should return null when no routing number has status "current"', () => {
		bank.set({
			...mockBank,
			routing_numbers: [
				{ routing_number: '011000015', status: 'legacy', description: 'Legacy', valid_for: ['ACH'] }
			]
		});
		expect(get(currentRoutingNumber)).toBeNull();
	});
});

import { describe, it, expect } from 'vitest';
import {
	formatCurrency,
	formatAbsCurrency,
	formatSignedCurrency,
	maskAccountNumber,
	formatAccountLabel,
	formatDate,
	formatFullDate
} from './format';

describe('formatCurrency', () => {
	it('should format a positive amount as USD currency', () => {
		expect(formatCurrency(1234.56)).toBe('$1,234.56');
	});

	it('should format zero as $0.00', () => {
		expect(formatCurrency(0)).toBe('$0.00');
	});

	it('should format a negative amount with a minus sign', () => {
		expect(formatCurrency(-50.5)).toBe('-$50.50');
	});

	it('should always show two decimal places', () => {
		expect(formatCurrency(100)).toBe('$100.00');
	});

	it('should handle large amounts with commas', () => {
		expect(formatCurrency(1000000)).toBe('$1,000,000.00');
	});
});

describe('formatAbsCurrency', () => {
	it('should format a positive amount as-is', () => {
		expect(formatAbsCurrency(50)).toBe('$50.00');
	});

	it('should format a negative amount as its absolute value', () => {
		expect(formatAbsCurrency(-82.45)).toBe('$82.45');
	});

	it('should format zero as $0.00', () => {
		expect(formatAbsCurrency(0)).toBe('$0.00');
	});
});

describe('formatSignedCurrency', () => {
	it('should prefix positive amounts with a plus sign', () => {
		expect(formatSignedCurrency(200)).toBe('+$200.00');
	});

	it('should prefix negative amounts with a minus sign', () => {
		expect(formatSignedCurrency(-75.25)).toBe('-$75.25');
	});

	it('should treat zero as positive', () => {
		expect(formatSignedCurrency(0)).toBe('+$0.00');
	});
});

describe('maskAccountNumber', () => {
	it('should replace all but the last four digits with asterisks', () => {
		expect(maskAccountNumber('123456789')).toBe('****6789');
	});

	it('should work when the account number is exactly four digits', () => {
		expect(maskAccountNumber('1234')).toBe('****1234');
	});

	it('should work with a long account number', () => {
		expect(maskAccountNumber('00112233445566')).toBe('****5566');
	});
});

describe('formatAccountLabel', () => {
	it('should combine display name with last four digits of account number', () => {
		expect(formatAccountLabel('Everyday Checking', '123456789')).toBe('Everyday Checking...6789');
	});

	it('should use the actual last four characters of the account number', () => {
		expect(formatAccountLabel('Savings', '9999')).toBe('Savings...9999');
	});
});

describe('formatDate', () => {
	it('should format a date string as short month and day', () => {
		const result = formatDate('2024-12-14T10:30:00Z');
		expect(result).toMatch(/Dec 14/);
	});

	it('should handle the first of a month', () => {
		const result = formatDate('2024-01-01T12:00:00Z');
		expect(result).toMatch(/Jan 1/);
	});
});

describe('formatFullDate', () => {
	it('should format a date string with full month name and day', () => {
		const result = formatFullDate('2024-12-14T10:30:00Z');
		expect(result).toMatch(/December 14/);
	});

	it('should handle different months', () => {
		const result = formatFullDate('2024-06-15T12:00:00Z');
		expect(result).toMatch(/June 15/);
	});
});

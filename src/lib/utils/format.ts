export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2
	}).format(amount);
}

export function formatAbsCurrency(amount: number): string {
	return formatCurrency(Math.abs(amount));
}

export function formatSignedCurrency(amount: number): string {
	const prefix = amount >= 0 ? '+' : '-';
	return `${prefix}${formatAbsCurrency(amount)}`;
}

export function maskAccountNumber(accountNumber: string): string {
	const lastFour = accountNumber.slice(-4);
	return `****${lastFour}`;
}

export function formatAccountLabel(displayName: string, accountNumber: string): string {
	const suffix = accountNumber.slice(-4);
	return `${displayName}...${suffix}`;
}

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric'
	});
}

export function formatFullDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric'
	});
}

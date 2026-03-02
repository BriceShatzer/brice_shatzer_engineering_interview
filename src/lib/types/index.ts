export type AccountType = 'CHECKING' | 'SAVINGS' | 'CD' | 'LOAN';
export type AccountStatus = 'ACTIVE' | 'FROZEN' | 'CLOSED';

export interface AccountSummary {
	account_id: string;
	account_number: string;
	routing_number: string;
	account_type: AccountType;
	account_status: AccountStatus;
	account_holder_name: string;
	balance: number;
	currency: string;
	opened_date: string;
}

export interface PaginationInfo {
	total: number;
	page: number;
	per_page: number;
}

export interface AccountsResponse {
	accounts: AccountSummary[];
	pagination: PaginationInfo;
}

export interface TransferAccountDetails {
	account_number: string;
	account_holder_name: string;
	institution_name: string;
	routing_number: string;
}

export interface TransferRequest {
	amount: number;
	currency: string;
	description: string;
	destination_account: TransferAccountDetails;
	direction: 'INBOUND' | 'OUTBOUND';
	reference_number: string;
	source_account: TransferAccountDetails;
	transfer_type: string;
}

export interface TransferStatusResponse {
	transfer_id: string;
	status: string;
	reference_number: string;
	amount: number;
	currency: string;
	description: string;
	direction: string;
	transfer_type: string;
	source_account: TransferAccountDetails;
	destination_account: TransferAccountDetails;
	initiated_date: string;
	expected_completion_date: string;
	fee: number;
}

export interface TransferSummary {
	transfer_id: string;
	amount: number;
	currency: string;
	description: string;
	transfer_type: string;
	status: string;
	direction: string;
	reference_number: string;
	fee: number;
	initiated_date: string;
	processing_date: string;
	expected_completion_date: string;
	completed_date?: string;
	source_account: TransferAccountDetails;
	destination_account: TransferAccountDetails;
}

export interface TransferListResponse {
	transfers: TransferSummary[];
	pagination: PaginationInfo;
}

export interface ApiErrorDetail {
	code: string;
	message: string;
	request_id: string;
	timestamp: string;
	details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
	error: ApiErrorDetail;
}

export interface ValidationIssue {
	field: string;
	code: string;
	message: string;
	severity: 'error' | 'warning' | 'info';
}

export interface ValidationResponse {
	validation: {
		valid: boolean;
		issues: ValidationIssue[];
		validation_time: string;
		metadata?: Record<string, unknown>;
	};
	data?: unknown;
}

export interface ActivityItem {
	id: string;
	description: string;
	date: string;
	accountName: string;
	amount: number;
	icon: string;
}

export interface RecentTransfer {
	id: string;
	toAccountName: string;
	date: string;
	fromDescription: string;
	amount: number;
	icon: string;
}

export type ErrorCategory = "IRI" | "PART" | "PACKAGE" | "RELATIONSHIP";

export type ErrorCode =
	| "INVALID_STRING"
	| "MISSING_AUTHORITY"
	| "MISSING_SCHEME"
	| "NOT_FOUND"
	| "INTERNAL"
	| "CONFLICT";

export type ErrorResult = {
	Category: ErrorCategory | string;
	Code: ErrorCode | string;

	Message?: string;

	Error?: Error;
};

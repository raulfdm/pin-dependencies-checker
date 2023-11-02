export function exitWithSuccess(): void {
	process.exit(0);
}

export function exitWithError(): void {
	process.exit(1);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function log(message?: any, ...optionalParams: any[]): void {
	console.log(message, ...optionalParams);
}

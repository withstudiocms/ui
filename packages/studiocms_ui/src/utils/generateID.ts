function generateID(prefix: string): string {
	return `${prefix}-${Math.random().toString(16).slice(2)}`;
}

export { generateID };

export function getCaller(): string {
	// https://stackoverflow.com/a/3806596/9929789
	const caller_line = new Error().stack!.split('\n')[3];
	const index = caller_line.indexOf('at ');
	return caller_line.slice(index + 3, caller_line.length);
}

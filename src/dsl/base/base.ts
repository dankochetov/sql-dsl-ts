import Stack from '../stack';

export interface Element {
	toString(): string;

	__isElement(): true;
}

export class StringElement implements Element {
	constructor(public value: Element | string) {}

	toString(): string {
		if (typeof this.value === 'string') {
			return this.value;
		}
		return this.value.toString();
	}

	static createStatic(value: Element | string) {
		return class StaticStringElement extends StringElement {
			constructor() {
				super(value);
			}
		};
	}

	__isElement(): true {
		return true;
	}
}

export class OptionalStringElement implements Element {
	private value: StringElement;

	constructor(public enabled: boolean, value: Element | string) {
		this.value = new StringElement(enabled ? value : '');
	}

	static createStatic(value: string) {
		return class StaticOptionalStringElement extends OptionalStringElement {
			constructor(enabled: boolean = false) {
				super(enabled, value);
			}
		};
	}

	toString(): string {
		return this.value.toString();
	}

	__isElement(): true {
		return true;
	}
}

export interface NameOptions {
	forceAddQuotes?: boolean;
}

export class Name extends StringElement {
	constructor(value: string, options: NameOptions = {}) {
		super(
			(() => {
				if (options.forceAddQuotes || /^[^a-z_]|.[^a-z0-9_]/.test(value)) {
					return `"${value}"`;
				}
				return value;
			})(),
		);
	}
}

export function stringValue(value: string) {
	return new StringElement(`'${value}'`);
}

type MaybeImplements<T> = { [key in keyof T]?: unknown };

export interface HasName {
	setName(name: Name): Name;
}

export function implementsHasName(el: unknown): el is HasName {
	return typeof el === 'object' && typeof (el as MaybeImplements<HasName>).setName === 'function';
}

export function name(name: string, options?: NameOptions): Name {
	const el = Stack.current();
	if (implementsHasName(el)) {
		return el.setName(new Name(name, options));
	}

	throw new Error(`Current element does not support name()`);
}

export const IfNotExists = OptionalStringElement.createStatic('if not exists');
export type IfNotExists = typeof IfNotExists.prototype;

export function if_not_exists() {
	const el = Stack.current();
	if (implementsHasIfNotExists(el)) {
		return el.setIfNotExists();
	}

	throw new Error(`Current element does not support if_not_exists()`);
}

export interface HasIfNotExists {
	setIfNotExists(): IfNotExists;
}

export function implementsHasIfNotExists(el: unknown): el is HasIfNotExists {
	return (
		typeof el === 'object' &&
		typeof (el as MaybeImplements<HasIfNotExists>).setIfNotExists === 'function'
	);
}

export const Unique = OptionalStringElement.createStatic('unique');
export type Unique = typeof Unique.prototype;

export interface HasUnique {
	setUnique(): Unique;
}

export function implementsHasUnique(el: unknown): el is HasUnique {
	return (
		typeof el === 'object' && typeof (el as MaybeImplements<HasUnique>).setUnique === 'function'
	);
}

export function unique() {
	const el = Stack.current();
	if (implementsHasUnique(el)) {
		return el.setUnique();
	}

	throw new Error(`Current element does not support unique()`);
}

import { Element, HasName, name, Name, unique, Unique } from './base';
import { Column } from './table';
import { getCaller } from '../utils';
import Stack from './stack';

export class Index implements Element, HasName {
	constructor(public caller: string) {}

	name: Name | undefined;
	setName(name: Name): Name {
		return (this.name = name);
	}

	unique = new Unique();
	setUnique() {
		return (this.unique = new Unique(true));
	}

	on: Column | undefined;
	setOn(c: Column) {
		return (this.on = c);
	}

	toString() {
		const { name, unique, on, caller } = this;

		if (!name) {
			throw new Error(`Index name is not specified. Source: ${caller}`);
		}
		if (!on) {
			throw new Error(`Index column is not specified. Source: ${caller}`);
		}

		return `create ${unique} index ${name} on ${on.table.name}(${on.name})`;
	}

	__isElement(): true {
		return true;
	}
}

function getClosestTableIndex(currentOnly: boolean = false): Index {
	const c = Stack.findClosest((el): el is Index => el instanceof Index, currentOnly);
	if (!c) {
		throw new Error('this function should only be called inside index()');
	}
	return c;
}

function createIndex(
	builder: () => [string, Column, ...unknown[]] | void,
	isUnique: boolean = false,
): Index {
	const i = new Index(getCaller());
	Stack.push(i, true);
	const res = builder();
	if (res) {
		const [nameStr, c] = res;
		name(nameStr);
		on(c);
	}
	if (isUnique) {
		unique();
	}
	Stack.pop();
	return i;
}

export function index(builder: () => [string, Column, ...unknown[]] | void): Index {
	return createIndex(builder);
}

export function unique_index(builder: () => [string, Column, ...unknown[]] | void): Index {
	return createIndex(builder, true);
}

export function on(c: Column) {
	return getClosestTableIndex(true).setOn(c);
}

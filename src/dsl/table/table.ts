import {
	Element,
	HasIfNotExists,
	HasName,
	IfNotExists,
	Name,
	OptionalStringElement,
} from '../base';
import { Column } from './column';
import Stack from '../stack';
import { getCaller } from '../../utils';
import { Index } from '../tableIndex';

export class Table implements Element, HasName, HasIfNotExists {
	constructor(public caller: string) {}

	name: Name | undefined;

	setName(name: Name) {
		return (this.name = name);
	}

	columns: Column[] = [];
	createColumn(caller: string): Column {
		const c = new Column(this, caller);
		this.columns.push(c);
		return c;
	}

	ifNotExists = new IfNotExists();
	setIfNotExists() {
		return (this.ifNotExists = new IfNotExists(true));
	}

	toString(): string {
		const { name, columns, ifNotExists, caller } = this;

		if (!name) {
			throw new Error(`Table name is not specified for column. Source: ${caller}`);
		}
		if (!columns.length) {
			throw new Error(`Table should have at least 1 column. Source: ${caller}`);
		}

		const columnsStr = this.columns.join(',');
		return `
			create table ${name} ${ifNotExists}(
				${columnsStr}
			)
		`;
	}

	__isElement(): true {
		return true;
	}
}

export function getClosestTable(currentOnly: boolean = false): Table {
	const t = Stack.findClosest((el): el is Table => el instanceof Table, currentOnly);
	if (!t) {
		throw new Error('this function should only be called inside table()');
	}
	return t;
}

type TableResult<T> = {
	table: Table;
	refs: T;
};

export function table<TRefs>(builder: () => TRefs): TableResult<TRefs> {
	const t = new Table(getCaller());
	Stack.push(t, true);
	const refs = builder();
	Stack.pop();

	return {
		table: t,
		refs,
	};
}

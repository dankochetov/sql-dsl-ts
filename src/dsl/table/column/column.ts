import {
	Element,
	HasName,
	HasUnique,
	name,
	Name,
	OptionalStringElement,
	StringElement,
	Unique,
} from '../../base';
import { getClosestTable, Table } from '../table';
import { Type } from './types';
import Stack from '../../stack';
import { getCaller } from '../../../utils';

export class Column implements Element, HasName, HasUnique {
	constructor(public table: Table, public caller: string) {}

	name: Name | undefined;
	setName(name: Name) {
		return (this.name = name);
	}

	type: Type | undefined;
	setType(type: Type) {
		return (this.type = type);
	}

	autoIncrement = new AutoIncrement();
	setAutoIncrement() {
		return (this.autoIncrement = new AutoIncrement(true));
	}

	notNull = new NotNull();
	setNotNull() {
		return (this.notNull = new NotNull(true));
	}

	defaultValue = new DefaultValue();
	setDefaultValue(value: Element | string) {
		return (this.defaultValue = new DefaultValue(value));
	}

	primaryKey = new PrimaryKey();
	setPrimaryKey() {
		return (this.primaryKey = new PrimaryKey(true));
	}

	unique = new Unique();
	setUnique() {
		return (this.unique = new Unique(true));
	}

	foreignKeys: ForeignKey[] = [];
	addForeignKey(fk: ForeignKey) {
		this.foreignKeys.push(fk);
		return fk;
	}

	toString(): string {
		const { name, notNull, autoIncrement, primaryKey, defaultValue, caller, foreignKeys } =
			this;

		const type = (() => {
			if (this.type) {
				return this.type;
			}

			if (foreignKeys.length) {
				return foreignKeys[0].column.type;
			}
		})();

		if (!name) {
			throw new Error(`Column name is not specified. Source: ${caller}`);
		}

		if (!type) {
			throw new Error(`Column type is not specified. Source: ${caller}`);
		}

		const foreignKeysStr = this.foreignKeys.join(' ');

		return `${name} ${type} ${notNull} ${defaultValue} ${autoIncrement} ${primaryKey} ${foreignKeysStr}`.trim();
	}

	__isElement(): true {
		return true;
	}
}

export function column(builder: () => [string, Type, ...unknown[]] | void): Column {
	const c = getClosestTable().createColumn(getCaller());
	Stack.push(c);
	const res = builder();
	if (res) {
		const [nameStr, typeObj] = res;
		name(nameStr);
		type(typeObj);
	}
	Stack.pop();
	return c;
}

function getClosestColumn(currentOnly: boolean = false): Column {
	const c = Stack.findClosest((el): el is Column => el instanceof Column, currentOnly);
	if (!c) {
		throw new Error('this function should only be called inside column()');
	}
	return c;
}

export function type(type: Type): Type {
	return getClosestColumn().setType(type);
}

export const AutoIncrement = OptionalStringElement.createStatic('auto_increment');
export type AutoIncrement = typeof AutoIncrement.prototype;

export function auto_increment() {
	getClosestColumn(true).setAutoIncrement();
}

export const NotNull = OptionalStringElement.createStatic('not null');
export type NotNull = typeof NotNull.prototype;

export function not_null() {
	return getClosestColumn(true).setNotNull();
}

export class DefaultValue extends OptionalStringElement {
	constructor(value?: Element | string) {
		super(
			...((): [boolean, Element | string] => {
				if (typeof value !== 'undefined') {
					return [true, `default ${value}`];
				}
				return [false, ''];
			})(),
		);
	}
}

export function default_value(value: Element | string) {
	getClosestColumn(true).setDefaultValue(value);
}

export const PrimaryKey = OptionalStringElement.createStatic('primary key');
export type PrimaryKey = typeof PrimaryKey.prototype;

export function primary_key() {
	return getClosestColumn(true).setPrimaryKey();
}

export class ForeignKey extends StringElement {
	constructor(public column: Column) {
		super(`references ${column.table.name}(${column.name})`);
	}
}

export function references(column: Column) {
	return getClosestColumn(true).addForeignKey(new ForeignKey(column));
}

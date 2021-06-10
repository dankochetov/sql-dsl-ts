import { OptionalStringElement, StringElement } from '../../base';

export function serial() {
	return new Serial();
}

export function int(len?: number) {
	return new Int(len);
}

export function varchar(len?: number) {
	return new VarChar(len);
}

export function timestamp(params?: TimestampParams) {
	return new Timestamp(params);
}

export function timestamp_without_time_zone() {
	return new Timestamp({ withoutTimeZone: true });
}

export function bool() {
	return new Bool();
}

export function text() {
	return new Text();
}

export function custom(value: string) {
	return new Custom(value);
}

export class Type extends StringElement {
	static createStatic(value: string) {
		return class StaticType extends Type {
			constructor() {
				super(value);
			}
		};
	}
}

export const Serial = Type.createStatic('serial');
export type Serial = typeof Serial.prototype;

export class Int extends Type {
	constructor(len?: number) {
		super(typeof len === 'number' ? `int(${len})` : 'int');
	}
}

export class VarChar extends Type {
	len: number | undefined;

	constructor(len?: number) {
		super(
			(() => {
				if (typeof len === 'number') {
					return `varchar(${len})`;
				}
				return 'varchar';
			})(),
		);
		this.len = len;
	}
}

interface TimestampParams {
	withoutTimeZone?: boolean;
}
export class Timestamp extends Type {
	constructor({ withoutTimeZone = false }: TimestampParams = {}) {
		super(
			(() => {
				const withoutTimezoneElement = new OptionalStringElement(
					withoutTimeZone,
					'without time zone',
				);
				return `timestamp ${withoutTimezoneElement}`;
			})(),
		);
	}
}

export const Bool = Type.createStatic('bool');
export type Bool = typeof Bool.prototype;

export const Text = Type.createStatic('text');
export type Text = typeof Text.prototype;

export class Custom extends Type {
	constructor(value: string) {
		super(value);
	}
}

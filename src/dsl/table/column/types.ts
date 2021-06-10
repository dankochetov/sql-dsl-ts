import { OptionalStringElement, StringElement } from '../../base';

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

export function serial() {
	return new Serial();
}

export class Int extends Type {
	constructor(len?: number) {
		super(typeof len === 'number' ? `int(${len})` : 'int');
	}
}

export function int(len?: number) {
	return new Int(len);
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

export function varchar(len?: number) {
	return new VarChar(len);
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

export function timestamp(params?: TimestampParams) {
	return new Timestamp(params);
}

export function timestamp_without_time_zone() {
	return new Timestamp({ withoutTimeZone: true });
}

export const Bool = Type.createStatic('bool');
export type Bool = typeof Bool.prototype;

export function bool() {
	return new Bool();
}

export const Text = Type.createStatic('text');
export type Text = typeof Text.prototype;

export function text() {
	return new Text();
}

export class Custom extends Type {
	constructor(value: string) {
		super(value);
	}
}

export function custom(value: string) {
	return new Custom(value);
}

interface TimeParams {
	withTimeZone?: boolean;
}
export class Time extends Type {
	constructor({ withTimeZone = false }: TimeParams = {}) {
		super(
			(() => {
				const withTimezoneElement = new OptionalStringElement(
					withTimeZone,
					'with time zone',
				);
				return `time ${withTimezoneElement}`;
			})(),
		);
	}
}

export function time(params?: TimeParams) {
	return new Time(params);
}

export function time_with_time_zone() {
	return new Timestamp({ withoutTimeZone: true });
}

interface NumericParams {
	precision?: number;
	scale?: number;
}
export class Numeric extends Type {
	constructor(public params: NumericParams) {
		super(
			(() => {
				const paramsStr = [params.precision, params.scale]
					.filter((n) => typeof n === 'number')
					.join(', ');

				return `numeric(${paramsStr})`;
			})(),
		);
	}
}

export function numeric(precision?: number, scale?: number) {
	return new Numeric({ precision, scale });
}

export const Date = Type.createStatic('date');
export type Date = typeof Date.prototype;

export function date() {
	return new Date();
}

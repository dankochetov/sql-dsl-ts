#! /usr/bin/env ts-node

import fs from 'fs';
import { format } from 'sql-formatter';

import '../example';
import Stack from '../dsl/stack';

function codegen(): string {
	const rootElements = Stack.getRootElements();
	return format(rootElements.join(';') + ';');
}

const res = codegen();
fs.writeFileSync('./example.sql', res);

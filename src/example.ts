import {
	name,
	column,
	table,
	type,
	not_null,
	primary_key,
	default_value,
	references,
	unique_index,
} from './dsl';
import {
	bool,
	int,
	serial,
	text,
	timestamp,
	timestamp_without_time_zone,
	varchar,
} from './dsl/column-types';

// Helpers

// Shorthand to create an 'id serial not null primary key' column
const idSerial = (builder?: () => void) =>
	column(() => {
		name('id');
		type(serial());
		not_null();
		primary_key();
		builder?.();
	});

// Shorthand to create a 'created_at' column
const createdAt = (builder?: () => void) =>
	column(() => {
		name('created_at');
		type(timestamp_without_time_zone());
		not_null();
		default_value('now()');
		builder?.();
	});

// Shorthand to create an 'updated_at' column
const updatedAt = (builder?: () => void) =>
	column(() => {
		name('updated_at');
		type(timestamp_without_time_zone());
		not_null();
		default_value('now()');
		builder?.();
	});

// Helper to create a table with created_at and updated_at as defined above
const tableWithCreatedUpdated = <TRefs>(builder: () => TRefs) =>
	table(() => {
		const refs = builder();
		createdAt();
		updatedAt();
		return refs;
	});

const countries = table(() => {
	name('countries');

	const id = idSerial();
	column(() => ['name', varchar()]);
	column(() => ['country_code', varchar()]);

	return { id };
});

table(() => {
	name('cities');

	idSerial();
	column(() => ['name', varchar(), not_null()]);
	column(() => ['name_ascii', varchar()]);
	column(() => ['country_id', int(), references(countries.refs.id)]);
});

table(() => {
	name('admins');

	idSerial();
});

tableWithCreatedUpdated(() => {
	name('auth_otp');

	idSerial();
	column(() => ['phone', varchar()]);
	column(() => ['otp', varchar()]);
	column(() => ['issued_at', timestamp_without_time_zone()]);
	column(() => ['language', varchar()]);
});

const customers = table(() => {
	name('customers');

	const id = idSerial();
	column(() => ['phone_number', varchar()]);

	return { id };
});

table(() => {
	name('buyers_info');

	column(() => {
		name('customer_id');
		type(int());
		primary_key();
		not_null();
		references(customers.refs.id);
	});
});

const users = tableWithCreatedUpdated(() => {
	name('users');

	const id = idSerial();
	column(() => ['phone', varchar()]);
	column(() => ['full_name', varchar()]);
	column(() => ['city', varchar()]);
	column(() => ['deleted', bool()]);
	column(() => ['email', text()]);
	column(() => ['utm_term', text()]);
	column(() => ['utm_content', text()]);

	return { id };
});

table(() => {
	name('statistics');

	column(() => ['user_id', int(), not_null(), primary_key(), references(users.refs.id)]);
	column(() => ['visits', int()]);
	column(() => ['date', timestamp()]);
	createdAt();
});

table(() => {
	name('oauthusers');

	idSerial();
	column(() => ['user_id', int()]);
});

tableWithCreatedUpdated(() => {
	name('o_auth_buyers');

	idSerial();
	column(() => ['customer_id', int(), references(customers.refs.id)]);
	column(() => ['id_token', varchar()]);
	column(() => ['refresh_token', varchar()]);
});

const shortLinks = tableWithCreatedUpdated(() => {
	name('short_links');

	const id = column(() => ['id', varchar(), not_null(), primary_key()]);
	column(() => ['type', varchar()]);

	return { id };
});

const userProducts = table(() => {
	name('user_products');

	const id = idSerial();
	const userId = column(() => ['user_id', int(), references(users.refs.id)]);
	column(() => ['name', varchar()]);

	return { id, userId };
});

unique_index(() => ['user_products__user_id__idx', userProducts.refs.userId]);

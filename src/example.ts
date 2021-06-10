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
	index,
} from './dsl';
import {
	bool,
	date,
	int,
	numeric,
	serial,
	text,
	time_with_time_zone,
	timestamp,
	timestamp_without_time_zone,
	varchar,
} from './dsl/column-types';

// Helpers

const money = () => numeric(100, 2);

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

	column(() => ['customer_id', int(), primary_key(), not_null(), references(customers.refs.id)]);
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

const userProductCategories = table(() => {
	name('user_product_categories');

	const id = idSerial();
	column(() => ['name', varchar()]);
	column(() => ['image', varchar()]);

	return { id };
});

const userProducts = table(() => {
	name('user_products');

	const id = idSerial();
	const userId = column(() => ['user_id', int(), references(users.refs.id)]);
	column(() => ['name', varchar()]);
	column(() => ['description', text()]);
	column(() => ['product_id', text(), references(userProductCategories.refs.id)]);
	column(() => ['short_link_id', varchar(), references(shortLinks.refs.id)]);
	column(() => ['delivery_days', text()]);
	column(() => ['delivery_time_from', time_with_time_zone()]);
	column(() => ['delivery_time_to', time_with_time_zone()]);
	column(() => ['standard_charge', money()]);
	column(() => ['is_choosable', bool()]);
	column(() => ['deleted', bool()]);

	return { id, userId };
});
index(() => ['user_products__user_id__idx', userProducts.refs.userId]);

const userItemUnits = table(() => {
	name('user_item_units');

	const id = idSerial();
	column(() => ['name', varchar()]);

	return { id };
});

tableWithCreatedUpdated(() => {
	name('user_products_stats');

	column(() => [
		'product_id',
		int(),
		primary_key(),
		not_null(),
		references(userProducts.refs.id),
	]);
	column(() => ['visits', int()]);
	column(() => ['date', date()]);
});

const userItems = table(() => {
	name('user_items');

	const id = idSerial();
	column(() => ['user_id', int(), references(users.refs.id)]);
	column(() => ['code', varchar()]);
	column(() => ['unit_id', int(), references(userItemUnits.refs.id)]);
	column(() => ['price', money()]);
	column(() => ['is_listed', bool()]);
	column(() => ['image_urls', varchar()]);
	column(() => ['deleted', bool()]);

	return { id };
});

const userProductItems = table(() => {
	name('user_product_items');

	idSerial();
	const productId = column(() => ['product_id', int(), references(userProducts.refs.id)]);
	column(() => ['item_id', int(), references(userItems.refs.id)]);
	column(() => ['custom_price', money()]);
	column(() => ['deleted', bool()]);

	return { productId };
});
index(() => ['user_product_items__product_id__idx', userProductItems.refs.productId]);

const orders = tableWithCreatedUpdated(() => {
	name('orders');

	const id = idSerial();
	const productId = column(() => ['product_id', int(), references(userProducts.refs.id)]);
	const userId = column(() => ['user_id', int(), references(users.refs.id)]);
	column(() => ['customer_id', int(), references(customers.refs.id)]);
	column(() => ['link', varchar(), references(shortLinks.refs.id)]);
	column(() => ['delivery_date', timestamp()]);
	column(() => ['notes', text()]);
	column(() => ['status', varchar()]);
	column(() => ['postcode', varchar()]);
	column(() => ['city', text()]);
	column(() => ['tax_amount', money()]);
	column(() => ['standard_charge', money()]);

	return { id, productId, userId };
});
index(() => ['orders__product_id__idx', orders.refs.productId]);
index(() => ['orders__user_id__idx', orders.refs.userId]);

const userOrderItems = table(() => {
	name('user_order_items');

	idSerial();
	const orderId = column(() => ['order_id', int(), references(orders.refs.id)]);
	column(() => ['item_id', int(), references(userItems.refs.id)]);
	column(() => ['price', money()]);
	column(() => ['quantity', int()]);

	return { orderId };
});
index(() => ['user_order_items__order_id__idx', userOrderItems.refs.orderId]);

const userRequests = table(() => {
	name('user_requests');

	const id = idSerial();
	const productId = column(() => ['product_id', int(), references(userProducts.refs.id)]);
	const userId = column(() => ['user_id', int(), references(users.refs.id)]);
	column(() => ['is_viewed', bool()]);
	column(() => ['phone_number', varchar()]);
	column(() => ['notes', text()]);
	column(() => ['status', varchar()]);

	return { id, productId, userId };
});
index(() => ['user_requests__product_id__idx', userRequests.refs.productId]);
index(() => ['user_requests__user_id__idx', userRequests.refs.userId]);

const userRequestItems = tableWithCreatedUpdated(() => {
	name('user_request_items');

	idSerial();
	const requestId = column(() => ['request_id', int(), userRequests.refs.id]);
	column(() => ['item_id', int(), userItems.refs.id]);

	return { requestId };
});
index(() => ['user_request_items__request_id__idx', userRequestItems.refs.requestId]);

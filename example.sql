create table countries (
  id serial not null primary key,
  name varchar,
  country_code varchar
);
create table cities (
  id serial not null primary key,
  name varchar not null,
  name_ascii varchar,
  country_id int references countries(id)
);
create table admins (id serial not null primary key);
create table auth_otp (
  id serial not null primary key,
  phone varchar,
  otp varchar,
  issued_at timestamp without time zone,
  language varchar,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now()
);
create table customers (id serial not null primary key, phone_number varchar);
create table buyers_info (
  customer_id int not null primary key references customers(id)
);
create table users (
  id serial not null primary key,
  phone varchar,
  full_name varchar,
  city varchar,
  deleted bool,
  email text,
  utm_term text,
  utm_content text,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now()
);
create table statistics (
  user_id int not null primary key references users(id),
  visits int,
  date timestamp,
  created_at timestamp without time zone not null default now()
);
create table oauthusers (id serial not null primary key, user_id int);
create table o_auth_buyers (
  id serial not null primary key,
  customer_id int references customers(id),
  id_token varchar,
  refresh_token varchar,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now()
);
create table short_links (
  id varchar not null primary key,
  type varchar,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now()
);
create table user_product_categories (
  id serial not null primary key,
  name varchar,
  image varchar
);
create table user_products (
  id serial not null primary key,
  user_id int references users(id),
  name varchar,
  description text,
  product_id text references user_product_categories(id),
  short_link_id varchar references short_links(id),
  delivery_days text,
  delivery_time_from timestamp without time zone,
  delivery_time_to timestamp without time zone,
  standard_charge numeric(100, 2),
  is_choosable bool,
  deleted bool
);
create index user_products__user_id__idx on user_products(user_id);
create table user_item_units (id serial not null primary key, name varchar);
create table user_products_stats (
  product_id int not null primary key references user_products(id),
  visits int,
  date date,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now()
);
create table user_items (
  id serial not null primary key,
  user_id int references users(id),
  code varchar,
  unit_id int references user_item_units(id),
  price numeric(100, 2),
  is_listed bool,
  image_urls varchar,
  deleted bool
);
create table user_product_items (
  id serial not null primary key,
  product_id int references user_products(id),
  item_id int references user_items(id),
  custom_price numeric(100, 2),
  deleted bool
);
create index user_product_items__product_id__idx on user_product_items(product_id);
create table orders (
  id serial not null primary key,
  product_id int references user_products(id),
  user_id int references users(id),
  customer_id int references customers(id),
  link varchar references short_links(id),
  delivery_date timestamp,
  notes text,
  status varchar,
  postcode varchar,
  city text,
  tax_amount numeric(100, 2),
  standard_charge numeric(100, 2),
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now()
);
create index orders__product_id__idx on orders(product_id);
create index orders__user_id__idx on orders(user_id);
create table user_order_items (
  id serial not null primary key,
  order_id int references orders(id),
  item_id int references user_items(id),
  price numeric(100, 2),
  quantity int
);
create index user_order_items__order_id__idx on user_order_items(order_id);
create table user_requests (
  id serial not null primary key,
  product_id int references user_products(id),
  user_id int references users(id),
  is_viewed bool,
  phone_number varchar,
  notes text,
  status varchar
);
create index user_requests__product_id__idx on user_requests(product_id);
create index user_requests__user_id__idx on user_requests(user_id);
create table user_request_items (
  id serial not null primary key,
  request_id int,
  item_id int,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now()
);
create index user_request_items__request_id__idx on user_request_items(request_id);
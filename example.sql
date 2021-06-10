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
create table user_products (
  id serial not null primary key,
  user_id int references users(id),
  name varchar
);
create unique index user_products__user_id__idx on user_products(user_id);
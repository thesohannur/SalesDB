-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.categories (
  category_id integer NOT NULL,
  category_name character varying,
  parent_category_id integer,
  CONSTRAINT categories_pkey PRIMARY KEY (category_id),
  CONSTRAINT categories_parent_category_id_fkey FOREIGN KEY (parent_category_id) REFERENCES public.categories(category_id)
);
CREATE TABLE public.customers (
  customer_id integer NOT NULL,
  first_name character varying,
  last_name character varying,
  email character varying,
  phone character varying,
  division character varying,
  district character varying,
  address text,
  registration_date date,
  CONSTRAINT customers_pkey PRIMARY KEY (customer_id)
);
CREATE TABLE public.inventory (
  inventory_id integer NOT NULL,
  product_id integer,
  warehouse_id integer,
  stock_remaining integer,
  restock_date date,
  min_stock_level integer,
  CONSTRAINT inventory_pkey PRIMARY KEY (inventory_id),
  CONSTRAINT inventory_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id),
  CONSTRAINT inventory_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(warehouse_id)
);
CREATE TABLE public.order_items (
  order_item_id integer NOT NULL,
  order_id integer,
  product_id integer,
  quantity integer,
  unit_price numeric,
  line_total numeric,
  CONSTRAINT order_items_pkey PRIMARY KEY (order_item_id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id),
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(product_id)
);
CREATE TABLE public.orders (
  order_id integer NOT NULL,
  order_date timestamp without time zone,
  customer_id integer,
  order_status character varying,
  total_amount numeric,
  CONSTRAINT orders_pkey PRIMARY KEY (order_id),
  CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(customer_id)
);
CREATE TABLE public.payments (
  payment_id integer NOT NULL,
  order_id integer,
  payment_date timestamp without time zone,
  payment_method character varying,
  payment_status character varying,
  amount numeric,
  CONSTRAINT payments_pkey PRIMARY KEY (payment_id),
  CONSTRAINT payments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id)
);
CREATE TABLE public.products (
  product_id integer NOT NULL,
  product_name character varying,
  description text,
  price numeric,
  cogs numeric,
  category_id integer,
  seller_id integer,
  CONSTRAINT products_pkey PRIMARY KEY (product_id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(category_id),
  CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.sellers(seller_id)
);
CREATE TABLE public.returns (
  return_id integer NOT NULL,
  order_item_id integer,
  return_reason text,
  return_status character varying,
  return_date date,
  refund_amount numeric,
  refund_method character varying,
  CONSTRAINT returns_pkey PRIMARY KEY (return_id),
  CONSTRAINT returns_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.order_items(order_item_id)
);
CREATE TABLE public.sellers (
  seller_id integer NOT NULL,
  seller_name character varying,
  brand_type character varying,
  contact_email character varying,
  CONSTRAINT sellers_pkey PRIMARY KEY (seller_id)
);
CREATE TABLE public.shipping (
  shipping_id integer NOT NULL,
  order_id integer,
  shipping_date date,
  estimated_delivery date,
  actual_delivery date,
  delivery_status character varying,
  tracking_number character varying,
  CONSTRAINT shipping_pkey PRIMARY KEY (shipping_id),
  CONSTRAINT shipping_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id)
);
CREATE TABLE public.warehouses (
  warehouse_id integer NOT NULL,
  warehouse_name character varying,
  location character varying,
  CONSTRAINT warehouses_pkey PRIMARY KEY (warehouse_id)
);
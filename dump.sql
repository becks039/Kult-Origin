--
-- PostgreSQL database dump
--

\restrict CssXz2wcN3OyoYju7UrYRQ0LmDCRKdszy9UcTOhmXJH6gtcW9CHTfwsbFmJadT7

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: enum_access_requests_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_access_requests_status AS ENUM (
    'PENDING',
    'SENT',
    'USED',
    'REJECTED'
);


ALTER TYPE public.enum_access_requests_status OWNER TO postgres;

--
-- Name: enum_batch_001_settings_batch_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_batch_001_settings_batch_status AS ENUM (
    'LOCKED',
    'FOUNDER_ACCESS',
    'PUBLIC_RELEASE'
);


ALTER TYPE public.enum_batch_001_settings_batch_status OWNER TO postgres;

--
-- Name: enum_founder_keys_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_founder_keys_status AS ENUM (
    'AVAILABLE',
    'ASSIGNED',
    'USED',
    'EXPIRED'
);


ALTER TYPE public.enum_founder_keys_status OWNER TO postgres;

--
-- Name: enum_orders_order_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_orders_order_status AS ENUM (
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
);


ALTER TYPE public.enum_orders_order_status OWNER TO postgres;

--
-- Name: enum_orders_payment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_orders_payment_status AS ENUM (
    'PENDING',
    'PAID',
    'FAILED'
);


ALTER TYPE public.enum_orders_payment_status OWNER TO postgres;

--
-- Name: enum_products_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_products_status AS ENUM (
    'DRAFT',
    'AVAILABLE',
    'SOLD_OUT'
);


ALTER TYPE public.enum_products_status OWNER TO postgres;

--
-- Name: enum_reviews_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_reviews_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public.enum_reviews_status OWNER TO postgres;

--
-- Name: enum_reviews_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_reviews_type AS ENUM (
    'TEXT',
    'PHOTO',
    'VIDEO'
);


ALTER TYPE public.enum_reviews_type OWNER TO postgres;

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_role AS ENUM (
    'admin',
    'customer'
);


ALTER TYPE public.enum_users_role OWNER TO postgres;

--
-- Name: enum_waitlist_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_waitlist_status AS ENUM (
    'PENDING',
    'SHORTLISTED',
    'KEY_ISSUED'
);


ALTER TYPE public.enum_waitlist_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: access_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.access_requests (
    id integer NOT NULL,
    name character varying NOT NULL,
    email character varying NOT NULL,
    access_key character varying NOT NULL,
    status public.enum_access_requests_status DEFAULT 'PENDING'::public.enum_access_requests_status,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    founder_number numeric,
    founder_key_id integer,
    key_issued_at timestamp(3) with time zone,
    birth_date timestamp(3) with time zone,
    phone_number character varying
);


ALTER TABLE public.access_requests OWNER TO postgres;

--
-- Name: access_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.access_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.access_requests_id_seq OWNER TO postgres;

--
-- Name: access_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.access_requests_id_seq OWNED BY public.access_requests.id;


--
-- Name: batch_001_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.batch_001_settings (
    id integer NOT NULL,
    founder_cap numeric DEFAULT 50 NOT NULL,
    current_founder_count numeric DEFAULT 0 NOT NULL,
    batch_status public.enum_batch_001_settings_batch_status DEFAULT 'FOUNDER_ACCESS'::public.enum_batch_001_settings_batch_status,
    founder_discount_percentage numeric DEFAULT 20 NOT NULL,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone
);


ALTER TABLE public.batch_001_settings OWNER TO postgres;

--
-- Name: batch_001_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.batch_001_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.batch_001_settings_id_seq OWNER TO postgres;

--
-- Name: batch_001_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.batch_001_settings_id_seq OWNED BY public.batch_001_settings.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying NOT NULL,
    description character varying,
    hero_image_id integer,
    active boolean DEFAULT true,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: founder_keys; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.founder_keys (
    id integer NOT NULL,
    key character varying NOT NULL,
    status public.enum_founder_keys_status DEFAULT 'AVAILABLE'::public.enum_founder_keys_status,
    assigned_to_id integer,
    batch character varying DEFAULT 'BATCH_001'::character varying NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.founder_keys OWNER TO postgres;

--
-- Name: founder_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.founder_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.founder_keys_id_seq OWNER TO postgres;

--
-- Name: founder_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.founder_keys_id_seq OWNED BY public.founder_keys.id;


--
-- Name: founder_profiles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.founder_profiles (
    id integer NOT NULL,
    user_id integer NOT NULL,
    founder_number numeric NOT NULL,
    physical_key_serial character varying,
    joined_at timestamp(3) with time zone,
    lifetime_discount numeric DEFAULT 20,
    annual_spend numeric DEFAULT 0,
    annual_spend_cap numeric DEFAULT 100000,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.founder_profiles OWNER TO postgres;

--
-- Name: founder_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.founder_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.founder_profiles_id_seq OWNER TO postgres;

--
-- Name: founder_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.founder_profiles_id_seq OWNED BY public.founder_profiles.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media (
    id integer NOT NULL,
    alt character varying NOT NULL,
    caption character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric
);


ALTER TABLE public.media OWNER TO postgres;

--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_id_seq OWNER TO postgres;

--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    order_number character varying NOT NULL,
    subtotal numeric NOT NULL,
    discount numeric DEFAULT 0,
    shipping_fee numeric DEFAULT 250 NOT NULL,
    total_amount numeric NOT NULL,
    is_founder_order boolean DEFAULT false,
    payment_status public.enum_orders_payment_status DEFAULT 'PENDING'::public.enum_orders_payment_status,
    order_status public.enum_orders_order_status DEFAULT 'PROCESSING'::public.enum_orders_order_status,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    customer_name character varying NOT NULL,
    customer_email character varying NOT NULL,
    customer_phone character varying NOT NULL,
    shipping_address_street character varying NOT NULL,
    shipping_address_city character varying NOT NULL,
    user_id integer
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: orders_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders_items (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    product_id integer NOT NULL,
    quantity numeric NOT NULL,
    unit_price numeric NOT NULL,
    size character varying
);


ALTER TABLE public.orders_items OWNER TO postgres;

--
-- Name: payload_kv; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payload_kv (
    id integer NOT NULL,
    key character varying NOT NULL,
    data jsonb NOT NULL
);


ALTER TABLE public.payload_kv OWNER TO postgres;

--
-- Name: payload_kv_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payload_kv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_kv_id_seq OWNER TO postgres;

--
-- Name: payload_kv_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payload_kv_id_seq OWNED BY public.payload_kv.id;


--
-- Name: payload_locked_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payload_locked_documents (
    id integer NOT NULL,
    global_slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payload_locked_documents OWNER TO postgres;

--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payload_locked_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_locked_documents_id_seq OWNER TO postgres;

--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payload_locked_documents_id_seq OWNED BY public.payload_locked_documents.id;


--
-- Name: payload_locked_documents_rels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payload_locked_documents_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer,
    media_id integer,
    categories_id integer,
    products_id integer,
    founder_profiles_id integer,
    founder_keys_id integer,
    waitlist_id integer,
    orders_id integer,
    reviews_id integer,
    access_requests_id integer
);


ALTER TABLE public.payload_locked_documents_rels OWNER TO postgres;

--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payload_locked_documents_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNER TO postgres;

--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNED BY public.payload_locked_documents_rels.id;


--
-- Name: payload_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payload_migrations (
    id integer NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payload_migrations OWNER TO postgres;

--
-- Name: payload_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payload_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_migrations_id_seq OWNER TO postgres;

--
-- Name: payload_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payload_migrations_id_seq OWNED BY public.payload_migrations.id;


--
-- Name: payload_preferences; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payload_preferences (
    id integer NOT NULL,
    key character varying,
    value jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.payload_preferences OWNER TO postgres;

--
-- Name: payload_preferences_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payload_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_preferences_id_seq OWNER TO postgres;

--
-- Name: payload_preferences_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payload_preferences_id_seq OWNED BY public.payload_preferences.id;


--
-- Name: payload_preferences_rels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payload_preferences_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer
);


ALTER TABLE public.payload_preferences_rels OWNER TO postgres;

--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payload_preferences_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNER TO postgres;

--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNED BY public.payload_preferences_rels.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    title character varying NOT NULL,
    slug character varying NOT NULL,
    description jsonb NOT NULL,
    msrp numeric NOT NULL,
    founder_price numeric NOT NULL,
    gsm numeric,
    fabric character varying DEFAULT '200+ GSM Heavy-Fleece Technical Fabric'::character varying,
    print_type character varying DEFAULT '3D High-Build Silicone/Rubberized Print'::character varying,
    category_id integer NOT NULL,
    status public.enum_products_status DEFAULT 'DRAFT'::public.enum_products_status,
    total_stock numeric DEFAULT 500 NOT NULL,
    reserved_stock numeric DEFAULT 0,
    sold_stock numeric DEFAULT 0,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: products_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_images (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    image_id integer NOT NULL
);


ALTER TABLE public.products_images OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    customer character varying CONSTRAINT reviews_customer_id_not_null NOT NULL,
    product character varying CONSTRAINT reviews_product_id_not_null NOT NULL,
    type public.enum_reviews_type NOT NULL,
    content character varying NOT NULL,
    status public.enum_reviews_status DEFAULT 'PENDING'::public.enum_reviews_status,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    discount_code character varying,
    discount_percentage numeric,
    pushed_to_ads boolean DEFAULT false
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: reviews_media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews_media (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    file_id integer NOT NULL
);


ALTER TABLE public.reviews_media OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying NOT NULL,
    role public.enum_users_role DEFAULT 'customer'::public.enum_users_role NOT NULL,
    is_founder boolean DEFAULT false,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    reset_password_token character varying,
    reset_password_expiration timestamp(3) with time zone,
    salt character varying,
    hash character varying,
    login_attempts numeric DEFAULT 0,
    lock_until timestamp(3) with time zone,
    referral_code character varying,
    origin_points numeric DEFAULT 0,
    founder_number numeric,
    annual_spend numeric DEFAULT 0,
    birth_date timestamp(3) with time zone,
    phone_number character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: users_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_sessions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone NOT NULL
);


ALTER TABLE public.users_sessions OWNER TO postgres;

--
-- Name: waitlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.waitlist (
    id integer NOT NULL,
    email character varying NOT NULL,
    status public.enum_waitlist_status DEFAULT 'PENDING'::public.enum_waitlist_status,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    full_name character varying NOT NULL,
    founder_key_id integer,
    access_key character varying,
    birth_date timestamp(3) with time zone,
    phone_number character varying
);


ALTER TABLE public.waitlist OWNER TO postgres;

--
-- Name: waitlist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.waitlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.waitlist_id_seq OWNER TO postgres;

--
-- Name: waitlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.waitlist_id_seq OWNED BY public.waitlist.id;


--
-- Name: access_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_requests ALTER COLUMN id SET DEFAULT nextval('public.access_requests_id_seq'::regclass);


--
-- Name: batch_001_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.batch_001_settings ALTER COLUMN id SET DEFAULT nextval('public.batch_001_settings_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: founder_keys id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.founder_keys ALTER COLUMN id SET DEFAULT nextval('public.founder_keys_id_seq'::regclass);


--
-- Name: founder_profiles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.founder_profiles ALTER COLUMN id SET DEFAULT nextval('public.founder_profiles_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: payload_kv id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_kv ALTER COLUMN id SET DEFAULT nextval('public.payload_kv_id_seq'::regclass);


--
-- Name: payload_locked_documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_id_seq'::regclass);


--
-- Name: payload_locked_documents_rels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_rels_id_seq'::regclass);


--
-- Name: payload_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_migrations ALTER COLUMN id SET DEFAULT nextval('public.payload_migrations_id_seq'::regclass);


--
-- Name: payload_preferences id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_preferences ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_id_seq'::regclass);


--
-- Name: payload_preferences_rels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_rels_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: waitlist id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waitlist ALTER COLUMN id SET DEFAULT nextval('public.waitlist_id_seq'::regclass);


--
-- Data for Name: access_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.access_requests (id, name, email, access_key, status, updated_at, created_at, founder_number, founder_key_id, key_issued_at, birth_date, phone_number) FROM stdin;
85	bakhtawar khan	bakhtawarkhan@gmail.com	ORIGIN-ADF0C0	USED	2026-09-08 14:27:55.145+05	2026-09-08 14:25:48.341+05	15	\N	2026-09-08 14:25:49.632+05	2003-08-03 05:00:00+05	03148991183
86	bakhtawar aslam	aslambakhtawar@gmail.com	ORIGIN-910716	USED	2026-09-09 14:06:42.643+05	2026-09-09 14:05:41.889+05	2	\N	2026-09-09 14:05:43.727+05	2003-08-03 05:00:00+05	0233449283
\.


--
-- Data for Name: batch_001_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.batch_001_settings (id, founder_cap, current_founder_count, batch_status, founder_discount_percentage, updated_at, created_at) FROM stdin;
1	50	2	FOUNDER_ACCESS	20	2026-09-09 14:06:43.226+05	2026-08-31 16:57:52.393+05
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, title, slug, description, hero_image_id, active, updated_at, created_at) FROM stdin;
1	HOODIES	hoodies	Heavyweight architectural fleece hoodies engineered for structural durability and warmth.	1	t	2026-09-02 15:58:21.841+05	2026-09-02 15:58:21.841+05
\.


--
-- Data for Name: founder_keys; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.founder_keys (id, key, status, assigned_to_id, batch, updated_at, created_at) FROM stdin;
39	ORIGIN-ADF0C0	ASSIGNED	58	BATCH_001	2026-09-08 14:26:23.058+05	2026-09-08 14:26:23.058+05
40	ORIGIN-910716	ASSIGNED	59	BATCH_001	2026-09-09 14:06:14.798+05	2026-09-09 14:06:14.798+05
\.


--
-- Data for Name: founder_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.founder_profiles (id, user_id, founder_number, physical_key_serial, joined_at, lifetime_discount, annual_spend, annual_spend_cap, updated_at, created_at) FROM stdin;
58	58	1	001/050	2026-09-08 14:26:23.033+05	20	0	100000	2026-09-08 14:27:55.302+05	2026-09-08 14:26:23.035+05
59	59	2	002/050	2026-09-09 14:06:14.766+05	20	0	100000	2026-09-09 14:06:43.133+05	2026-09-09 14:06:14.772+05
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media (id, alt, caption, updated_at, created_at, url, thumbnail_u_r_l, filename, mime_type, filesize, width, height, focal_x, focal_y) FROM stdin;
1	Black Heavyweight Hoodie Front	KULT Sentinel Hoodie - Black	2026-09-02 15:58:15.225+05	2026-09-02 15:58:15.225+05	/api/media/file/Originals_black_hoodie.webp	\N	Originals_black_hoodie.webp	image/webp	75592	1024	1024	50	50
2	Black Heavyweight Hoodie Front	KULT Sentinel Hoodie - Black	2026-09-03 14:19:48.954+05	2026-09-02 16:07:14.929+05	/api/media/file/Originals_black_hoodie-1.webp	\N	Originals_black_hoodie-1.webp	image/webp	75592	1024	1024	50	50
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, order_number, subtotal, discount, shipping_fee, total_amount, is_founder_order, payment_status, order_status, updated_at, created_at, customer_name, customer_email, customer_phone, shipping_address_street, shipping_address_city, user_id) FROM stdin;
1	KULT-719582-981	3999	0	250	4249	f	PENDING	PROCESSING	2026-09-04 11:51:59.59+05	2026-09-04 11:51:59.588+05	sana Bakhtawar	l1f24llbh0025@ucp.edu.pk	+923459239310	Johar Town Lahore	Lahore	\N
2	KULT-417468-136	3999	0	250	4249	f	PENDING	PROCESSING	2026-09-04 15:06:57.475+05	2026-09-04 15:06:57.473+05	Ahmad  Sher	ahmadsher@gmail.com	+923459239310	Johar Town Lahore	Lahore	\N
3	KULT-644522-140	3999	0	250	4249	f	PENDING	PROCESSING	2026-09-08 11:40:44.527+05	2026-09-08 11:40:44.525+05	sana khan	l1f24llbh0025@ucp.edu.pk	+923459239310	Johar Town Lahore	Lahore	\N
4	KULT-785412-915	7998	0	250	8248	f	PENDING	PROCESSING	2026-09-08 12:49:45.418+05	2026-09-08 12:49:45.417+05	sana khan	l1f24llbh0025@ucp.edu.pk	+923459239310	Johar Town Lahore	Lahore	\N
5	KULT-880378-659	3999	0	250	4249	f	PENDING	PROCESSING	2026-09-08 12:51:20.382+05	2026-09-08 12:51:20.381+05	Becks khan	becks@gmail.com	0293837482	Johar Town Lahore	Lahore	\N
6	KULT-445040-981	3999	0	250	4249	f	PENDING	PROCESSING	2026-09-08 13:00:45.062+05	2026-09-08 13:00:45.056+05	Becks khan	becks@gmail.com	0293837482	Johar Town Lahore	Lahore	\N
7	KULT-747732-738	3999	0	250	4249	f	PENDING	PROCESSING	2026-09-08 14:29:07.744+05	2026-09-08 14:29:07.742+05	bakh khan	bakhtawarkhan@gmail.com	03148991183	Johar Town Lahore	Lahore	\N
8	KULT-947066-218	3999	0	250	4249	f	PENDING	PROCESSING	2026-09-09 14:09:07.077+05	2026-09-09 14:09:07.075+05	bakhtawar aslam	l1f22bsse0331@ucp.edu.pk	+923008402400	586 - D Block Johar Town Lahore	Lahore, Punjab	\N
\.


--
-- Data for Name: orders_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders_items (_order, _parent_id, id, product_id, quantity, unit_price, size) FROM stdin;
1	1	6a9a6a8fc941a1232c7526d6	1	1	3999	M
1	2	6a9a9841ee859c5fcc447458	1	1	3999	M
1	3	6a9fadec7c3a9085987b53aa	1	1	3999	M
1	4	6a9fbe191eb2364af880727f	1	2	3999	MEDIUM
1	5	6a9fbe781eb2364af8807280	1	1	3999	M
1	6	6a9fc0adee8bc10a8018f439	1	1	3999	M
1	7	6a9fd563a248af16d09120fb	1	1	3999	M
1	8	6aa122333191ed92a8d9ad85	1	1	3999	M
\.


--
-- Data for Name: payload_kv; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payload_kv (id, key, data) FROM stdin;
\.


--
-- Data for Name: payload_locked_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payload_locked_documents (id, global_slug, updated_at, created_at) FROM stdin;
19	\N	2026-09-08 11:41:16.458+05	2026-09-08 11:41:16.458+05
\.


--
-- Data for Name: payload_locked_documents_rels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payload_locked_documents_rels (id, "order", parent_id, path, users_id, media_id, categories_id, products_id, founder_profiles_id, founder_keys_id, waitlist_id, orders_id, reviews_id, access_requests_id) FROM stdin;
25	\N	19	document	\N	\N	\N	\N	\N	\N	\N	3	\N	\N
\.


--
-- Data for Name: payload_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payload_migrations (id, name, batch, updated_at, created_at) FROM stdin;
1	dev	-1	2026-09-09 10:34:17.336+05	2026-08-31 14:25:58.927+05
\.


--
-- Data for Name: payload_preferences; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payload_preferences (id, key, value, updated_at, created_at) FROM stdin;
1	dashboard-layout	{"layouts": null}	2026-08-31 14:36:48.74+05	2026-08-31 14:36:48.747+05
2	collection-users	{"limit": 10}	2026-08-31 14:52:38.914+05	2026-08-31 14:36:51.273+05
4	collection-orders	{}	2026-08-31 14:53:45.78+05	2026-08-31 14:53:45.78+05
5	global-batch-001-settings	{"editViewType": "default"}	2026-08-31 14:53:51.021+05	2026-08-31 14:53:51.023+05
7	collection-categories	{}	2026-08-31 16:15:24.136+05	2026-08-31 16:15:24.131+05
8	collection-media	{}	2026-08-31 16:24:33.532+05	2026-08-31 16:24:33.526+05
6	nav	{"groups": {"Collections": {"open": true}}}	2026-08-31 16:24:37.399+05	2026-08-31 14:59:14.207+05
3	collection-products	{"limit": 10}	2026-08-31 16:26:29.315+05	2026-08-31 14:53:41.459+05
11	global-batch-001-settings	{"editViewType": "default"}	2026-08-31 16:54:55.286+05	2026-08-31 16:54:55.296+05
14	collection-waitlist	{"limit": 10}	2026-08-31 17:37:33.997+05	2026-08-31 17:05:32.72+05
18	collection-reviews	{}	2026-09-01 16:14:52.697+05	2026-09-01 16:14:52.696+05
19	collection-reviews	{}	2026-09-01 16:14:53.078+05	2026-09-01 16:14:53.078+05
13	collection-founder-profiles	{"limit": 10}	2026-09-02 13:01:42.83+05	2026-08-31 16:58:18.354+05
21	nav	{"groups": {"Collections": {"open": true}}}	2026-09-02 13:34:17.516+05	2026-09-02 13:34:16.91+05
15	dashboard-layout	{"layouts": null}	2026-09-02 13:42:17.322+05	2026-09-01 14:19:29.182+05
22	collection-orders	{"limit": 10}	2026-09-02 15:10:54.686+05	2026-09-02 15:04:25.417+05
20	collection-products	{"editViewType": "default"}	2026-09-02 15:11:06.33+05	2026-09-02 13:20:24.103+05
23	collection-categories	{"editViewType": "default"}	2026-09-02 15:54:12.127+05	2026-09-02 15:54:09.922+05
10	collection-media	{"limit": 10, "editViewType": "default"}	2026-09-02 15:54:52.238+05	2026-08-31 16:46:40.612+05
17	collection-reviews	{"editViewType": "default"}	2026-09-03 14:29:24.451+05	2026-09-01 16:14:52.655+05
12	collection-founder-keys	{"limit": 10, "editViewType": "default"}	2026-09-03 15:00:46.869+05	2026-08-31 16:58:11.118+05
16	collection-access-requests	{"limit": 10, "editViewType": "default"}	2026-09-03 15:35:46.804+05	2026-09-01 14:50:47.681+05
9	collection-users	{"limit": 10, "editViewType": "default"}	2026-09-03 18:13:40.359+05	2026-08-31 16:46:35.728+05
29	collection-products	{}	2026-09-04 11:51:35.176+05	2026-09-04 11:51:35.176+05
30	collection-categories	{"editViewType": "default"}	2026-09-04 13:12:17.339+05	2026-09-04 13:10:22.109+05
24	collection-access-requests	{"limit": 10, "editViewType": "default"}	2026-09-04 15:01:43.316+05	2026-09-03 20:04:23.075+05
28	collection-orders	{"limit": 10, "editViewType": "default"}	2026-09-04 16:37:28.639+05	2026-09-04 11:51:16.077+05
31	collection-users	{"limit": 10, "editViewType": "default"}	2026-09-07 15:32:28.446+05	2026-09-07 15:03:07.602+05
25	collection-waitlist	{"limit": 10, "editViewType": "default"}	2026-09-07 16:06:24.394+05	2026-09-03 20:04:26.217+05
32	collection-founder-keys	{"limit": 10}	2026-09-08 10:46:08.431+05	2026-09-08 10:46:08.431+05
26	collection-founder-keys	{"limit": 10, "editViewType": "default"}	2026-09-08 10:58:07.182+05	2026-09-03 20:05:10.781+05
33	global-batch-001-settings	{"editViewType": "default"}	2026-09-08 11:20:25.584+05	2026-09-08 11:20:25.587+05
27	collection-founder-profiles	{"sort": "-joinedAt", "limit": 10, "editViewType": "default"}	2026-09-08 11:27:19.82+05	2026-09-04 11:24:24.32+05
34	collection-access-requests	{"limit": 10}	2026-09-08 14:26:05.42+05	2026-09-08 14:25:52.99+05
35	collection-waitlist	{"limit": 10}	2026-09-08 14:26:23.616+05	2026-09-08 14:26:09.475+05
36	collection-founder-profiles	{}	2026-09-08 14:26:27.732+05	2026-09-08 14:26:27.732+05
38	collection-users	{}	2026-09-08 14:26:37.636+05	2026-09-08 14:26:37.635+05
37	collection-founder-keys	{"editViewType": "default"}	2026-09-08 14:27:47.981+05	2026-09-08 14:26:32.137+05
39	global-batch-001-settings	{"editViewType": "default"}	2026-09-08 14:28:10.351+05	2026-09-08 14:28:10.353+05
40	collection-orders	{}	2026-09-08 14:29:16.59+05	2026-09-08 14:29:16.59+05
44	collection-products	{}	2026-09-08 15:40:18.652+05	2026-09-08 15:40:18.652+05
43	collection-categories	{"limit": 10}	2026-09-08 15:54:51.013+05	2026-09-08 14:29:43.982+05
41	collection-media	{"limit": 10}	2026-09-08 16:00:36.114+05	2026-09-08 14:29:32.156+05
42	collection-reviews	{"limit": 10, "editViewType": "default"}	2026-09-09 10:40:51.589+05	2026-09-08 14:29:38.965+05
\.


--
-- Data for Name: payload_preferences_rels; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payload_preferences_rels (id, "order", parent_id, path, users_id) FROM stdin;
89	\N	43	user	57
90	\N	41	user	57
92	\N	42	user	57
76	\N	34	user	57
78	\N	35	user	57
79	\N	36	user	57
81	\N	38	user	57
82	\N	37	user	57
83	\N	39	user	57
84	\N	40	user	57
88	\N	44	user	57
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, title, slug, description, msrp, founder_price, gsm, fabric, print_type, category_id, status, total_stock, reserved_stock, sold_stock, updated_at, created_at) FROM stdin;
1	Sentinel Heavyweight Oversized Hoodie	sentinel-oversized-hoodie	{"root": {"type": "root", "format": "", "indent": 0, "version": 1, "children": [{"type": "paragraph", "format": "", "indent": 0, "version": 1, "children": [{"mode": "normal", "text": "Architectural 400 GSM heavy-fleece hoodie engineered for structural durability and thermal resistance.", "type": "text", "style": "", "detail": 0, "format": 0, "version": 1}], "direction": null, "textStyle": "", "textFormat": 0}], "direction": null}}	4999	3999	400	200+ GSM Heavy-Fleece Technical Fabric	3D High-Build Silicone/Rubberized Print	1	AVAILABLE	500	5	2	2026-09-02 16:07:19.133+05	2026-09-02 16:07:19.132+05
\.


--
-- Data for Name: products_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products_images (_order, _parent_id, id, image_id) FROM stdin;
1	1	6a980259a0433a69ae1f95e2	2
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, customer, product, type, content, status, updated_at, created_at, discount_code, discount_percentage, pushed_to_ads) FROM stdin;
\.


--
-- Data for Name: reviews_media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews_media (_order, _parent_id, id, file_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, role, is_founder, updated_at, created_at, email, reset_password_token, reset_password_expiration, salt, hash, login_attempts, lock_until, referral_code, origin_points, founder_number, annual_spend, birth_date, phone_number) FROM stdin;
58	bakhtawar khan	customer	t	2026-09-08 14:26:23.01+05	2026-09-08 14:26:23.009+05	bakhtawarkhan@gmail.com	\N	\N	4fd696da20499edef98b0150ff481b3582acd3a225c63b84ca228e4a6cf078a2	c37f870c3cff4e116918254619003dc5a553eaab8b38fc1b2b27d7e0857538d46793bb16dd2a8d84af4c582785cb1d0501152b0d82bc90a029ec9379d389bde8728aa66256f46cf90bddb6c155d9a69d84806782aa777226513a2aa0a0a88a54fc09baedb1852065c39961cd320fc674af5756f515eff6b95eab4df158ce19a40d6deeeda3cd0df6836b8c27662a02bd0c1e0528c59b58b9c24763cdc76be5d6e8bdeb91886b5a1339f076cce2c2ffd1a6b04eaddfe03759c2effe53b668138b512521f95bfdee164b3727f7d833832d93faebb0a5cf1930e25e7bf15b02cf37d370a0361d7c1d502d51e90a6995e23a308dfc94a1bc2702abc7837eb42abd8b55d37f961d6e3859f80bd4664bf7a7750fa75088180422ca306a86590c1f70af91077b8b2adeeb62f6ae77f035bb39f47f25b4d34ed18ed9cb93415e9ee60090c1b14dcda2f20375ffe2c9b05a32c988a3e44e4e7419bfa8827e1e68080e1f6246485b8af3702443e7e953329f38bc7249c875905cf06bfead870f1c29a72eb6c810107d1dd9446dea98353b529313e9af1fe39f4be284e5806655423e9965e00d78ba3ce48c10a9c966f2be7e7c2d334e37872bc59ca0285e9540aed4572c98c412694483406337e86a4d8572eedb7e9b0f48fa6798f69cd104c20eede7d10b651fd2145365c4525866dd361520a3ec9dd9ab2318b938d38dd6132a090e3fd2	0	\N	\N	0	1	0	2003-08-03 05:00:00+05	03148991183
57	Kult-Origin	admin	f	2026-09-08 14:25:13.463+05	2026-09-08 14:25:13.459+05	admin@kultorigin.com	\N	\N	cee6381abe6fd2e69a52412e3bc3ad02df6123ff10c1192a196c867a7de762e2	75c62136de2dd5c925c315632ceced63c23cf6c9451b4c9fd12ec4b421aa82cd6b0d8ed2c67be7eebf82821d86b750a266d1c7991c280e3ed5e266fd8154a76b7826cfd2360b038801119e5f1912c31d4493bc85d6eb3aa08e705542320042abe008797fedbcfe5423f3c4b6fc1e4d5bf2c9f6ef01a7fab9f40e8e5089f90abc76119b8df2572c51c3bbebc0c7daafdcae56ac193402c1581726ba0cae84566c110e1a286045d1899d97f37af90c92911ceea3ce8ddb6179cf7afd87a0dd2e8b03e7b419a769b0729f03b7d2848454a54c50c96140b87233d08c4bf7e70172ee52a2557c0793412d17910b5c87c0e778d1e3513a015961b08542a6bf52f919a745b411ceeb572ee21192e8aac565ff4f9d8d22739541ca5e8a1cbd0e2aea2897898bdc46fd7b97b07a245c5eb5f4b7a0a999c2c4e918e78146d79bc79ce5a082101ef78f888b998baa2ecbb09336b29d4327ca57975008467a0f0fcf9704eb77606c56042c5cdc931b1f9e3a250b0ae8e03f1df38f8fc1e3da74ca4342c71a83fece9b7fd0774c510736ad18424c18480aaab3570b444154f9a7a1d9db12846e25589794f94574fc3715d4366db7b78565bf89a58de82294b4b70d302af113f8b8788775a2b03b5c4503668a96ec7fb72b8feae4456567584edef02aa09b2fabd02dc73875395349872c2423226e8567e27920ef8644a10646153edeb6214447	0	\N	\N	0	\N	0	\N	
59	bakhtawar aslam	customer	t	2026-09-09 14:06:14.727+05	2026-09-09 14:06:14.727+05	aslambakhtawar@gmail.com	\N	\N	7303557d04d2f31d87d82bbd60825e4e656ba006e03e9edd003c044d0411536e	5345008e7ef7e7928667de5942801fa5daeb75f4fadcaa626f06431d54ac7917c8ba7a0efc2c38e969b3b8e6766af4fb0f4b3fc15f70774079eb179a2e3782b024b5cc1900b1511028352f90925d108dbe017c8ed8e24ddebc354593c35b25f477f32735b67070ce5499c3ef95a2cbb08640685dd36a642908c1fb305f6c501ab03c7ecc8af695bc99b0896a354f43062e0089ad8cd452c2d295a28ad23589d20f399a19b1f62cb6034c7962c76432d342bf07fb9cb608876317b824d650fad0e1323f0928ae0422c827ff1f2392336725229cd191319e6da78b4464681001b71d174d9108f0f2354d64009568f186401ba9bba6945b4a946b654f4ae66de5e696626124e189d4c7d955ef7da13055e34a7562ec8da60d8e2f8e73ad609ccdbf0f3960368def7e725f072572e06cdd36fa49403ff7b64c807d7900b5e66548db76c85eac0051b1340ce2aa6c23fdc2237039b855a3444a5bf654e9be05f729be7e6836e06167f9d01cb3dd4cc7094619d3b923a94f2fd9caa58b741e3db0237a4a517b50bb14bc0e14d4a6ec0bbb336ce60615e87aeaaa631bdc7cb19def77a0d214ecfbf6277445b7b17b7d94db16f78b8a087964505040c25d283360b78541feeac1e3bf5460287a8882714d5e95e5ae7fd9bf92301e542b9738daaac2f2f16940478cf7910fb3ea51b42991bd8929acfd636709d270a0ca9b4724a805aa67	0	\N	\N	0	2	0	2003-08-03 05:00:00+05	0233449283
\.


--
-- Data for Name: users_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_sessions (_order, _parent_id, id, created_at, expires_at) FROM stdin;
1	57	f32a28c4-d743-4591-b2de-a407907b873c	2026-09-09 14:04:55.707+05	2026-09-09 16:04:55.707+05
\.


--
-- Data for Name: waitlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.waitlist (id, email, status, updated_at, created_at, full_name, founder_key_id, access_key, birth_date, phone_number) FROM stdin;
52	becksyyy@gmail.com	SHORTLISTED	2026-09-08 13:02:57.808+05	2026-09-08 13:02:19.613+05	becksyy	\N	ORIGIN-9B05DA	2006-10-02 05:00:00+05	0323344212
53	hana@gmail.com	SHORTLISTED	2026-09-08 13:06:34.908+05	2026-09-08 13:06:00.792+05	hana	\N	ORIGIN-09D1E6	2006-10-23 05:00:00+05	03000443321
54	hunakhan@gmail.com	SHORTLISTED	2026-09-08 13:13:23.934+05	2026-09-08 13:08:29.439+05	huna	\N	ORIGIN-FFE3B3	2009-10-23 06:00:00+06	0322392834
55	hiina@gmail.com	SHORTLISTED	2026-09-08 13:14:26.516+05	2026-09-08 13:13:58.854+05	hiina	\N	ORIGIN-2E8901	2008-12-03 05:00:00+05	0239189232
56	shazi@gmail.com	SHORTLISTED	2026-09-08 13:21:06.365+05	2026-09-08 13:20:31.825+05	shazii	\N	ORIGIN-802299	2009-10-31 06:00:00+06	0329384531
57	bakhtaa@gmail.com	SHORTLISTED	2026-09-08 13:26:14.608+05	2026-09-08 13:25:38.749+05	bakhtaaa	\N	ORIGIN-8CAF8F	2003-08-31 05:00:00+05	0335923238
58	zaru@gmail.com	SHORTLISTED	2026-09-08 13:41:53.903+05	2026-09-08 13:41:22.766+05	zaruu	\N	ORIGIN-571E44	2003-08-31 05:00:00+05	03001223423
59	sheeza@gmail.com	SHORTLISTED	2026-09-08 13:46:49.957+05	2026-09-08 13:46:21.372+05	sheeza	\N	ORIGIN-4410D2	2005-09-26 05:00:00+05	03008402400
\.


--
-- Name: access_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.access_requests_id_seq', 86, true);


--
-- Name: batch_001_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.batch_001_settings_id_seq', 1, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, true);


--
-- Name: founder_keys_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.founder_keys_id_seq', 40, true);


--
-- Name: founder_profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.founder_profiles_id_seq', 59, true);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.media_id_seq', 2, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 8, true);


--
-- Name: payload_kv_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payload_kv_id_seq', 1, false);


--
-- Name: payload_locked_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payload_locked_documents_id_seq', 21, true);


--
-- Name: payload_locked_documents_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payload_locked_documents_rels_id_seq', 28, true);


--
-- Name: payload_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payload_migrations_id_seq', 1, true);


--
-- Name: payload_preferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payload_preferences_id_seq', 44, true);


--
-- Name: payload_preferences_rels_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payload_preferences_rels_id_seq', 92, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 1, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 59, true);


--
-- Name: waitlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.waitlist_id_seq', 61, true);


--
-- Name: access_requests access_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_requests
    ADD CONSTRAINT access_requests_pkey PRIMARY KEY (id);


--
-- Name: batch_001_settings batch_001_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.batch_001_settings
    ADD CONSTRAINT batch_001_settings_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: founder_keys founder_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.founder_keys
    ADD CONSTRAINT founder_keys_pkey PRIMARY KEY (id);


--
-- Name: founder_profiles founder_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.founder_profiles
    ADD CONSTRAINT founder_profiles_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: orders_items orders_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders_items
    ADD CONSTRAINT orders_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payload_kv payload_kv_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_kv
    ADD CONSTRAINT payload_kv_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents payload_locked_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents
    ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);


--
-- Name: payload_migrations payload_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_migrations
    ADD CONSTRAINT payload_migrations_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences payload_preferences_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_preferences
    ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);


--
-- Name: payload_preferences_rels payload_preferences_rels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);


--
-- Name: products_images products_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_images
    ADD CONSTRAINT products_images_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: reviews_media reviews_media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews_media
    ADD CONSTRAINT reviews_media_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users_sessions users_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);


--
-- Name: waitlist waitlist_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waitlist
    ADD CONSTRAINT waitlist_pkey PRIMARY KEY (id);


--
-- Name: access_requests_access_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX access_requests_access_key_idx ON public.access_requests USING btree (access_key);


--
-- Name: access_requests_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX access_requests_created_at_idx ON public.access_requests USING btree (created_at);


--
-- Name: access_requests_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX access_requests_email_idx ON public.access_requests USING btree (email);


--
-- Name: access_requests_founder_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX access_requests_founder_key_idx ON public.access_requests USING btree (founder_key_id);


--
-- Name: access_requests_founder_number_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX access_requests_founder_number_idx ON public.access_requests USING btree (founder_number);


--
-- Name: access_requests_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX access_requests_updated_at_idx ON public.access_requests USING btree (updated_at);


--
-- Name: categories_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_created_at_idx ON public.categories USING btree (created_at);


--
-- Name: categories_hero_image_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_hero_image_idx ON public.categories USING btree (hero_image_id);


--
-- Name: categories_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categories_slug_idx ON public.categories USING btree (slug);


--
-- Name: categories_title_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categories_title_idx ON public.categories USING btree (title);


--
-- Name: categories_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX categories_updated_at_idx ON public.categories USING btree (updated_at);


--
-- Name: founder_keys_assigned_to_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX founder_keys_assigned_to_idx ON public.founder_keys USING btree (assigned_to_id);


--
-- Name: founder_keys_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX founder_keys_created_at_idx ON public.founder_keys USING btree (created_at);


--
-- Name: founder_keys_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX founder_keys_key_idx ON public.founder_keys USING btree (key);


--
-- Name: founder_keys_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX founder_keys_updated_at_idx ON public.founder_keys USING btree (updated_at);


--
-- Name: founder_profiles_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX founder_profiles_created_at_idx ON public.founder_profiles USING btree (created_at);


--
-- Name: founder_profiles_founder_number_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX founder_profiles_founder_number_idx ON public.founder_profiles USING btree (founder_number);


--
-- Name: founder_profiles_physical_key_serial_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX founder_profiles_physical_key_serial_idx ON public.founder_profiles USING btree (physical_key_serial);


--
-- Name: founder_profiles_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX founder_profiles_updated_at_idx ON public.founder_profiles USING btree (updated_at);


--
-- Name: founder_profiles_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX founder_profiles_user_idx ON public.founder_profiles USING btree (user_id);


--
-- Name: media_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);


--
-- Name: media_filename_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX media_filename_idx ON public.media USING btree (filename);


--
-- Name: media_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX media_updated_at_idx ON public.media USING btree (updated_at);


--
-- Name: orders_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX orders_created_at_idx ON public.orders USING btree (created_at);


--
-- Name: orders_items_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX orders_items_order_idx ON public.orders_items USING btree (_order);


--
-- Name: orders_items_parent_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX orders_items_parent_id_idx ON public.orders_items USING btree (_parent_id);


--
-- Name: orders_items_product_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX orders_items_product_idx ON public.orders_items USING btree (product_id);


--
-- Name: orders_order_number_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX orders_order_number_idx ON public.orders USING btree (order_number);


--
-- Name: orders_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX orders_updated_at_idx ON public.orders USING btree (updated_at);


--
-- Name: orders_user_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX orders_user_idx ON public.orders USING btree (user_id);


--
-- Name: payload_kv_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX payload_kv_key_idx ON public.payload_kv USING btree (key);


--
-- Name: payload_locked_documents_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_created_at_idx ON public.payload_locked_documents USING btree (created_at);


--
-- Name: payload_locked_documents_global_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_global_slug_idx ON public.payload_locked_documents USING btree (global_slug);


--
-- Name: payload_locked_documents_rels_access_requests_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_access_requests_id_idx ON public.payload_locked_documents_rels USING btree (access_requests_id);


--
-- Name: payload_locked_documents_rels_categories_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_categories_id_idx ON public.payload_locked_documents_rels USING btree (categories_id);


--
-- Name: payload_locked_documents_rels_founder_keys_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_founder_keys_id_idx ON public.payload_locked_documents_rels USING btree (founder_keys_id);


--
-- Name: payload_locked_documents_rels_founder_profiles_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_founder_profiles_id_idx ON public.payload_locked_documents_rels USING btree (founder_profiles_id);


--
-- Name: payload_locked_documents_rels_media_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_media_id_idx ON public.payload_locked_documents_rels USING btree (media_id);


--
-- Name: payload_locked_documents_rels_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_order_idx ON public.payload_locked_documents_rels USING btree ("order");


--
-- Name: payload_locked_documents_rels_orders_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_orders_id_idx ON public.payload_locked_documents_rels USING btree (orders_id);


--
-- Name: payload_locked_documents_rels_parent_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_parent_idx ON public.payload_locked_documents_rels USING btree (parent_id);


--
-- Name: payload_locked_documents_rels_path_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_path_idx ON public.payload_locked_documents_rels USING btree (path);


--
-- Name: payload_locked_documents_rels_products_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_products_id_idx ON public.payload_locked_documents_rels USING btree (products_id);


--
-- Name: payload_locked_documents_rels_reviews_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_reviews_id_idx ON public.payload_locked_documents_rels USING btree (reviews_id);


--
-- Name: payload_locked_documents_rels_users_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_users_id_idx ON public.payload_locked_documents_rels USING btree (users_id);


--
-- Name: payload_locked_documents_rels_waitlist_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_rels_waitlist_id_idx ON public.payload_locked_documents_rels USING btree (waitlist_id);


--
-- Name: payload_locked_documents_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_locked_documents_updated_at_idx ON public.payload_locked_documents USING btree (updated_at);


--
-- Name: payload_migrations_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_migrations_created_at_idx ON public.payload_migrations USING btree (created_at);


--
-- Name: payload_migrations_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_migrations_updated_at_idx ON public.payload_migrations USING btree (updated_at);


--
-- Name: payload_preferences_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_preferences_created_at_idx ON public.payload_preferences USING btree (created_at);


--
-- Name: payload_preferences_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_preferences_key_idx ON public.payload_preferences USING btree (key);


--
-- Name: payload_preferences_rels_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_preferences_rels_order_idx ON public.payload_preferences_rels USING btree ("order");


--
-- Name: payload_preferences_rels_parent_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_preferences_rels_parent_idx ON public.payload_preferences_rels USING btree (parent_id);


--
-- Name: payload_preferences_rels_path_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_preferences_rels_path_idx ON public.payload_preferences_rels USING btree (path);


--
-- Name: payload_preferences_rels_users_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_preferences_rels_users_id_idx ON public.payload_preferences_rels USING btree (users_id);


--
-- Name: payload_preferences_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX payload_preferences_updated_at_idx ON public.payload_preferences USING btree (updated_at);


--
-- Name: products_category_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_category_idx ON public.products USING btree (category_id);


--
-- Name: products_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_created_at_idx ON public.products USING btree (created_at);


--
-- Name: products_images_image_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_images_image_idx ON public.products_images USING btree (image_id);


--
-- Name: products_images_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_images_order_idx ON public.products_images USING btree (_order);


--
-- Name: products_images_parent_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_images_parent_id_idx ON public.products_images USING btree (_parent_id);


--
-- Name: products_slug_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX products_slug_idx ON public.products USING btree (slug);


--
-- Name: products_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_updated_at_idx ON public.products USING btree (updated_at);


--
-- Name: reviews_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reviews_created_at_idx ON public.reviews USING btree (created_at);


--
-- Name: reviews_media_file_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reviews_media_file_idx ON public.reviews_media USING btree (file_id);


--
-- Name: reviews_media_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reviews_media_order_idx ON public.reviews_media USING btree (_order);


--
-- Name: reviews_media_parent_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reviews_media_parent_id_idx ON public.reviews_media USING btree (_parent_id);


--
-- Name: reviews_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX reviews_updated_at_idx ON public.reviews USING btree (updated_at);


--
-- Name: users_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: users_referral_code_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_referral_code_idx ON public.users USING btree (referral_code);


--
-- Name: users_sessions_order_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_sessions_order_idx ON public.users_sessions USING btree (_order);


--
-- Name: users_sessions_parent_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_sessions_parent_id_idx ON public.users_sessions USING btree (_parent_id);


--
-- Name: users_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX users_updated_at_idx ON public.users USING btree (updated_at);


--
-- Name: waitlist_created_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX waitlist_created_at_idx ON public.waitlist USING btree (created_at);


--
-- Name: waitlist_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX waitlist_email_idx ON public.waitlist USING btree (email);


--
-- Name: waitlist_founder_key_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX waitlist_founder_key_idx ON public.waitlist USING btree (founder_key_id);


--
-- Name: waitlist_updated_at_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX waitlist_updated_at_idx ON public.waitlist USING btree (updated_at);


--
-- Name: access_requests access_requests_founder_key_id_founder_keys_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.access_requests
    ADD CONSTRAINT access_requests_founder_key_id_founder_keys_id_fk FOREIGN KEY (founder_key_id) REFERENCES public.founder_keys(id) ON DELETE SET NULL;


--
-- Name: categories categories_hero_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_hero_image_id_media_id_fk FOREIGN KEY (hero_image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: founder_keys founder_keys_assigned_to_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.founder_keys
    ADD CONSTRAINT founder_keys_assigned_to_id_users_id_fk FOREIGN KEY (assigned_to_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: founder_profiles founder_profiles_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.founder_profiles
    ADD CONSTRAINT founder_profiles_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: orders_items orders_items_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders_items
    ADD CONSTRAINT orders_items_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders_items orders_items_product_id_products_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders_items
    ADD CONSTRAINT orders_items_product_id_products_id_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE SET NULL;


--
-- Name: orders orders_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_access_requests_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_access_requests_fk FOREIGN KEY (access_requests_id) REFERENCES public.access_requests(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_categories_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_categories_fk FOREIGN KEY (categories_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_founder_keys_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_founder_keys_fk FOREIGN KEY (founder_keys_id) REFERENCES public.founder_keys(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_founder_profiles_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_founder_profiles_fk FOREIGN KEY (founder_profiles_id) REFERENCES public.founder_profiles(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_media_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_orders_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_orders_fk FOREIGN KEY (orders_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_locked_documents(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_products_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_products_fk FOREIGN KEY (products_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_reviews_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_reviews_fk FOREIGN KEY (reviews_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: payload_locked_documents_rels payload_locked_documents_rels_waitlist_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_waitlist_fk FOREIGN KEY (waitlist_id) REFERENCES public.waitlist(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_parent_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_preferences(id) ON DELETE CASCADE;


--
-- Name: payload_preferences_rels payload_preferences_rels_users_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: products products_category_id_categories_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_categories_id_fk FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: products_images products_images_image_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_images
    ADD CONSTRAINT products_images_image_id_media_id_fk FOREIGN KEY (image_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: products_images products_images_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_images
    ADD CONSTRAINT products_images_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: reviews_media reviews_media_file_id_media_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews_media
    ADD CONSTRAINT reviews_media_file_id_media_id_fk FOREIGN KEY (file_id) REFERENCES public.media(id) ON DELETE SET NULL;


--
-- Name: reviews_media reviews_media_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews_media
    ADD CONSTRAINT reviews_media_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- Name: users_sessions users_sessions_parent_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: waitlist waitlist_founder_key_id_founder_keys_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waitlist
    ADD CONSTRAINT waitlist_founder_key_id_founder_keys_id_fk FOREIGN KEY (founder_key_id) REFERENCES public.founder_keys(id) ON DELETE SET NULL;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict CssXz2wcN3OyoYju7UrYRQ0LmDCRKdszy9UcTOhmXJH6gtcW9CHTfwsbFmJadT7


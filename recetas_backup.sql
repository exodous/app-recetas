--
-- PostgreSQL database dump
--

\restrict e0GKwa7W6fapayDp8R2Mrk2uMi7PFrcZC3kAxFauxzfMlYPbEbXJvnKG5nBmG9W

-- Dumped from database version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: recetas
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO recetas;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: recetas
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categorias; Type: TABLE; Schema: public; Owner: recetas
--

CREATE TABLE public.categorias (
    id text NOT NULL,
    nombre jsonb NOT NULL,
    slug text NOT NULL,
    icono text DEFAULT '🍽️'::text NOT NULL,
    orden integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.categorias OWNER TO recetas;

--
-- Name: descargas_locales; Type: TABLE; Schema: public; Owner: recetas
--

CREATE TABLE public.descargas_locales (
    id text NOT NULL,
    usuario_id text NOT NULL,
    receta_id text NOT NULL,
    descargada_en timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.descargas_locales OWNER TO recetas;

--
-- Name: ingredientes; Type: TABLE; Schema: public; Owner: recetas
--

CREATE TABLE public.ingredientes (
    id text NOT NULL,
    nombre jsonb NOT NULL,
    unidad_base text NOT NULL,
    tipo_id text,
    es_sistema boolean DEFAULT false NOT NULL,
    creado_por text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    calorias double precision,
    proteinas double precision,
    hidratos double precision,
    grasas double precision,
    fibra double precision
);


ALTER TABLE public.ingredientes OWNER TO recetas;

--
-- Name: precio_ingredientes; Type: TABLE; Schema: public; Owner: recetas
--

CREATE TABLE public.precio_ingredientes (
    id text NOT NULL,
    ingrediente_id text NOT NULL,
    supermercado text NOT NULL,
    precio double precision NOT NULL,
    unidad text NOT NULL,
    fecha_actualizacion timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    url_producto text
);


ALTER TABLE public.precio_ingredientes OWNER TO recetas;

--
-- Name: receta_ingredientes; Type: TABLE; Schema: public; Owner: recetas
--

CREATE TABLE public.receta_ingredientes (
    receta_id text NOT NULL,
    ingrediente_id text NOT NULL,
    cantidad double precision NOT NULL,
    unidad text NOT NULL
);


ALTER TABLE public.receta_ingredientes OWNER TO recetas;

--
-- Name: recetas; Type: TABLE; Schema: public; Owner: recetas
--

CREATE TABLE public.recetas (
    id text NOT NULL,
    nombre jsonb NOT NULL,
    instrucciones jsonb NOT NULL,
    categoria_id text NOT NULL,
    usuario_id text NOT NULL,
    tiempo_min integer,
    porciones integer,
    foto_url text,
    publica boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    comida_tipo text[] DEFAULT ARRAY['almuerzo'::text, 'cena'::text]
);


ALTER TABLE public.recetas OWNER TO recetas;

--
-- Name: tipo_ingredientes; Type: TABLE; Schema: public; Owner: recetas
--

CREATE TABLE public.tipo_ingredientes (
    id text NOT NULL,
    nombre jsonb NOT NULL,
    slug text NOT NULL,
    icono text DEFAULT '🧂'::text NOT NULL,
    orden integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.tipo_ingredientes OWNER TO recetas;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: recetas
--

CREATE TABLE public.usuarios (
    id text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    nombre text NOT NULL,
    idioma_preferido text DEFAULT 'es'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.usuarios OWNER TO recetas;

--
-- Data for Name: categorias; Type: TABLE DATA; Schema: public; Owner: recetas
--

COPY public.categorias (id, nombre, slug, icono, orden, created_at) FROM stdin;
cmpwgsr260000moch0xtcss5w	{"en": "Legumes", "es": "Legumbres"}	legumbres	🫘	1	2026-06-02 09:58:21.438
cmpwgsr2l0001moch254ptgts	{"en": "Pasta", "es": "Pastas"}	pastas	🍝	2	2026-06-02 09:58:21.454
cmpwgsr2s0002mochmvrmqb4n	{"en": "Meats", "es": "Carnes"}	carnes	🥩	3	2026-06-02 09:58:21.461
cmpwgsr310003moch0kwgsjpf	{"en": "Fish", "es": "Pescados"}	pescados	🐟	4	2026-06-02 09:58:21.469
cmpwgsr3e0004mochvhuf3bdi	{"en": "Vegetables", "es": "Verduras"}	verduras	🥦	5	2026-06-02 09:58:21.483
cmpwgsr3t0005mochb882wz5b	{"en": "Soups & Creams", "es": "Sopas y cremas"}	sopas	🍲	6	2026-06-02 09:58:21.498
cmpwgsr410006mochbkfjbi41	{"en": "Salads", "es": "Ensaladas"}	ensaladas	🥗	7	2026-06-02 09:58:21.506
cmpwgsr490007mochq3lf56pi	{"en": "Desserts", "es": "Postres"}	postres	🍰	8	2026-06-02 09:58:21.513
cmpwgsr4i0008mochse2dsnoi	{"en": "Sauces", "es": "Salsas"}	salsas	🫕	9	2026-06-02 09:58:21.522
cmpwgsr4q0009mochk1s4q6pd	{"en": "Breakfasts", "es": "Desayunos"}	desayunos	🍳	10	2026-06-02 09:58:21.53
cmpwgsr4x000amochuhiv4fm6	{"en": "Bread & Doughs", "es": "Pan y masas"}	pan	🍞	11	2026-06-02 09:58:21.538
cmpwgsr58000bmochtjc0c5eg	{"en": "Drinks", "es": "Bebidas"}	bebidas	🥤	12	2026-06-02 09:58:21.548
cmq80j66y000cnv0i57jj258w	{"en": "Other", "es": "Otro"}	otro	🍽️	13	2026-06-10 11:56:14.746
\.


--
-- Data for Name: descargas_locales; Type: TABLE DATA; Schema: public; Owner: recetas
--

COPY public.descargas_locales (id, usuario_id, receta_id, descargada_en) FROM stdin;
\.


--
-- Data for Name: ingredientes; Type: TABLE DATA; Schema: public; Owner: recetas
--

COPY public.ingredientes (id, nombre, unidad_base, tipo_id, es_sistema, creado_por, created_at, updated_at, calorias, proteinas, hidratos, grasas, fibra) FROM stdin;
cmpxolkg700019tu4m068b45g	{"en": "Jalapeños", "es": "Jalapeños"}	g	\N	f	cmpwiwkmn0002kh2oapp4tn8r	2026-06-03 06:24:29.361	2026-06-03 06:24:29.361	\N	\N	\N	\N	\N
tomate	{"en": "Tomato", "es": "Tomate"}	g	cmpwgsr6r000gmochzos1vw87	t	\N	2026-06-02 09:58:21.649	2026-06-10 11:56:14.949	18	0.9	3.9	0.2	1.2
cebolla	{"en": "Onion", "es": "Cebolla"}	g	cmpwgsr6r000gmochzos1vw87	t	\N	2026-06-02 09:58:21.696	2026-06-10 11:56:15.074	40	1.1	9.3	0.1	1.7
ajo	{"en": "Garlic", "es": "Ajo"}	ud	cmpwgsr6r000gmochzos1vw87	t	\N	2026-06-02 09:58:21.766	2026-06-10 11:56:15.175	149	6.4	33.1	0.5	2.1
pimiento	{"en": "Bell pepper", "es": "Pimiento"}	g	cmpwgsr6r000gmochzos1vw87	t	\N	2026-06-02 09:58:21.792	2026-06-10 11:56:15.257	31	1	6	0.3	2.1
aceite_oliva	{"en": "Olive oil", "es": "Aceite de oliva"}	ml	cmpwgsr7l000kmoch4hcy4ds7	t	\N	2026-06-02 09:58:21.912	2026-06-10 11:56:15.336	884	0	0	100	0
sal	{"en": "Salt", "es": "Sal"}	pizca	cmpwgsr7e000jmoch53lswp4f	t	\N	2026-06-02 09:58:21.977	2026-06-10 11:56:15.439	0	0	0	0	0
pimienta	{"en": "Pepper", "es": "Pimienta"}	pizca	cmpwgsr7e000jmoch53lswp4f	t	\N	2026-06-02 09:58:22.005	2026-06-10 11:56:15.502	251	10.4	63.9	3.3	25.3
arroz	{"en": "Rice", "es": "Arroz"}	g	cmpwgsr5r000dmoch56cdocrt	t	\N	2026-06-02 09:58:22.045	2026-06-10 11:56:15.565	130	2.7	28.2	0.3	0.4
pasta	{"en": "Pasta", "es": "Pasta"}	g	cmpwgsr5r000dmoch56cdocrt	t	\N	2026-06-02 09:58:22.072	2026-06-10 11:56:15.678	131	5	25	1.1	1.8
pollo	{"en": "Chicken", "es": "Pollo"}	g	cmpwgsr60000emochr2p4yewz	t	\N	2026-06-02 09:58:22.103	2026-06-10 11:56:15.898	165	31	0	3.6	0
ternera	{"en": "Beef", "es": "Ternera"}	g	cmpwgsr60000emochr2p4yewz	t	\N	2026-06-02 09:58:22.127	2026-06-10 11:56:17.054	250	26	0	15	0
cerdo	{"en": "Pork", "es": "Cerdo"}	g	cmpwgsr60000emochr2p4yewz	t	\N	2026-06-02 09:58:22.148	2026-06-10 11:56:17.147	242	27	0	14	0
merluza	{"en": "Hake", "es": "Merluza"}	g	cmpwgsr68000fmochtsbq8234	t	\N	2026-06-02 09:58:22.168	2026-06-10 11:56:17.235	82	17	0	1.3	0
lentejas	{"en": "Lentils", "es": "Lentejas"}	g	cmpwgsr5g000cmocht388jsbi	t	\N	2026-06-02 09:58:22.205	2026-06-10 11:56:17.333	116	9	20	0.4	7.9
garbanzos	{"en": "Chickpeas", "es": "Garbanzos"}	g	cmpwgsr5g000cmocht388jsbi	t	\N	2026-06-02 09:58:22.311	2026-06-10 11:56:17.461	164	8.9	27.4	2.6	7.6
huevo	{"en": "Egg", "es": "Huevo"}	ud	cmpwgsr60000emochr2p4yewz	t	\N	2026-06-02 09:58:22.439	2026-06-10 11:56:17.648	155	12.6	1.1	11	0
leche	{"en": "Milk", "es": "Leche"}	ml	cmpwgsr76000imochdxs03z2t	t	\N	2026-06-02 09:58:22.535	2026-06-10 11:56:17.784	42	3.4	5	1	0
mantequilla	{"en": "Butter", "es": "Mantequilla"}	g	cmpwgsr76000imochdxs03z2t	t	\N	2026-06-02 09:58:22.567	2026-06-10 11:56:17.891	717	0.9	0.1	81	0
harina	{"en": "Flour", "es": "Harina"}	g	cmpwgsr5r000dmoch56cdocrt	t	\N	2026-06-02 09:58:22.587	2026-06-10 11:56:17.984	364	10.3	76.3	1	2.7
azucar	{"en": "Sugar", "es": "Azúcar"}	g	cmpwgsr7t000lmoch6dn1f7cu	t	\N	2026-06-02 09:58:22.607	2026-06-10 11:56:18.065	387	0	100	0	0
limon	{"en": "Lemon", "es": "Limón"}	ud	cmpwgsr6y000hmochwde0ainz	t	\N	2026-06-02 09:58:22.627	2026-06-10 11:56:18.144	29	1.1	9.3	0.3	2.8
zanahoria	{"en": "Carrot", "es": "Zanahoria"}	g	cmpwgsr6r000gmochzos1vw87	t	\N	2026-06-02 09:58:22.708	2026-06-10 11:56:18.225	41	0.9	9.6	0.2	2.8
patata	{"en": "Potato", "es": "Patata"}	g	cmpwgsr6r000gmochzos1vw87	t	\N	2026-06-02 09:58:22.768	2026-06-10 11:56:18.307	77	2	17.5	0.1	2.2
calabacin	{"en": "Zucchini", "es": "Calabacín"}	g	cmpwgsr6r000gmochzos1vw87	t	\N	2026-06-02 09:58:22.864	2026-06-10 11:56:18.408	17	1.2	3.1	0.3	1
berenjena	{"en": "Eggplant", "es": "Berenjena"}	g	cmpwgsr6r000gmochzos1vw87	t	\N	2026-06-02 09:58:22.913	2026-06-10 11:56:18.519	25	1	6	0.2	3
espinacas	{"en": "Spinach", "es": "Espinacas"}	g	cmpwgsr6r000gmochzos1vw87	t	\N	2026-06-02 09:58:22.932	2026-06-10 11:56:18.606	23	2.9	3.6	0.4	2.2
queso	{"en": "Cheese", "es": "Queso"}	g	cmpwgsr76000imochdxs03z2t	t	\N	2026-06-02 09:58:22.951	2026-06-10 11:56:18.688	350	25	1.3	27	0
nata	{"en": "Cream", "es": "Nata"}	ml	cmpwgsr76000imochdxs03z2t	t	\N	2026-06-02 09:58:22.977	2026-06-10 11:56:18.767	340	2.1	2.8	36	0
perejil	{"en": "Parsley", "es": "Perejil"}	pizca	cmpwgsr7e000jmoch53lswp4f	t	\N	2026-06-02 09:58:23.001	2026-06-10 11:56:18.847	36	3	6.3	0.8	3.3
laurel	{"en": "Bay leaf", "es": "Laurel"}	ud	cmpwgsr7e000jmoch53lswp4f	t	\N	2026-06-02 09:58:23.016	2026-06-10 11:56:18.908	313	7.6	75	8.4	26.3
pimenton	{"en": "Paprika", "es": "Pimentón"}	cucharadita	cmpwgsr7e000jmoch53lswp4f	t	\N	2026-06-02 09:58:23.031	2026-06-10 11:56:18.973	282	14.1	53.9	13	34.9
comino	{"en": "Cumin", "es": "Comino"}	cucharadita	cmpwgsr7e000jmoch53lswp4f	t	\N	2026-06-02 09:58:23.045	2026-06-10 11:56:19.039	375	17.8	44.2	22.3	10.5
canela	{"en": "Cinnamon", "es": "Canela"}	cucharadita	cmpwgsr7e000jmoch53lswp4f	t	\N	2026-06-02 09:58:23.061	2026-06-10 11:56:19.105	247	4	80.6	1.2	53.1
nuez_moscada	{"en": "Nutmeg", "es": "Nuez moscada"}	pizca	cmpwgsr7e000jmoch53lswp4f	t	\N	2026-06-02 09:58:23.077	2026-06-10 11:56:19.173	525	5.8	49.3	36.3	20.8
vinagre	{"en": "Vinegar", "es": "Vinagre"}	ml	cmpwgsr7t000lmoch6dn1f7cu	t	\N	2026-06-02 09:58:23.092	2026-06-10 11:56:19.233	18	0	0.9	0	0
salsa_soja	{"en": "Soy sauce", "es": "Salsa de soja"}	ml	cmpwgsr7e000jmoch53lswp4f	t	\N	2026-06-02 09:58:23.124	2026-06-10 11:56:19.323	53	8.1	4.9	0.6	0.8
miel	{"en": "Honey", "es": "Miel"}	cucharada	cmpwgsr7t000lmoch6dn1f7cu	t	\N	2026-06-02 09:58:23.151	2026-06-10 11:56:19.384	304	0.3	82.4	0	0.2
pan	{"en": "Bread", "es": "Pan"}	g	cmpwgsr5r000dmoch56cdocrt	t	\N	2026-06-02 09:58:23.171	2026-06-10 11:56:19.469	265	9	49	3.2	2.7
lechuga	{"en": "Lettuce", "es": "Lechuga"}	g	cmpwgsr6r000gmochzos1vw87	t	\N	2026-06-02 09:58:23.19	2026-06-10 11:56:19.551	15	1.4	2.9	0.2	1.3
maiz	{"en": "Corn", "es": "Maíz"}	g	cmpwgsr6r000gmochzos1vw87	t	\N	2026-06-02 09:58:23.211	2026-06-10 11:56:19.663	86	3.3	19	1.4	2.7
guisantes	{"en": "Peas", "es": "Guisantes"}	g	cmpwgsr5g000cmocht388jsbi	t	\N	2026-06-02 09:58:23.231	2026-06-10 11:56:19.744	81	5.4	14.5	0.4	5.1
oregano	{"en": "Oregano", "es": "Orégano"}	pizca	cmpwgsr7e000jmoch53lswp4f	t	\N	2026-06-02 09:58:23.273	2026-06-10 11:56:19.89	265	9	68.9	4.3	42.5
romero	{"en": "Rosemary", "es": "Romero"}	pizca	cmpwgsr7e000jmoch53lswp4f	t	\N	2026-06-02 09:58:23.287	2026-06-10 11:56:19.953	131	3.3	20.7	5.9	14.1
tomillo	{"en": "Thyme", "es": "Tomillo"}	pizca	cmpwgsr7e000jmoch53lswp4f	t	\N	2026-06-02 09:58:23.301	2026-06-10 11:56:20.015	101	5.6	24.5	1.7	14
cmq800xs60003uvds9ywhnlek	{"en": "Quinoa", "es": "Quinoa"}	g	\N	f	cmpwiwkmn0002kh2oapp4tn8r	2026-06-10 11:42:04.037	2026-06-10 11:42:04.037	\N	\N	\N	\N	\N
cmq8023gj0005uvdszathezil	{"en": "Maiz en lata", "es": "Maiz en lata"}	g	\N	f	cmpwiwkmn0002kh2oapp4tn8r	2026-06-10 11:42:58.051	2026-06-10 11:42:58.051	\N	\N	\N	\N	\N
cmq8043d40007uvds8pw8y3nj	{"en": "Brotes tiernos", "es": "Brotes tiernos"}	g	\N	f	cmpwiwkmn0002kh2oapp4tn8r	2026-06-10 11:44:31.239	2026-06-10 11:44:31.239	\N	\N	\N	\N	\N
cmq804sig0009uvds1sfexshv	{"en": "Mozarella fresca", "es": "Mozarella fresca"}	g	\N	f	cmpwiwkmn0002kh2oapp4tn8r	2026-06-10 11:45:03.831	2026-06-10 11:45:03.831	\N	\N	\N	\N	\N
cmq808a64000duvdseg44ucmq	{"en": "Lomo Trucha", "es": "Lomo Trucha"}	ud	\N	f	cmpwiwkmn0002kh2oapp4tn8r	2026-06-10 11:47:46.683	2026-06-10 11:47:46.683	\N	\N	\N	\N	\N
judias_blancas	{"en": "White beans", "es": "Judías blancas"}	g	cmpwgsr5g000cmocht388jsbi	t	\N	2026-06-02 09:58:22.383	2026-06-10 11:56:17.552	114	7.3	21.4	0.5	5.1
albahaca	{"en": "Basil", "es": "Albahaca"}	pizca	cmpwgsr7e000jmoch53lswp4f	t	\N	2026-06-02 09:58:23.25	2026-06-10 11:56:19.828	23	3.2	2.7	0.6	1.6
cmq81bf6b000luvdsptb41out	{"en": "Vino blanco de mesa", "es": "Vino blanco de mesa"}	ml	cmpwgsr7t000lmoch6dn1f7cu	f	cmpwiwkmn0002kh2oapp4tn8r	2026-06-10 12:18:12.754	2026-06-10 12:18:12.754	62	0	0	0	0
\.


--
-- Data for Name: precio_ingredientes; Type: TABLE DATA; Schema: public; Owner: recetas
--

COPY public.precio_ingredientes (id, ingrediente_id, supermercado, precio, unidad, fecha_actualizacion, url_producto) FROM stdin;
cmpwgsr8g000pmoch5n9ovp2j	tomate	lidl	1.89	kg	2026-06-10 11:56:15.002	\N
cmpwgsr8l000rmoch6dhw2oma	tomate	carrefour	1.89	kg	2026-06-10 11:56:15.025	\N
cmpwgsr8t000tmochpay00b3w	tomate	dia	2.05	kg	2026-06-10 11:56:15.051	\N
cmpwgsr9v000vmochm8s3xpvx	cebolla	mercadona	1.49	kg	2026-06-10 11:56:15.093	\N
cmpwgsrae000xmoch3ykdqu5h	cebolla	lidl	1.19	kg	2026-06-10 11:56:15.112	\N
cmpwgsraq000zmoch6yqukcvu	cebolla	carrefour	1.29	kg	2026-06-10 11:56:15.133	\N
cmpwgsraw0011mochlgv8egik	cebolla	dia	1.39	kg	2026-06-10 11:56:15.153	\N
cmpwgsrbj0013mochj1i1utn0	ajo	mercadona	1.25	ud	2026-06-10 11:56:15.194	\N
cmpwgsrbn0015mochyfne4yvd	ajo	lidl	0.99	ud	2026-06-10 11:56:15.214	\N
cmpwgsrbt0017moch9yjxnrgz	ajo	carrefour	0.99	ud	2026-06-10 11:56:15.234	\N
cmpwgsrch0019mochwllbyn2e	pimiento	mercadona	2.99	kg	2026-06-10 11:56:15.276	\N
cmpwgsrdh001bmochi0nlaswa	pimiento	lidl	2.49	kg	2026-06-10 11:56:15.295	\N
cmpwgsre2001dmoch8w6ixkf0	pimiento	carrefour	2.69	kg	2026-06-10 11:56:15.315	\N
cmpwgsrfm001fmochubj4ntmq	aceite_oliva	mercadona	6.49	l	2026-06-10 11:56:15.355	\N
cmpwgsrfu001hmochkcsouf8b	aceite_oliva	lidl	5.99	l	2026-06-10 11:56:15.377	\N
cmpwgsrgk001jmochojx82xyw	aceite_oliva	carrefour	5.99	l	2026-06-10 11:56:15.397	\N
cmpwgsrgs001lmoch4swtt3q1	aceite_oliva	dia	6.89	l	2026-06-10 11:56:15.418	\N
cmpwgsrha001nmochag36ejfd	sal	mercadona	0.49	ud	2026-06-10 11:56:15.46	\N
cmpwgsrhk001pmoch7ho710lt	sal	lidl	0.35	ud	2026-06-10 11:56:15.48	\N
cmpwgsri9001rmochm934qzxp	pimienta	mercadona	1.79	ud	2026-06-10 11:56:15.522	\N
cmpwgsrio001tmochvuxa169f	pimienta	lidl	1.49	ud	2026-06-10 11:56:15.543	\N
cmpwgsrj7001vmochc85himri	arroz	mercadona	1.29	kg	2026-06-10 11:56:15.586	\N
cmpwgsrjd001xmochv8nyxgki	arroz	lidl	1.09	kg	2026-06-10 11:56:15.612	\N
cmpwgsrjn0021moch1wpcdaat	arroz	dia	1.35	kg	2026-06-10 11:56:15.655	\N
cmpwgsrjy0023moch1li3si04	pasta	mercadona	1.49	kg	2026-06-10 11:56:15.73	\N
cmpwgsrk20025mochxri620ld	pasta	lidl	1.09	kg	2026-06-10 11:56:15.765	\N
cmpwgsrk90027mochtgzwi0ji	pasta	carrefour	1.29	kg	2026-06-10 11:56:15.8	\N
cmpwgsrkf0029mochncps7rxy	pasta	dia	1.39	kg	2026-06-10 11:56:15.849	\N
cmpwgsrkt002bmochxde9j47x	pollo	mercadona	7.49	kg	2026-06-10 11:56:15.917	\N
cmpwgsrkx002dmochyb13aerb	pollo	lidl	6.49	kg	2026-06-10 11:56:15.968	\N
cmpwgsrl2002fmoch1v8ju2xm	pollo	carrefour	6.89	kg	2026-06-10 11:56:16.994	\N
cmpwgsrl6002hmoch86v7s5tu	pollo	dia	7.19	kg	2026-06-10 11:56:17.029	\N
cmpwgsrlg002jmochaq6whofe	ternera	mercadona	14.99	kg	2026-06-10 11:56:17.075	\N
cmpwgsrlk002lmochy10fw8ph	ternera	lidl	12.99	kg	2026-06-10 11:56:17.098	\N
cmpwgsrlp002nmochqbpy517o	ternera	carrefour	13.49	kg	2026-06-10 11:56:17.122	\N
cmpwgsrm1002pmoch3g6igpvx	cerdo	mercadona	6.99	kg	2026-06-10 11:56:17.166	\N
cmpwgsrm7002rmochp9e8p8vn	cerdo	lidl	5.99	kg	2026-06-10 11:56:17.187	\N
cmpwgsrmb002tmochht1a9e0e	cerdo	carrefour	5.99	kg	2026-06-10 11:56:17.212	\N
cmpwgsrml002vmochosgp58s1	merluza	mercadona	12.99	kg	2026-06-10 11:56:17.258	\N
cmpwgsrmq002xmochz8ofvsey	merluza	lidl	10.99	kg	2026-06-10 11:56:17.283	\N
cmpwgsrmy002zmochcjuvm9t0	merluza	carrefour	11.49	kg	2026-06-10 11:56:17.307	\N
cmpwgsro00031mochj3zpl2hy	lentejas	mercadona	2.29	kg	2026-06-10 11:56:17.356	\N
cmpwgsroe0033mochr4797tac	lentejas	lidl	1.89	kg	2026-06-10 11:56:17.381	\N
cmpwgsrpo0035mochbvoli7fu	lentejas	carrefour	2.09	kg	2026-06-10 11:56:17.404	\N
cmpwgsrpz0037mochajavuy46	lentejas	dia	2.15	kg	2026-06-10 11:56:17.428	\N
cmpwgsrrf0039mochnhcw8ixq	garbanzos	mercadona	2.49	kg	2026-06-10 11:56:17.487	\N
cmpwgsrrq003bmochaj5hs51p	garbanzos	lidl	2.09	kg	2026-06-10 11:56:17.51	\N
cmpwgsrso003fmochx2hxunw4	judias_blancas	mercadona	2.39	kg	2026-06-10 11:56:17.575	\N
cmpwgsrt2003hmochyjcj0jyh	judias_blancas	lidl	1.99	kg	2026-06-10 11:56:17.599	\N
cmpwgsrtj003jmocheh7nksc2	judias_blancas	carrefour	2.09	kg	2026-06-10 11:56:17.623	\N
cmpwgsrur003lmochc8j573kc	huevo	mercadona	2.69	docena	2026-06-10 11:56:17.67	\N
cmpwgsrvd003nmochntyc2xit	huevo	lidl	2.29	docena	2026-06-10 11:56:17.69	\N
cmpwgsrw1003pmochtgqb8sha	huevo	carrefour	2.89	docena	2026-06-10 11:56:17.712	\N
cmpwgsrw7003rmoch5v2188dh	huevo	dia	2.59	docena	2026-06-10 11:56:17.735	\N
cmpwgsrwf003tmochkc9nvbeo	huevo	aldi	1.99	docena	2026-06-10 11:56:17.759	\N
cmpwgsrwv003vmochx6jgauve	leche	mercadona	1.19	l	2026-06-10 11:56:17.806	\N
cmpwgsrx0003xmochhomimnsq	leche	lidl	0.95	l	2026-06-10 11:56:17.829	\N
cmpwgsrx6003zmochx1y2rs68	leche	carrefour	1.09	l	2026-06-10 11:56:17.85	\N
cmpwgsrxd0041mochktzg1v20	leche	dia	1.25	l	2026-06-10 11:56:17.87	\N
cmpwgsrxo0043mocht6x0037u	mantequilla	mercadona	2.89	ud	2026-06-10 11:56:17.91	\N
cmpwgsrxt0045mochrhoa4lj9	mantequilla	lidl	2.49	ud	2026-06-10 11:56:17.943	\N
cmpwgsrxx0047moch0q06v9v6	mantequilla	carrefour	2.69	ud	2026-06-10 11:56:17.962	\N
cmpwgsry80049mochz37e60mv	harina	mercadona	1.09	kg	2026-06-10 11:56:18.003	\N
cmpwgsryc004bmoch99eim95x	harina	lidl	0.89	kg	2026-06-10 11:56:18.024	\N
cmpwgsryh004dmoch1hos70v4	harina	carrefour	0.95	kg	2026-06-10 11:56:18.043	\N
cmpwgsrys004fmochziagcd71	azucar	mercadona	1.19	kg	2026-06-10 11:56:18.084	\N
cmpwgsryx004hmochtuew4geg	azucar	lidl	0.99	kg	2026-06-10 11:56:18.104	\N
cmpwgsrz2004jmochxgeff940	azucar	carrefour	0.99	kg	2026-06-10 11:56:18.123	\N
cmpwgss04004lmochwqskifgz	limon	mercadona	1.99	kg	2026-06-10 11:56:18.163	\N
cmpwgss0b004nmoch0qzzeaqt	limon	lidl	1.69	kg	2026-06-10 11:56:18.183	\N
cmpwgss0f004pmochriil3s5x	limon	carrefour	1.79	kg	2026-06-10 11:56:18.203	\N
cmpwgss2o004tmochb6f54j9y	zanahoria	lidl	0.99	kg	2026-06-10 11:56:18.265	\N
cmpwgss2x004vmochlre4moxk	zanahoria	carrefour	1.09	kg	2026-06-10 11:56:18.285	\N
cmpwgss3t004xmochefppk3iy	patata	mercadona	1.79	kg	2026-06-10 11:56:18.326	\N
cmpwgss43004zmoch1eo9vbgq	patata	lidl	1.49	kg	2026-06-10 11:56:18.346	\N
cmpwgss4m0051mochchh0eo3g	patata	carrefour	1.49	kg	2026-06-10 11:56:18.366	\N
cmpwgss520053mochpznxpv59	patata	dia	1.59	kg	2026-06-10 11:56:18.386	\N
cmpwgss610055mochdv3rhvoq	calabacin	mercadona	2.49	kg	2026-06-10 11:56:18.428	\N
cmpwgss6p0057mochnyozacbi	calabacin	lidl	2.19	kg	2026-06-10 11:56:18.449	\N
cmpxolkg700029tu403gbb134	cmpxolkg700019tu4m068b45g	mercadona	2.5	kg	2026-06-03 06:24:29.361	\N
cmpxolkg700039tu4k7v5iip8	cmpxolkg700019tu4m068b45g	lidl	2.3	kg	2026-06-03 06:24:29.361	\N
cmpwgsr8a000nmochdjlxvo0s	tomate	mercadona	2.19	kg	2026-06-10 11:56:14.974	\N
cmpwgsrjj001zmochldcis2xz	arroz	carrefour	1.15	kg	2026-06-10 11:56:15.633	\N
cmpwgsrry003dmochuboj48gl	garbanzos	carrefour	2.19	kg	2026-06-10 11:56:17.531	\N
cmpwgss22004rmochlg79gtsx	zanahoria	mercadona	1.29	kg	2026-06-10 11:56:18.244	\N
cmpwgss6v0059mochb2zcn6x6	calabacin	carrefour	2.19	kg	2026-06-10 11:56:18.474	\N
cmpwgss7a005bmochm8qlle8l	berenjena	mercadona	2.69	kg	2026-06-10 11:56:18.543	\N
cmpwgss7f005dmochsz0sspup	berenjena	lidl	2.29	kg	2026-06-10 11:56:18.564	\N
cmpwgss7j005fmoch48igdg0h	berenjena	carrefour	2.39	kg	2026-06-10 11:56:18.584	\N
cmpwgss7t005hmoch0wbqtd5r	espinacas	mercadona	1.99	ud	2026-06-10 11:56:18.625	\N
cmpwgss7y005jmoche06x7szb	espinacas	lidl	1.69	ud	2026-06-10 11:56:18.646	\N
cmpwgss82005lmochmnzxwmf2	espinacas	carrefour	1.79	ud	2026-06-10 11:56:18.666	\N
cmpwgss8d005nmochn2lhuvss	queso	mercadona	8.49	kg	2026-06-10 11:56:18.707	\N
cmpwgss8j005pmoch1ul69vag	queso	lidl	7.49	kg	2026-06-10 11:56:18.726	\N
cmpwgss8n005rmoch1w291oxz	queso	carrefour	7.99	kg	2026-06-10 11:56:18.746	\N
cmpwgss96005tmochwginunk5	nata	mercadona	2.99	l	2026-06-10 11:56:18.785	\N
cmpwgss9b005vmocha9in8t6q	nata	lidl	2.49	l	2026-06-10 11:56:18.806	\N
cmpwgss9g005xmochk00hmhd6	nata	carrefour	2.69	l	2026-06-10 11:56:18.826	\N
cmpwgss9p005zmochl6lf0b9j	perejil	mercadona	0.79	ud	2026-06-10 11:56:18.866	\N
cmpwgss9u0061mochq5eriydi	perejil	lidl	0.59	ud	2026-06-10 11:56:18.887	\N
cmpwgssa50063mochn6fy4mt4	laurel	mercadona	1.15	ud	2026-06-10 11:56:18.928	\N
cmpwgssaa0065mochxmzclsos	laurel	lidl	0.95	ud	2026-06-10 11:56:18.951	\N
cmpwgssak0067mochrebndkob	pimenton	mercadona	1.69	ud	2026-06-10 11:56:18.992	\N
cmpwgssao0069mochw03sstjk	pimenton	lidl	1.39	ud	2026-06-10 11:56:19.013	\N
cmpwgssaz006bmochcv2i65ww	comino	mercadona	1.59	ud	2026-06-10 11:56:19.058	\N
cmpwgssb4006dmochogwrknzj	comino	lidl	1.29	ud	2026-06-10 11:56:19.084	\N
cmpwgssbf006fmoch7z4gacan	canela	mercadona	1.49	ud	2026-06-10 11:56:19.13	\N
cmpwgssbk006hmochwnilhjce	canela	lidl	1.19	ud	2026-06-10 11:56:19.151	\N
cmpwgssbu006jmochg58tg1ys	nuez_moscada	mercadona	2.29	ud	2026-06-10 11:56:19.192	\N
cmpwgssbz006lmochnal8wlr2	nuez_moscada	lidl	1.99	ud	2026-06-10 11:56:19.212	\N
cmpwgssca006nmoch5zdazse3	vinagre	mercadona	1.39	l	2026-06-10 11:56:19.254	\N
cmpwgsscf006pmochs44ej2oh	vinagre	lidl	1.09	l	2026-06-10 11:56:19.278	\N
cmpwgsscq006rmochv8xui4ik	vinagre	carrefour	1.19	l	2026-06-10 11:56:19.301	\N
cmpwgssd5006tmochn4qkh3eq	salsa_soja	mercadona	2.49	l	2026-06-10 11:56:19.342	\N
cmpwgssdb006vmochsx9fcn6u	salsa_soja	lidl	2.19	l	2026-06-10 11:56:19.362	\N
cmpwgssdw006xmoch21rlhk6v	miel	mercadona	5.99	kg	2026-06-10 11:56:19.403	\N
cmpwgsse0006zmochtmnw17jy	miel	lidl	5.49	kg	2026-06-10 11:56:19.426	\N
cmpwgsse50071mochk4gmcqle	miel	carrefour	5.49	kg	2026-06-10 11:56:19.447	\N
cmpwgsseg0073moch8nonuf7q	pan	mercadona	1.25	ud	2026-06-10 11:56:19.488	\N
cmpwgssek0075mochjtl03bzu	pan	lidl	0.99	ud	2026-06-10 11:56:19.508	\N
cmpwgssep0077moch6zjttx55	pan	dia	1.15	ud	2026-06-10 11:56:19.529	\N
cmpwgssez0079moch1nyhtwh1	lechuga	mercadona	0.99	ud	2026-06-10 11:56:19.571	\N
cmpwgssf4007bmoch87xqfuvi	lechuga	lidl	0.79	ud	2026-06-10 11:56:19.604	\N
cmpwgssf9007dmochjgitk2wh	lechuga	carrefour	0.89	ud	2026-06-10 11:56:19.638	\N
cmpwgssfk007fmocht6x1ymg5	maiz	mercadona	1.79	ud	2026-06-10 11:56:19.682	\N
cmpwgssfp007hmoch42xy5uxn	maiz	lidl	1.49	ud	2026-06-10 11:56:19.702	\N
cmpwgssft007jmochximitgjt	maiz	carrefour	1.59	ud	2026-06-10 11:56:19.722	\N
cmpwgssg4007lmochhfi6uxym	guisantes	mercadona	1.99	ud	2026-06-10 11:56:19.764	\N
cmpwgssg8007nmochzvjztyes	guisantes	lidl	1.69	ud	2026-06-10 11:56:19.785	\N
cmpwgssgd007pmochtaz6c1um	guisantes	carrefour	1.79	ud	2026-06-10 11:56:19.804	\N
cmpxpfyah00016vn7bq7kvcl1	albahaca	mercadona	1.15	ud	2026-06-10 11:56:19.847	\N
cmpxpfyar00036vn72qgo8xcn	albahaca	lidl	0.95	ud	2026-06-10 11:56:19.868	\N
cmpwgssha007vmoch7bhrngv7	oregano	mercadona	1.39	ud	2026-06-10 11:56:19.91	\N
cmpwgsshe007xmochb126yxp8	oregano	lidl	1.15	ud	2026-06-10 11:56:19.929	\N
cmpwgssho007zmochgt5wht1a	romero	mercadona	1.45	ud	2026-06-10 11:56:19.973	\N
cmpwgsshs0081mochj5z7srnj	romero	lidl	1.19	ud	2026-06-10 11:56:19.994	\N
cmpwgssi20083mochs8ci2nr0	tomillo	mercadona	1.49	ud	2026-06-10 11:56:20.034	\N
cmpwgssi70085moch59t93zgv	tomillo	lidl	1.25	ud	2026-06-10 11:56:20.054	\N
cmq81bf6b000muvds7xrjrkuo	cmq81bf6b000luvdsptb41out	mercadona	0.9	ml	2026-06-10 12:18:12.754	\N
\.


--
-- Data for Name: receta_ingredientes; Type: TABLE DATA; Schema: public; Owner: recetas
--

COPY public.receta_ingredientes (receta_id, ingrediente_id, cantidad, unidad) FROM stdin;
cmpwiwy7l0004kh2o3os3o8m1	albahaca	3	pizca
cmpwjlv2m00013omv200uhdli	lentejas	400	g
cmpwjlv2m00013omv200uhdli	cebolla	1	ud
cmpwjlv2m00013omv200uhdli	ajo	2	ud
cmpwjlv2m00013omv200uhdli	zanahoria	1	ud
cmpwjlv2m00013omv200uhdli	tomate	2	ud
cmpwjlv2m00013omv200uhdli	pimenton	1	cucharadita
cmpwjlv2m00013omv200uhdli	laurel	1	ud
cmpwjlv2m00013omv200uhdli	aceite_oliva	3	cucharada
cmpwjlv2m00013omv200uhdli	sal	1	pizca
cmpwjlv3700033omvg44kazea	garbanzos	400	g
cmpwjlv3700033omvg44kazea	espinacas	300	g
cmpwjlv3700033omvg44kazea	cebolla	1	ud
cmpwjlv3700033omvg44kazea	ajo	3	ud
cmpwjlv3700033omvg44kazea	tomate	2	ud
cmpwjlv3700033omvg44kazea	comino	1	cucharadita
cmpwjlv3700033omvg44kazea	pimenton	1	cucharadita
cmpwjlv3700033omvg44kazea	aceite_oliva	3	cucharada
cmpwjlv3700033omvg44kazea	sal	1	pizca
cmpwjlv3i00053omvph2413c9	judias_blancas	400	g
cmpwjlv3i00053omvph2413c9	cebolla	1	ud
cmpwjlv3i00053omvph2413c9	pimiento	1	ud
cmpwjlv3i00053omvph2413c9	zanahoria	2	ud
cmpwjlv3i00053omvph2413c9	tomate	2	ud
cmpwjlv3i00053omvph2413c9	laurel	2	ud
cmpwjlv3i00053omvph2413c9	aceite_oliva	3	cucharada
cmpwjlv3i00053omvph2413c9	sal	1	pizca
cmpwjlv3u00073omvqlcehtq0	pasta	400	g
cmpwjlv3u00073omvqlcehtq0	tomate	4	ud
cmpwjlv3u00073omvqlcehtq0	ajo	3	ud
cmpwjlv3u00073omvqlcehtq0	albahaca	1	pizca
cmpwjlv3u00073omvqlcehtq0	oregano	1	pizca
cmpwjlv3u00073omvqlcehtq0	queso	50	g
cmpwjlv3u00073omvqlcehtq0	aceite_oliva	3	cucharada
cmpwjlv3u00073omvqlcehtq0	sal	1	pizca
cmpwjlv4500093omvtal2zjuc	arroz	300	g
cmpwjlv4500093omvtal2zjuc	pollo	500	g
cmpwjlv4500093omvtal2zjuc	cebolla	1	ud
cmpwjlv4500093omvtal2zjuc	pimiento	1	ud
cmpwjlv4500093omvtal2zjuc	ajo	2	ud
cmpwjlv4500093omvtal2zjuc	aceite_oliva	3	cucharada
cmpwjlv4500093omvtal2zjuc	sal	1	pizca
cmpwjlv4500093omvtal2zjuc	pimienta	1	pizca
cmpwjlv4f000b3omv1kh3f0n3	pollo	800	g
cmpwjlv4f000b3omv1kh3f0n3	patata	4	ud
cmpwjlv4f000b3omv1kh3f0n3	ajo	4	ud
cmpwjlv4f000b3omv1kh3f0n3	romero	1	pizca
cmpwjlv4f000b3omv1kh3f0n3	tomillo	1	pizca
cmpwjlv4f000b3omv1kh3f0n3	aceite_oliva	4	cucharada
cmpwjlv4f000b3omv1kh3f0n3	sal	1	pizca
cmpwjlv4f000b3omv1kh3f0n3	pimienta	1	pizca
cmpwjlv4r000d3omvvcmulrim	ternera	600	g
cmpwjlv4r000d3omvvcmulrim	cebolla	1	ud
cmpwjlv4r000d3omvvcmulrim	zanahoria	2	ud
cmpwjlv4r000d3omvvcmulrim	pimiento	1	ud
cmpwjlv4r000d3omvvcmulrim	tomate	2	ud
cmpwjlv4r000d3omvvcmulrim	laurel	1	ud
cmpwjlv4r000d3omvvcmulrim	aceite_oliva	3	cucharada
cmpwjlv4r000d3omvvcmulrim	sal	1	pizca
cmpwjlv4r000d3omvvcmulrim	pimienta	1	pizca
cmpwjlv53000f3omv3tzvbbgx	cerdo	500	g
cmpwjlv53000f3omv3tzvbbgx	cebolla	1	ud
cmpwjlv53000f3omv3tzvbbgx	pimiento	1	ud
cmpwjlv53000f3omv3tzvbbgx	salsa_soja	3	cucharada
cmpwjlv53000f3omv3tzvbbgx	miel	2	cucharada
cmpwjlv53000f3omv3tzvbbgx	vinagre	1	cucharada
cmpwjlv53000f3omv3tzvbbgx	aceite_oliva	2	cucharada
cmpwjlv53000f3omv3tzvbbgx	sal	1	pizca
cmpwjlv53000f3omv3tzvbbgx	pimienta	1	pizca
cmpwjlv5e000h3omv8gru4ubs	huevo	4	ud
cmpwjlv5e000h3omv8gru4ubs	espinacas	150	g
cmpwjlv5e000h3omv8gru4ubs	mantequilla	20	g
cmpwjlv5e000h3omv8gru4ubs	sal	1	pizca
cmpwjlv5o000j3omvg0je0qs6	merluza	600	g
cmpwjlv5o000j3omvg0je0qs6	ajo	3	ud
cmpwjlv5o000j3omvg0je0qs6	perejil	1	pizca
cmpwjlv5o000j3omvg0je0qs6	limon	1	ud
cmpwjlv5o000j3omvg0je0qs6	aceite_oliva	3	cucharada
cmpwjlv5o000j3omvg0je0qs6	sal	1	pizca
cmpwjlv5o000j3omvg0je0qs6	pimienta	1	pizca
cmpwjlv5y000l3omvjs698t7l	merluza	600	g
cmpwjlv5y000l3omvjs698t7l	ajo	4	ud
cmpwjlv5y000l3omvjs698t7l	cebolla	1	ud
cmpwjlv5y000l3omvjs698t7l	perejil	2	pizca
cmpwjlv5y000l3omvjs698t7l	harina	1	cucharada
cmpwjlv5y000l3omvjs698t7l	aceite_oliva	3	cucharada
cmpwjlv5y000l3omvjs698t7l	sal	1	pizca
cmpwjlv6b000n3omvfe3if93b	calabacin	2	ud
cmpwjlv6b000n3omvfe3if93b	berenjena	1	ud
cmpwjlv6b000n3omvfe3if93b	pimiento	2	ud
cmpwjlv6b000n3omvfe3if93b	tomate	3	ud
cmpwjlv6b000n3omvfe3if93b	cebolla	1	ud
cmpwjlv6b000n3omvfe3if93b	ajo	2	ud
cmpwjlv6b000n3omvfe3if93b	azucar	1	pizca
cmpwjlv6b000n3omvfe3if93b	aceite_oliva	4	cucharada
cmpwjlv6b000n3omvfe3if93b	sal	1	pizca
cmpwjlv6n000p3omvh5yi765m	lechuga	1	ud
cmpwjlv6n000p3omvh5yi765m	tomate	2	ud
cmpwjlv6n000p3omvh5yi765m	cebolla	1	ud
cmpwjlv6n000p3omvh5yi765m	queso	80	g
cmpwjlv6n000p3omvh5yi765m	aceite_oliva	2	cucharada
cmpwjlv6n000p3omvh5yi765m	vinagre	1	cucharada
cmpwjlv6n000p3omvh5yi765m	sal	1	pizca
cmpwjlv6z000r3omvtjqbr4dy	calabacin	3	ud
cmpwjlv6z000r3omvtjqbr4dy	patata	2	ud
cmpwjlv6z000r3omvtjqbr4dy	cebolla	1	ud
cmpwjlv6z000r3omvtjqbr4dy	nata	100	ml
cmpwjlv6z000r3omvtjqbr4dy	aceite_oliva	2	cucharada
cmpwjlv6z000r3omvtjqbr4dy	sal	1	pizca
cmpwjlv7a000t3omvebima9v2	ajo	6	ud
cmpwjlv7a000t3omvebima9v2	pan	100	g
cmpwjlv7a000t3omvebima9v2	pimenton	1	cucharadita
cmpwjlv7a000t3omvebima9v2	huevo	1	ud
cmpwjlv7a000t3omvebima9v2	aceite_oliva	3	cucharada
cmpwjlv7a000t3omvebima9v2	sal	1	pizca
cmpwjlv7m000v3omvkawjmfyv	lechuga	1	ud
cmpwjlv7m000v3omvkawjmfyv	pollo	200	g
cmpwjlv7m000v3omvkawjmfyv	limon	1	ud
cmpwjlv7m000v3omvkawjmfyv	ajo	1	ud
cmpwjlv7m000v3omvkawjmfyv	queso	40	g
cmpwjlv7m000v3omvkawjmfyv	pan	50	g
cmpwjlv7m000v3omvkawjmfyv	aceite_oliva	2	cucharada
cmpwjlv7m000v3omvkawjmfyv	sal	1	pizca
cmpwjlv7z000x3omvb2k371or	arroz	100	g
cmpwjlv7z000x3omvb2k371or	leche	1	l
cmpwjlv7z000x3omvb2k371or	azucar	80	g
cmpwjlv7z000x3omvb2k371or	canela	1	cucharadita
cmpwjlv7z000x3omvb2k371or	limon	1	ud
cmpwjlv89000z3omvo8u64cum	pan	8	ud
cmpwjlv89000z3omvo8u64cum	leche	500	ml
cmpwjlv89000z3omvo8u64cum	huevo	2	ud
cmpwjlv89000z3omvo8u64cum	azucar	60	g
cmpwjlv89000z3omvo8u64cum	canela	1	cucharadita
cmpwjlv89000z3omvo8u64cum	aceite_oliva	100	ml
cmpwjlv8k00113omvjw4f9bzr	leche	500	ml
cmpwjlv8k00113omvjw4f9bzr	huevo	3	ud
cmpwjlv8k00113omvjw4f9bzr	azucar	60	g
cmpwjlv8k00113omvjw4f9bzr	harina	1	cucharada
cmpwjlv8k00113omvjw4f9bzr	canela	1	cucharadita
cmpwjlv8k00113omvjw4f9bzr	limon	1	ud
cmpwjlv8v00133omvmr44oc1m	ternera	400	g
cmpwjlv8v00133omvmr44oc1m	cebolla	1	ud
cmpwjlv8v00133omvmr44oc1m	zanahoria	1	ud
cmpwjlv8v00133omvmr44oc1m	ajo	2	ud
cmpwjlv8v00133omvmr44oc1m	tomate	3	ud
cmpwjlv8v00133omvmr44oc1m	oregano	1	pizca
cmpwjlv8v00133omvmr44oc1m	laurel	1	ud
cmpwjlv8v00133omvmr44oc1m	aceite_oliva	2	cucharada
cmpwjlv8v00133omvmr44oc1m	sal	1	pizca
cmpwjlv9500153omvx41njjq7	pan	2	ud
cmpwjlv9500153omvx41njjq7	tomate	1	ud
cmpwjlv9500153omvx41njjq7	aceite_oliva	1	cucharada
cmpwjlv9500153omvx41njjq7	sal	1	pizca
cmpwjlv9g00173omv1he28v68	harina	120	g
cmpwjlv9g00173omv1he28v68	huevo	2	ud
cmpwjlv9g00173omv1he28v68	leche	250	ml
cmpwjlv9g00173omv1he28v68	azucar	20	g
cmpwjlv9g00173omv1he28v68	mantequilla	20	g
cmpwjlv9g00173omv1he28v68	miel	2	cucharada
cmpwjlv9q00193omvjmxzhi50	harina	500	g
cmpwjlv9q00193omvjmxzhi50	sal	10	g
cmpwjlv9q00193omvjmxzhi50	aceite_oliva	2	cucharada
cmq6t9zrn0001uvdsijzamxv2	pan	222	g
cmq8067nu000buvdsibrvs4a1	cmq800xs60003uvds9ywhnlek	150	g
cmq8067nu000buvdsibrvs4a1	zanahoria	100	g
cmq8067nu000buvdsibrvs4a1	cmq8023gj0005uvdszathezil	100	g
cmq8067nu000buvdsibrvs4a1	huevo	2	ud
cmq8067nu000buvdsibrvs4a1	tomate	100	g
cmq8067nu000buvdsibrvs4a1	cmq8043d40007uvds8pw8y3nj	30	g
cmq8067nu000buvdsibrvs4a1	cmq804sig0009uvds1sfexshv	60	g
cmq809dq8000fuvds0hbrsypo	cmq808a64000duvdseg44ucmq	3	ud
cmq809dq8000fuvds0hbrsypo	cmq8043d40007uvds8pw8y3nj	100	g
cmq809dq8000fuvds0hbrsypo	tomate	100	g
cmq80ajtr000huvdsl95mreme	garbanzos	150	g
cmq80clfq000juvdsw9rziweq	huevo	6	ud
cmq80clfq000juvdsw9rziweq	zanahoria	100	g
cmq81brv4000ouvdsy0htzdz7	merluza	300	g
cmq81brv4000ouvdsy0htzdz7	perejil	4	pizca
cmq81brv4000ouvdsy0htzdz7	cmq81bf6b000luvdsptb41out	100	ml
\.


--
-- Data for Name: recetas; Type: TABLE DATA; Schema: public; Owner: recetas
--

COPY public.recetas (id, nombre, instrucciones, categoria_id, usuario_id, tiempo_min, porciones, foto_url, publica, created_at, updated_at, comida_tipo) FROM stdin;
cmpwiwy7l0004kh2o3os3o8m1	{"en": "3sdfa", "es": "3sdfa"}	{"en": "asdfas", "es": "asdfas"}	cmpwgsr260000moch0xtcss5w	cmpwiwkmn0002kh2oapp4tn8r	\N	\N	\N	f	2026-06-02 10:57:36.561	2026-06-02 10:57:36.561	{almuerzo,cena}
cmpwjlv2m00013omv200uhdli	{"en": "Stewed lentils", "es": "Lentejas estofadas"}	{"en": "1. Soak lentils for 30 min.\\n2. In a pot, sauté chopped onion, garlic and carrot.\\n3. Add crushed tomato and paprika.\\n4. Add drained lentils and cover with water.\\n5. Cook over medium heat 30-35 min.\\n6. Add salt and bay leaf at the end.", "es": "1. Poner las lentejas en remojo 30 min.\\n2. En una olla, sofreír la cebolla, el ajo y la zanahoria picados.\\n3. Añadir el tomate triturado y el pimentón.\\n4. Agregar las lentejas escurridas y cubrir con agua.\\n5. Cocinar a fuego medio 30-35 min.\\n6. Añadir sal y laurel al final."}	cmpwgsr260000moch0xtcss5w	cmpwiwkmn0002kh2oapp4tn8r	45	4	\N	t	2026-06-02 11:16:58.894	2026-06-02 11:16:58.894	{almuerzo,cena}
cmpwjlv3700033omvg44kazea	{"en": "Chickpeas with spinach", "es": "Garbanzos con espinacas"}	{"en": "1. If using dried chickpeas, soak overnight.\\n2. Sauté onion and garlic in olive oil.\\n3. Add crushed tomato and cook 5 min.\\n4. Add cooked chickpeas and spinach.\\n5. Cook together 15 min.\\n6. Season with cumin, paprika and salt.", "es": "1. Si usas garbanzos secos, poner en remojo la noche anterior.\\n2. Sofreír cebolla y ajo en aceite de oliva.\\n3. Añadir el tomate triturado y cocinar 5 min.\\n4. Agregar los garbanzos cocidos y las espinacas.\\n5. Cocinar todo junto 15 min.\\n6. Sazonar con comino, pimentón y sal."}	cmpwgsr260000moch0xtcss5w	cmpwiwkmn0002kh2oapp4tn8r	40	4	\N	t	2026-06-02 11:16:58.915	2026-06-02 11:16:58.915	{almuerzo,cena}
cmpwjlv3i00053omvph2413c9	{"en": "White beans with vegetables", "es": "Judías blancas con verduras"}	{"en": "1. Soak beans overnight.\\n2. Drain and cook in water with bay leaf 30 min.\\n3. In another pot, sauté onion, pepper and carrot.\\n4. Add tomato and cook 10 min.\\n5. Mix drained beans with the sofrito.\\n6. Cook together 10 more min. Season.", "es": "1. Poner las judías en remojo la noche anterior.\\n2. Escurrir y cocinar en agua con laurel 30 min.\\n3. En otra olla, sofreír cebolla, pimiento y zanahoria.\\n4. Añadir el tomate y cocinar 10 min.\\n5. Mezclar las judías escurridas con el sofrito.\\n6. Cocinar todo junto 10 min más. Sazonar."}	cmpwgsr260000moch0xtcss5w	cmpwiwkmn0002kh2oapp4tn8r	50	4	\N	t	2026-06-02 11:16:58.927	2026-06-02 11:16:58.927	{almuerzo,cena}
cmpwjlv3u00073omvqlcehtq0	{"en": "Pasta with tomato sauce", "es": "Pasta al pomodoro"}	{"en": "1. Boil salted water and cook pasta al dente.\\n2. In a pan, heat olive oil and brown garlic.\\n3. Add crushed tomato, basil and oregano.\\n4. Cook sauce 15 min over medium heat.\\n5. Drain pasta and mix with sauce.\\n6. Serve with grated cheese on top.", "es": "1. Hervir agua con sal y cocinar la pasta al dente.\\n2. En una sartén, calentar aceite de oliva y dorar el ajo.\\n3. Añadir el tomate triturado, albahaca y orégano.\\n4. Cocinar la salsa 15 min a fuego medio.\\n5. Escurrir la pasta y mezclar con la salsa.\\n6. Servir con queso rallado por encima."}	cmpwgsr2l0001moch254ptgts	cmpwiwkmn0002kh2oapp4tn8r	25	4	\N	t	2026-06-02 11:16:58.939	2026-06-02 11:16:58.939	{almuerzo,cena}
cmpwjlv4500093omvtal2zjuc	{"en": "Rice with chicken", "es": "Arroz con pollo"}	{"en": "1. Cut chicken into pieces and season.\\n2. Brown chicken in a pot with olive oil. Set aside.\\n3. In the same oil, sauté onion, pepper and garlic.\\n4. Add rice and stir 2 min.\\n5. Add chicken, cover with broth and cook 18 min.\\n6. Let rest 5 min before serving.", "es": "1. Cortar el pollo en trozos y salpimentar.\\n2. Dorar el pollo en una olla con aceite de oliva. Reservar.\\n3. En el mismo aceite, sofreír cebolla, pimiento y ajo.\\n4. Añadir el arroz y rehogar 2 min.\\n5. Incorporar el pollo, cubrir con caldo y cocinar 18 min.\\n6. Dejar reposar 5 min antes de servir."}	cmpwgsr2l0001moch254ptgts	cmpwiwkmn0002kh2oapp4tn8r	40	4	\N	t	2026-06-02 11:16:58.95	2026-06-02 11:16:58.95	{almuerzo,cena}
cmpwjlv4f000b3omv1kh3f0n3	{"en": "Roast chicken with potatoes", "es": "Pollo al horno con patatas"}	{"en": "1. Preheat oven to 200°C.\\n2. Slice potatoes and place on a tray.\\n3. Season chicken and place on top of potatoes.\\n4. Add garlic, rosemary, thyme and a drizzle of oil.\\n5. Bake 45-50 min until chicken is golden.\\n6. Serve hot with potatoes.", "es": "1. Precalentar el horno a 200°C.\\n2. Cortar las patatas en rodajas y colocar en una bandeja.\\n3. Salpimentar el pollo y colocar sobre las patatas.\\n4. Añadir ajo, romero, tomillo y un chorro de aceite.\\n5. Hornear 45-50 min hasta que el pollo esté dorado.\\n6. Servir caliente con las patatas."}	cmpwgsr2s0002mochmvrmqb4n	cmpwiwkmn0002kh2oapp4tn8r	60	4	\N	t	2026-06-02 11:16:58.96	2026-06-02 11:16:58.96	{almuerzo,cena}
cmpwjlv4r000d3omvvcmulrim	{"en": "Beef stew with vegetables", "es": "Ternera guisada con verduras"}	{"en": "1. Cut beef into cubes and season.\\n2. Brown meat in a pot with oil. Set aside.\\n3. Sauté onion, carrot and pepper.\\n4. Add tomato and cook 5 min.\\n5. Add beef and cover with water or broth.\\n6. Cook over low heat 60-70 min until tender.", "es": "1. Cortar la ternera en cubos y salpimentar.\\n2. Dorar la carne en una olla con aceite. Reservar.\\n3. Sofreír cebolla, zanahoria y pimiento.\\n4. Añadir el tomate y cocinar 5 min.\\n5. Incorporar la ternera y cubrir con agua o caldo.\\n6. Cocinar a fuego bajo 60-70 min hasta que la tierna."}	cmpwgsr2s0002mochmvrmqb4n	cmpwiwkmn0002kh2oapp4tn8r	90	4	\N	t	2026-06-02 11:16:58.971	2026-06-02 11:16:58.971	{almuerzo,cena}
cmpwjlv53000f3omv3tzvbbgx	{"en": "Sweet and sour pork", "es": "Cerdo agridulce"}	{"en": "1. Cut pork into strips and season.\\n2. Brown in a pan with oil. Set aside.\\n3. In the same pan, sauté onion and pepper.\\n4. Add soy sauce, honey and vinegar.\\n5. Add pork and cook 10 min.\\n6. Serve with white rice.", "es": "1. Cortar el cerdo en tiras y salpimentar.\\n2. Dorar en una sartén con aceite. Reservar.\\n3. En la misma sartén, saltear cebolla y pimiento.\\n4. Añadir salsa de soja, miel y vinagre.\\n5. Incorporar el cerdo y cocinar 10 min.\\n6. Servir con arroz blanco."}	cmpwgsr2s0002mochmvrmqb4n	cmpwiwkmn0002kh2oapp4tn8r	35	4	\N	t	2026-06-02 11:16:58.983	2026-06-02 11:16:58.983	{almuerzo,cena}
cmpwjlv5e000h3omv8gru4ubs	{"en": "Scrambled eggs with spinach", "es": "Huevos revueltos con espinacas"}	{"en": "1. Heat some butter in a pan.\\n2. Add spinach and sauté 2 min.\\n3. Beat eggs with a pinch of salt.\\n4. Pour over spinach and stir gently.\\n5. Cook over low heat until set.\\n6. Serve immediately.", "es": "1. Calentar un poco de mantequilla en una sartén.\\n2. Añadir las espinacas y saltear 2 min.\\n3. Batir los huevos con un poco de sal.\\n4. Verter sobre las espinacas y remover suavemente.\\n5. Cocinar a fuego bajo hasta que cuajen.\\n6. Servir inmediatamente."}	cmpwgsr2s0002mochmvrmqb4n	cmpwiwkmn0002kh2oapp4tn8r	10	2	\N	t	2026-06-02 11:16:58.994	2026-06-02 11:16:58.994	{almuerzo,cena}
cmpwjlv5o000j3omvg0je0qs6	{"en": "Baked hake", "es": "Merluza al horno"}	{"en": "1. Preheat oven to 180°C.\\n2. Place hake fillets on a tray.\\n3. Add minced garlic, parsley, lemon and oil.\\n4. Season to taste.\\n5. Bake 18-20 min until cooked.\\n6. Serve with boiled potatoes.", "es": "1. Precalentar el horno a 180°C.\\n2. Colocar los lomos de merluza en una bandeja.\\n3. Añadir ajo picado, perejil, limón y aceite.\\n4. Salpimentar al gusto.\\n5. Hornear 18-20 min hasta que esté cocida.\\n6. Servir con patatas cocidas."}	cmpwgsr310003moch0kwgsjpf	cmpwiwkmn0002kh2oapp4tn8r	30	4	\N	t	2026-06-02 11:16:59.004	2026-06-02 11:16:59.004	{almuerzo,cena}
cmpwjlv5y000l3omvjs698t7l	{"en": "Hake in green sauce", "es": "Merluza en salsa verde"}	{"en": "1. In a pot, sauté garlic and onion in oil.\\n2. Add chopped parsley and a bit of flour.\\n3. Pour fish stock gradually.\\n4. Place hake fillets in the sauce.\\n5. Cook over low heat 12-15 min.\\n6. Adjust salt and serve.", "es": "1. En una cazuela, pochar ajo y cebolla en aceite.\\n2. Añadir perejil picado y un poco de harina.\\n3. Verter caldo de pescado poco a poco.\\n4. Colocar los lomos de merluza en la salsa.\\n5. Cocinar a fuego suave 12-15 min.\\n6. Rectificar de sal y servir."}	cmpwgsr310003moch0kwgsjpf	cmpwiwkmn0002kh2oapp4tn8r	25	4	\N	t	2026-06-02 11:16:59.014	2026-06-02 11:16:59.014	{almuerzo,cena}
cmpwjlv6b000n3omvfe3if93b	{"en": "Spanish ratatouille", "es": "Pisto manchego"}	{"en": "1. Cut all vegetables into small pieces.\\n2. In a large pan, heat olive oil.\\n3. Sauté onion and garlic.\\n4. Add pepper, zucchini and eggplant.\\n5. Add tomato and cook 20 min.\\n6. Season with salt and a pinch of sugar.", "es": "1. Cortar todas las verduras en trozos pequeños.\\n2. En una sartén grande, calentar aceite de oliva.\\n3. Sofreír la cebolla y el ajo.\\n4. Añadir el pimiento, calabacín y berenjena.\\n5. Incorporar el tomate y cocinar 20 min.\\n6. Sazonar con sal y una pizca de azúcar."}	cmpwgsr3e0004mochvhuf3bdi	cmpwiwkmn0002kh2oapp4tn8r	35	4	\N	t	2026-06-02 11:16:59.027	2026-06-02 11:16:59.027	{almuerzo,cena}
cmpwjlv6n000p3omvh5yi765m	{"en": "Mediterranean salad", "es": "Ensalada mediterránea"}	{"en": "1. Wash and cut lettuce.\\n2. Slice tomato, onion and cucumber.\\n3. Add olives and cheese cubes.\\n4. Dress with olive oil, vinegar and salt.\\n5. Mix well and serve fresh.", "es": "1. Lavar y cortar la lechuga.\\n2. Cortar tomate, cebolla y pepino en rodajas.\\n3. Añadir aceitunas y queso en cubos.\\n4. Aliñar con aceite de oliva, vinagre y sal.\\n5. Mezclar bien y servir fresca."}	cmpwgsr410006mochbkfjbi41	cmpwiwkmn0002kh2oapp4tn8r	10	2	\N	t	2026-06-02 11:16:59.04	2026-06-02 11:16:59.04	{almuerzo,cena}
cmpwjlv6z000r3omvtjqbr4dy	{"en": "Zucchini cream", "es": "Crema de calabacín"}	{"en": "1. Peel and chop zucchini, potato and onion.\\n2. Sauté onion in olive oil.\\n3. Add zucchini and potato.\\n4. Cover with broth and cook 20 min.\\n5. Blend until smooth.\\n6. Add cream and adjust salt.", "es": "1. Pelar y trocear los calabacines, patata y cebolla.\\n2. Sofreír la cebolla en aceite de oliva.\\n3. Añadir el calabacín y la patata.\\n4. Cubrir con caldo y cocinar 20 min.\\n5. Triturar hasta obtener una crema fina.\\n6. Añadir nata y rectificar de sal."}	cmpwgsr3t0005mochb882wz5b	cmpwiwkmn0002kh2oapp4tn8r	30	4	\N	t	2026-06-02 11:16:59.051	2026-06-02 11:16:59.051	{almuerzo,cena}
cmpwjlv7a000t3omvebima9v2	{"en": "Garlic soup", "es": "Sopa de ajo"}	{"en": "1. Peel and slice garlic.\\n2. Brown garlic in olive oil.\\n3. Add paprika and stir briefly.\\n4. Add bread cut into pieces.\\n5. Cover with broth and cook 15 min.\\n6. Serve with optional poached egg.", "es": "1. Pelar y laminar los ajos.\\n2. Dorar los ajos en aceite de oliva.\\n3. Añadir el pimentón y rehogar brevemente.\\n4. Incorporar el pan cortado en trozos.\\n5. Cubrir con caldo y cocinar 15 min.\\n6. Servir con un huevo poché opcional."}	cmpwgsr3t0005mochb882wz5b	cmpwiwkmn0002kh2oapp4tn8r	25	4	\N	t	2026-06-02 11:16:59.062	2026-06-02 11:16:59.062	{almuerzo,cena}
cmpwjlv7m000v3omvkawjmfyv	{"en": "Caesar salad", "es": "Ensalada César"}	{"en": "1. Wash and chop lettuce.\\n2. Cut chicken into strips and brown in pan.\\n3. Prepare dressing: mix lemon, garlic, oil and cheese.\\n4. Add toasted croutons.\\n5. Mix everything and serve.", "es": "1. Lavar y trocear la lechuga.\\n2. Cortar el pollo en tiras y dorar en sartén.\\n3. Preparar la salsa: mezclar limón, ajo, aceite y queso.\\n4. Añadir picatostes de pan tostado.\\n5. Mezclar todo y servir."}	cmpwgsr410006mochbkfjbi41	cmpwiwkmn0002kh2oapp4tn8r	15	2	\N	t	2026-06-02 11:16:59.075	2026-06-02 11:16:59.075	{almuerzo,cena}
cmpwjlv7z000x3omvb2k371or	{"en": "Rice pudding", "es": "Arroz con leche"}	{"en": "1. Boil rice in milk with cinnamon and lemon.\\n2. Cook over low heat 30 min, stirring.\\n3. Add sugar and cook 5 more min.\\n4. Remove cinnamon and lemon peel.\\n5. Let cool and serve dusted with cinnamon.", "es": "1. Hervir el arroz en leche con canela y limón.\\n2. Cocinar a fuego bajo 30 min, removiendo.\\n3. Añadir el azúcar y cocinar 5 min más.\\n4. Retirar la canela y la piel de limón.\\n5. Dejar enfriar y servir espolvoreado con canela."}	cmpwgsr490007mochq3lf56pi	cmpwiwkmn0002kh2oapp4tn8r	40	4	\N	t	2026-06-02 11:16:59.088	2026-06-02 11:16:59.088	{almuerzo,cena}
cmpwjlv89000z3omvo8u64cum	{"en": "Spanish French toast", "es": "Torrijas"}	{"en": "1. Heat milk with cinnamon and sugar.\\n2. Cut bread into thick slices.\\n3. Soak slices in hot milk.\\n4. Dip in beaten egg.\\n5. Fry in hot oil until golden.\\n6. Sprinkle with sugar and cinnamon.", "es": "1. Calentar la leche con canela y azúcar.\\n2. Cortar el pan en rebanadas gruesas.\\n3. Empapar las rebanadas en la leche caliente.\\n4. Pasar por huevo batido.\\n5. Freír en aceite caliente hasta dorar.\\n6. Espolvorear con azúcar y canela."}	cmpwgsr490007mochq3lf56pi	cmpwiwkmn0002kh2oapp4tn8r	20	4	\N	t	2026-06-02 11:16:59.097	2026-06-02 11:16:59.097	{almuerzo,cena}
cmpwjlv8k00113omvjw4f9bzr	{"en": "Homemade custard", "es": "Natillas caseras"}	{"en": "1. Heat milk with cinnamon and lemon peel.\\n2. In a bowl, mix yolks with sugar and flour.\\n3. Pour hot milk gradually while stirring.\\n4. Cook over low heat until thickened.\\n5. Serve in bowls with a cookie on top.", "es": "1. Calentar la leche con canela y piel de limón.\\n2. En un bol, mezclar yemas con azúcar y harina.\\n3. Verter la leche caliente poco a poco sin dejar de remover.\\n4. Cocinar a fuego bajo hasta que espese.\\n5. Servir en cuencos con una galleta encima."}	cmpwgsr490007mochq3lf56pi	cmpwiwkmn0002kh2oapp4tn8r	20	4	\N	t	2026-06-02 11:16:59.108	2026-06-02 11:16:59.108	{almuerzo,cena}
cmpwjlv8v00133omvmr44oc1m	{"en": "Bolognese sauce", "es": "Salsa boloñesa"}	{"en": "1. Sauté chopped onion, carrot and garlic.\\n2. Add ground beef and brown.\\n3. Add crushed tomato.\\n4. Add oregano, bay leaf and a bit of wine.\\n5. Cook over low heat 30 min.\\n6. Season and serve over pasta.", "es": "1. Sofreír cebolla, zanahoria y ajo picados.\\n2. Añadir la ternera picada y dorar.\\n3. Incorporar el tomate triturado.\\n4. Añadir orégano, laurel y un poco de vino.\\n5. Cocinar a fuego bajo 30 min.\\n6. Sazonar y servir sobre pasta."}	cmpwgsr4i0008mochse2dsnoi	cmpwiwkmn0002kh2oapp4tn8r	45	4	\N	t	2026-06-02 11:16:59.119	2026-06-02 11:16:59.119	{almuerzo,cena}
cmpwjlv9500153omvx41njjq7	{"en": "Toast with tomato and olive oil", "es": "Tostada con tomate y aceite"}	{"en": "1. Toast bread in toaster or pan.\\n2. Grate ripe tomato over toast.\\n3. Add a drizzle of olive oil.\\n4. Sprinkle with salt.\\n5. Optional: add grated garlic or ham.", "es": "1. Tostar el pan en la tostadora o sartén.\\n2. Rallar el tomate maduro sobre la tostada.\\n3. Añadir un chorrito de aceite de oliva.\\n4. Espolvorear con sal.\\n5. Opcional: añadir ajo rallado o jamón."}	cmpwgsr4q0009mochk1s4q6pd	cmpwiwkmn0002kh2oapp4tn8r	5	1	\N	t	2026-06-02 11:16:59.129	2026-06-02 11:16:59.129	{almuerzo,cena}
cmpwjlv9g00173omv1he28v68	{"en": "Sweet crepes", "es": "Crepes dulces"}	{"en": "1. Mix flour, eggs, milk and sugar.\\n2. Beat until smooth batter.\\n3. Heat a pan with a bit of butter.\\n4. Pour a ladle of batter and swirl to cover.\\n5. Cook 1 min each side.\\n6. Serve with honey, cream or fruit.", "es": "1. Mezclar harina, huevos, leche y azúcar.\\n2. Batir hasta obtener una masa líquida sin grumos.\\n3. Calentar una sartén con un poco de mantequilla.\\n4. Verter un cucharón de masa y girar para cubrir.\\n5. Cocinar 1 min por cada lado.\\n6. Servir con miel, nata o fruta."}	cmpwgsr4q0009mochk1s4q6pd	cmpwiwkmn0002kh2oapp4tn8r	20	4	\N	t	2026-06-02 11:16:59.14	2026-06-02 11:16:59.14	{almuerzo,cena}
cmpwjlv9q00193omvjmxzhi50	{"en": "Basic homemade bread", "es": "Pan casero básico"}	{"en": "1. Mix flour, salt and yeast.\\n2. Add warm water and knead 10 min.\\n3. Let rest 1 hour until doubled in size.\\n4. Shape bread and let rest 30 more min.\\n5. Bake at 220°C for 30-35 min.\\n6. Let cool on a rack.", "es": "1. Mezclar harina, sal y levadura.\\n2. Añadir agua tibia y amasar 10 min.\\n3. Dejar reposar 1 hora hasta que doble su tamaño.\\n4. Formar el pan y dejar reposar 30 min más.\\n5. Hornear a 220°C durante 30-35 min.\\n6. Dejar enfriar sobre una rejilla."}	cmpwgsr4x000amochuhiv4fm6	cmpwiwkmn0002kh2oapp4tn8r	122	8	\N	t	2026-06-02 11:16:59.15	2026-06-03 08:11:17.216	{cena}
cmq6t9zrn0001uvdsijzamxv2	{"en": "Lentejas", "es": "Lentejas"}	{"en": "ssss sss", "es": "ssss sss"}	cmpwgsr260000moch0xtcss5w	cmpwiwkmn0002kh2oapp4tn8r	\N	\N	\N	f	2026-06-09 15:45:22.69	2026-06-10 11:41:10.164	{almuerzo}
cmq8067nu000buvdsibrvs4a1	{"en": "Ensalada de Quinoa", "es": "Ensalada de Quinoa"}	{"en": "1.- Lavar la Quinoa\\n2.- Poner a cocer con x3 de agua (en volumen)\\n3.- Hacer tortilla francesa\\n4.- Picar ingredientes para ensalada\\n5.- Mezclar con Quinoa y aliñar", "es": "1.- Lavar la Quinoa\\n2.- Poner a cocer con x3 de agua (en volumen)\\n3.- Hacer tortilla francesa\\n4.- Picar ingredientes para ensalada\\n5.- Mezclar con Quinoa y aliñar"}	cmpwgsr410006mochbkfjbi41	cmpwiwkmn0002kh2oapp4tn8r	\N	\N	\N	f	2026-06-10 11:46:10.081	2026-06-10 11:46:10.081	{cena}
cmq809dq8000fuvds0hbrsypo	{"en": "Trucha con ensalada", "es": "Trucha con ensalada"}	{"en": "Hacer la trucha a la plancha y preparar la ensalada.", "es": "Hacer la trucha a la plancha y preparar la ensalada."}	cmpwgsr310003moch0kwgsjpf	cmpwiwkmn0002kh2oapp4tn8r	\N	3	\N	f	2026-06-10 11:48:37.951	2026-06-10 11:48:37.951	{cena}
cmq80ajtr000huvdsl95mreme	{"en": "Garbanzos a la Italiana", "es": "Garbanzos a la Italiana"}	{"en": "Preparación", "es": "Preparación"}	cmpwgsr260000moch0xtcss5w	cmpwiwkmn0002kh2oapp4tn8r	\N	\N	\N	f	2026-06-10 11:49:32.51	2026-06-10 11:49:39.475	{almuerzo}
cmq80clfq000juvdsw9rziweq	{"en": "Tortilla francesa con Zanahorias", "es": "Tortilla francesa con Zanahorias"}	{"en": "Hacer las 3 tortillas francesas", "es": "Hacer las 3 tortillas francesas"}	cmpwgsr3e0004mochvhuf3bdi	cmpwiwkmn0002kh2oapp4tn8r	\N	3	\N	f	2026-06-10 11:51:07.909	2026-06-10 11:51:07.909	{cena}
cmq81brv4000ouvdsy0htzdz7	{"en": "Merluza en salsa verde", "es": "Merluza en salsa verde"}	{"en": "* Preparación", "es": "* Preparación"}	cmpwgsr310003moch0kwgsjpf	cmpwiwkmn0002kh2oapp4tn8r	\N	3	\N	f	2026-06-10 12:18:29.199	2026-06-10 12:18:29.199	{almuerzo,cena}
\.


--
-- Data for Name: tipo_ingredientes; Type: TABLE DATA; Schema: public; Owner: recetas
--

COPY public.tipo_ingredientes (id, nombre, slug, icono, orden) FROM stdin;
cmpwgsr5g000cmocht388jsbi	{"en": "Legumes", "es": "Legumbres"}	legumbres	🫘	1
cmpwgsr5r000dmoch56cdocrt	{"en": "Pasta & cereals", "es": "Pastas y cereales"}	pastas-cereales	🍝	2
cmpwgsr60000emochr2p4yewz	{"en": "Meats", "es": "Carnes"}	carnes	🥩	3
cmpwgsr68000fmochtsbq8234	{"en": "Fish & seafood", "es": "Pescados y mariscos"}	pescados-mariscos	🐟	4
cmpwgsr6r000gmochzos1vw87	{"en": "Vegetables", "es": "Verduras y hortalizas"}	verduras-hortalizas	🥦	5
cmpwgsr6y000hmochwde0ainz	{"en": "Fruits", "es": "Frutas"}	frutas	🍎	6
cmpwgsr76000imochdxs03z2t	{"en": "Dairy", "es": "Lácteos"}	lacteos	🥛	7
cmpwgsr7e000jmoch53lswp4f	{"en": "Spices & condiments", "es": "Especias y condimentos"}	especias-condimentos	🌶️	8
cmpwgsr7l000kmoch4hcy4ds7	{"en": "Oils & fats", "es": "Aceites y grasas"}	aceites-grasas	🫒	9
cmpwgsr7t000lmoch6dn1f7cu	{"en": "Other", "es": "Otros"}	otros	🧂	10
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: recetas
--

COPY public.usuarios (id, email, password_hash, nombre, idioma_preferido, created_at, updated_at) FROM stdin;
cmpwiwkmn0002kh2oapp4tn8r	exodous@gmail.com	$2a$10$FR8PLwTYi1LSZEQTRL6S.OPqnVs3bdoY4llic.ZQ6YiYHBdN4cfB6	Juanmilla	es	2026-06-02 10:57:18.96	2026-06-02 10:57:18.96
\.


--
-- Name: categorias categorias_pkey; Type: CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);


--
-- Name: descargas_locales descargas_locales_pkey; Type: CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.descargas_locales
    ADD CONSTRAINT descargas_locales_pkey PRIMARY KEY (id);


--
-- Name: ingredientes ingredientes_pkey; Type: CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.ingredientes
    ADD CONSTRAINT ingredientes_pkey PRIMARY KEY (id);


--
-- Name: precio_ingredientes precio_ingredientes_pkey; Type: CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.precio_ingredientes
    ADD CONSTRAINT precio_ingredientes_pkey PRIMARY KEY (id);


--
-- Name: receta_ingredientes receta_ingredientes_pkey; Type: CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.receta_ingredientes
    ADD CONSTRAINT receta_ingredientes_pkey PRIMARY KEY (receta_id, ingrediente_id);


--
-- Name: recetas recetas_pkey; Type: CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.recetas
    ADD CONSTRAINT recetas_pkey PRIMARY KEY (id);


--
-- Name: tipo_ingredientes tipo_ingredientes_pkey; Type: CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.tipo_ingredientes
    ADD CONSTRAINT tipo_ingredientes_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: categorias_slug_key; Type: INDEX; Schema: public; Owner: recetas
--

CREATE UNIQUE INDEX categorias_slug_key ON public.categorias USING btree (slug);


--
-- Name: descargas_locales_usuario_id_receta_id_key; Type: INDEX; Schema: public; Owner: recetas
--

CREATE UNIQUE INDEX descargas_locales_usuario_id_receta_id_key ON public.descargas_locales USING btree (usuario_id, receta_id);


--
-- Name: precio_ingredientes_ingrediente_id_supermercado_unidad_key; Type: INDEX; Schema: public; Owner: recetas
--

CREATE UNIQUE INDEX precio_ingredientes_ingrediente_id_supermercado_unidad_key ON public.precio_ingredientes USING btree (ingrediente_id, supermercado, unidad);


--
-- Name: tipo_ingredientes_slug_key; Type: INDEX; Schema: public; Owner: recetas
--

CREATE UNIQUE INDEX tipo_ingredientes_slug_key ON public.tipo_ingredientes USING btree (slug);


--
-- Name: usuarios_email_key; Type: INDEX; Schema: public; Owner: recetas
--

CREATE UNIQUE INDEX usuarios_email_key ON public.usuarios USING btree (email);


--
-- Name: descargas_locales descargas_locales_receta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.descargas_locales
    ADD CONSTRAINT descargas_locales_receta_id_fkey FOREIGN KEY (receta_id) REFERENCES public.recetas(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: descargas_locales descargas_locales_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.descargas_locales
    ADD CONSTRAINT descargas_locales_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: ingredientes ingredientes_creado_por_fkey; Type: FK CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.ingredientes
    ADD CONSTRAINT ingredientes_creado_por_fkey FOREIGN KEY (creado_por) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ingredientes ingredientes_tipo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.ingredientes
    ADD CONSTRAINT ingredientes_tipo_id_fkey FOREIGN KEY (tipo_id) REFERENCES public.tipo_ingredientes(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: precio_ingredientes precio_ingredientes_ingrediente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.precio_ingredientes
    ADD CONSTRAINT precio_ingredientes_ingrediente_id_fkey FOREIGN KEY (ingrediente_id) REFERENCES public.ingredientes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: receta_ingredientes receta_ingredientes_ingrediente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.receta_ingredientes
    ADD CONSTRAINT receta_ingredientes_ingrediente_id_fkey FOREIGN KEY (ingrediente_id) REFERENCES public.ingredientes(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: receta_ingredientes receta_ingredientes_receta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.receta_ingredientes
    ADD CONSTRAINT receta_ingredientes_receta_id_fkey FOREIGN KEY (receta_id) REFERENCES public.recetas(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: recetas recetas_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.recetas
    ADD CONSTRAINT recetas_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: recetas recetas_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: recetas
--

ALTER TABLE ONLY public.recetas
    ADD CONSTRAINT recetas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: recetas
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict e0GKwa7W6fapayDp8R2Mrk2uMi7PFrcZC3kAxFauxzfMlYPbEbXJvnKG5nBmG9W


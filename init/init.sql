--
-- PostgreSQL database dump
--

\restrict M860tGhG4Hd0HW9d2PryVu7Bgu6WgfRtsEhHRonhCY67LLQwW7ofkNJaHxdmaFN

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

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
-- Name: roles; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.roles AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public.roles OWNER TO nest_crud_app;

--
-- Name: update_updatedat_column(); Type: FUNCTION; Schema: public; Owner: nest_crud_app
--

CREATE FUNCTION public.update_updatedat_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW."updatedAt" = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updatedat_column() OWNER TO nest_crud_app;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: nest_crud_app
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255),
    username character varying(100),
    password character varying(100),
    "createdAt" timestamp without time zone DEFAULT now(),
    "updatedAt" timestamp without time zone DEFAULT now(),
    roles public.roles[] DEFAULT '{}'::public.roles[]
);


ALTER TABLE public.users OWNER TO nest_crud_app;

--
-- Name: users_new_id_seq; Type: SEQUENCE; Schema: public; Owner: nest_crud_app
--

CREATE SEQUENCE public.users_new_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_new_id_seq OWNER TO nest_crud_app;

--
-- Name: users_new_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nest_crud_app
--

ALTER SEQUENCE public.users_new_id_seq OWNED BY public.users.id;


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: nest_crud_app
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_new_id_seq'::regclass);


--
-- Name: users users_new_pkey; Type: CONSTRAINT; Schema: public; Owner: nest_crud_app
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_new_pkey PRIMARY KEY (id);


--
-- Name: users update_updatedat_trigger; Type: TRIGGER; Schema: public; Owner: nest_crud_app
--

CREATE TRIGGER update_updatedat_trigger BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updatedat_column();


--
-- PostgreSQL database dump complete
--

\unrestrict M860tGhG4Hd0HW9d2PryVu7Bgu6WgfRtsEhHRonhCY67LLQwW7ofkNJaHxdmaFN


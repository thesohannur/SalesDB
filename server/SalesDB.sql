--
-- PostgreSQL database cluster dump
--

-- Started on 2025-12-20 21:41:27

\restrict x9QY78XzBgcaQKcRrKGMoageASsqhgCCD15hvOIiQGHjbfHKVF5njGaIOK0ZInZ

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:ndR+vc6nLRK+w7TVS0TYXA==$JL38JfzvR4m2McYvoVw6WzXviU3Q0yPbwaEIwabSJf4=:6U2/fbwM5qFnKuRHExGiLZgSzV+cHbhzd5tsYzsa3i8=';

--
-- User Configurations
--








\unrestrict x9QY78XzBgcaQKcRrKGMoageASsqhgCCD15hvOIiQGHjbfHKVF5njGaIOK0ZInZ

--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

\restrict 38w72Ra5fiutTiiugSyBO0Sm1OIJJp6EBOuTAEd8v7KP1zT6646BzZhymCMrbV4

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-12-20 21:41:27

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

-- Completed on 2025-12-20 21:41:27

--
-- PostgreSQL database dump complete
--

\unrestrict 38w72Ra5fiutTiiugSyBO0Sm1OIJJp6EBOuTAEd8v7KP1zT6646BzZhymCMrbV4

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

\restrict SMX1z4DMGlWKVMtwec5aaxooUmoJ7EIDqSdbIRDLHNJTcRXOBqKLFKiNjvuddcG

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2025-12-20 21:41:27

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

-- Completed on 2025-12-20 21:41:27

--
-- PostgreSQL database dump complete
--

\unrestrict SMX1z4DMGlWKVMtwec5aaxooUmoJ7EIDqSdbIRDLHNJTcRXOBqKLFKiNjvuddcG

-- Completed on 2025-12-20 21:41:27

--
-- PostgreSQL database cluster dump complete
--


-- Messaging API Database Schema
-- Create database: CREATE DATABASE messaging_app


-- Create users table
-- DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id serial NOT NULL,
    username text NOT NULL UNIQUE,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    created_at date NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Index: idx_username

-- DROP INDEX IF EXISTS public.idx_username;

CREATE INDEX IF NOT EXISTS idx_username
    ON public.users USING btree
    (username COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (deduplicate_items=True)
    TABLESPACE pg_default;

-- Insert sample data in users table
INSERT INTO public.users (username, first_name, last_name, email, password) VALUES
('mat', 'matthew', 'tannous', 'matthew@mail.com', 'matpass'),
('Sir', 'john', 'paul', 'john.paul@gmail.com', 'myPASS')
ON CONFLICT DO NOTHING;

INSERT INTO public.users (username, first_name, last_name, email, password, created_at) VALUES
('helloWorld', 'elias', 'saile', 'lais@mail.mail', '123456789', '2024-10-19'),
('GOD', 'no', 'no', 'noo', 'yesss', '2025-4-13') 
ON CONFLICT DO NOTHING;

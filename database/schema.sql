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

-- Create index on username

-- DROP INDEX IF EXISTS public.idx_username;

CREATE INDEX IF NOT EXISTS idx_username
    ON public.users USING btree
    (username COLLATE pg_catalog."default" ASC NULLS LAST)
    WITH (deduplicate_items=True)
    TABLESPACE pg_default;

-- Insert sample data in users table
INSERT INTO public.users (username, first_name, last_name, email, password) VALUES
('Mat', 'Matthew', 'Tannous', 'matthewtannous@mail.com', 'WEbMat226'),
('Joe', 'john', 'paul', 'john.paul@gmail.com', 'myPASS'),
('Coder', 'paul', 'tanios', 'paultanios@gmail.com', 'paulPassVeryGood123')
ON CONFLICT DO NOTHING;

INSERT INTO public.users (username, first_name, last_name, email, password, created_at) VALUES
('WEB_DEV', 'elias', 'saile', 'lais@mail.mail', '123456789password', '2024-10-19'),
('GOD', 'Mike', 'Tanios', 'Mike.tanios@gmail.com', 'Mike13Tan!!', '2025-4-13') 
ON CONFLICT DO NOTHING;


-- Create friends table
-- DROP TABLE IF EXISTS public.friends;
CREATE TABLE public.friends
(
    id serial NOT NULL,
    date_added date NOT NULL DEFAULT now(),
    user1_id integer NOT NULL,
    user2_id integer NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (user1_id, user2_id),
    FOREIGN KEY (user1_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    FOREIGN KEY (user2_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CHECK (user1_id < user2_id)
);

-- Create index on user_ids

CREATE INDEX idx_users
    ON public.friends USING btree
    (user1_id ASC NULLS LAST, user2_id ASC NULLS LAST)
    WITH (deduplicate_items=True)
;

-- Insert sample data in friends table
INSERT INTO public.friends (date_added, user1_id, user2_id) VALUES 
('2025-8-12', 1, 2),
('2025-9-22', 1, 4),
('2025-10-22', 3, 4),
('2025-10-22', 2, 3)
ON CONFLICT DO NOTHING;

-- Create messages table
CREATE TABLE public.messages
(
    id bigserial NOT NULL,
    content text,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    sent_at timestamp with time zone NOT NULL DEFAULT NOW(),
    edited_at timestamp with time zone,
    PRIMARY KEY (id),
    CONSTRAINT sender FOREIGN KEY (sender_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT receiver FOREIGN KEY (receiver_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CHECK (sender_id <> receiver_id)
);


-- Create index on sender_id and receiver_id
CREATE INDEX idx_sender_receiver
    ON public.messages USING btree
    (receiver_id ASC NULLS LAST, sender_id ASC NULLS LAST)
    WITH (deduplicate_items=True)
;

-- Insert sample data in messages table
INSERT INTO public.messages (content, sender_id, receiver_id, sent_at, edited_at) VALUES
('hello', 2, 1, '2025-10-29 14:03:52.783405+02', '2025-10-29 14:03:52.783405+02'),
('hiii',  1, 2, '2025-10-29 14:03:55.783405+02', '2025-10-29 14:06:55.783405+02'),
('How are you', 4, 1, '2025-10-29 14:04:50.305731+02', '2025-10-29 14:04:50.305731+02'),
('I am good', 1, 4, '2025-10-29 14:05:12.610146+02', '2025-10-29 14:15:12.610146+02'),
('aloooo??', 3, 2, '2025-10-29 14:05:32.980898+02', '2025-10-29 14:05:32.980898+02'),
('where are you???', 3, 2, '2025-10-29 14:05:54.128405+02', '2025-10-29 14:05:54.128405+02'),
('suiiiiiiiii', 1, 2, '2025-10-29 14:04:28.564591+02', '2025-10-29 15:04:28.564591+02'),
('', 3, 1, '2025-10-29 14:04:28.564591+02', '2025-10-29 14:04:28.564591+02')
ON CONFLICT DO NOTHING;

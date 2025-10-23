-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.files (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  storage_path text DEFAULT ''::text,
  file_size bigint,
  mime_type text DEFAULT ''::text,
  timestamp timestamp with time zone NOT NULL,
  CONSTRAINT files_pkey PRIMARY KEY (id)
);
-- Add idempotency_key column to photo_jobs for request deduplication
-- This prevents double credit consumption when requests are accidentally sent twice

alter table public.photo_jobs
add column if not exists idempotency_key text;

-- Create index for fast lookups during deduplication check
create index if not exists idx_photo_jobs_idempotency_key
on public.photo_jobs (idempotency_key)
where idempotency_key is not null;

-- Optional: Add a unique constraint to prevent duplicates at DB level
-- Note: This is commented out because we handle this in application code
-- and want to return the existing job ID rather than error
-- alter table public.photo_jobs
-- add constraint unique_idempotency_key unique (idempotency_key);

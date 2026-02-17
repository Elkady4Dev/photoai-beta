-- Photo processing jobs: lightweight metadata only.
-- No image data is stored — images flow via Realtime Broadcast.

create table public.photo_jobs (
  id               uuid primary key default gen_random_uuid(),
  job_id           text not null unique,
  tester_token     text,
  photo_type       text not null default 'Passport',
  status           text not null default 'pending'
                   check (status in ('pending', 'processing', 'completed', 'failed', 'expired')),
  total_variations integer not null default 4,
  completed_count  integer not null default 0,
  error_message    text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  expires_at       timestamptz not null default (now() + interval '30 minutes')
);

create index idx_photo_jobs_job_id on public.photo_jobs (job_id);
create index idx_photo_jobs_status on public.photo_jobs (status);

alter table public.photo_jobs enable row level security;

-- Atomic increment of completed_count.
-- Auto-sets status to 'completed' when all variations arrive.
create or replace function public.increment_job_progress(p_job_id text)
returns table (completed_count integer, status text)
language plpgsql
security definer
as $$
declare
  v_job record;
begin
  select * into v_job
    from public.photo_jobs
   where job_id = p_job_id
   for update;

  if not found then
    return query select 0, 'not_found'::text;
    return;
  end if;

  update public.photo_jobs
     set completed_count = v_job.completed_count + 1,
         updated_at = now(),
         status = case
           when v_job.completed_count + 1 >= v_job.total_variations then 'completed'
           else 'processing'
         end
   where job_id = p_job_id;

  return query select (v_job.completed_count + 1)::integer,
    case
      when v_job.completed_count + 1 >= v_job.total_variations then 'completed'::text
      else 'processing'::text
    end;
end;
$$;

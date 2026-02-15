-- Per-tester token authentication and generation limits.
-- Each tester gets a unique token embedded in their URL (?access=<token>).
-- The edge function calls use_generation(token) on every request to authenticate,
-- check limits, and atomically increment the counter.

create table public.testers (
  id           uuid primary key default gen_random_uuid(),
  token        text not null unique,
  label        text not null default '',
  max_gens     integer not null default 5,
  used_gens    integer not null default 0,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now(),
  last_used_at timestamptz
);

create index idx_testers_token on public.testers (token);

-- RLS enabled with no policies: anon key cannot access this table.
-- Edge function uses service role key which bypasses RLS.
alter table public.testers enable row level security;

-- Atomic auth + limit check + increment.
-- Uses FOR UPDATE row lock to prevent concurrent requests from double-spending.
-- Returns: (allowed boolean, remaining integer, error_code text)
create or replace function public.use_generation(p_token text)
returns table (allowed boolean, remaining integer, error_code text)
language plpgsql
security definer
as $$
declare
  v_tester record;
begin
  select * into v_tester
    from public.testers
   where token = p_token
   for update;

  if not found then
    return query select false, 0, 'INVALID_TOKEN'::text;
    return;
  end if;

  if not v_tester.is_active then
    return query select false, 0, 'TOKEN_DISABLED'::text;
    return;
  end if;

  if v_tester.used_gens >= v_tester.max_gens then
    return query select false, 0, 'LIMIT_EXHAUSTED'::text;
    return;
  end if;

  update public.testers
     set used_gens    = used_gens + 1,
         last_used_at = now()
   where id = v_tester.id;

  return query select true, (v_tester.max_gens - v_tester.used_gens - 1)::integer, null::text;
end;
$$;

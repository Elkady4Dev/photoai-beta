-- Allow unlimited tokens by treating max_gens = -1 as "no limit".
-- The use_generation function is updated to skip the limit check when max_gens = -1.

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

  -- max_gens = -1 means unlimited; skip limit check
  if v_tester.max_gens != -1 and v_tester.used_gens >= v_tester.max_gens then
    return query select false, 0, 'LIMIT_EXHAUSTED'::text;
    return;
  end if;

  update public.testers
     set used_gens    = used_gens + 1,
         last_used_at = now()
   where id = v_tester.id;

  -- Return remaining: -1 for unlimited, otherwise calculate
  if v_tester.max_gens = -1 then
    return query select true, -1, null::text;
  else
    return query select true, (v_tester.max_gens - v_tester.used_gens - 1)::integer, null::text;
  end if;
end;
$$;

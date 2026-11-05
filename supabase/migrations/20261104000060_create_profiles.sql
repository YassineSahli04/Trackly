create table public.profiles (
    user_id uuid primary key references auth.users (id) on delete cascade,
    display_name text,
    timezone text not null default 'UTC',
    week_starts_on smallint not null default 1,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint profiles_display_name_check
        check (display_name is null or char_length(btrim(display_name)) between 1 and 100),
    constraint profiles_timezone_check
        check (char_length(btrim(timezone)) between 1 and 100),
    constraint profiles_week_starts_on_check
        check (week_starts_on between 0 and 6)
);

comment on column public.profiles.week_starts_on
    is 'Day the week starts: 0 = Sunday, 1 = Monday, ..., 6 = Saturday';

create function public.set_profile_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

revoke all on function public.set_profile_updated_at() from public;

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_profile_updated_at();

alter table public.profiles enable row level security;
alter table public.profiles force row level security;

revoke all on table public.profiles from anon, authenticated;
grant select, insert on table public.profiles to authenticated;
grant update (display_name, timezone, week_starts_on)
    on table public.profiles to authenticated;

create policy "users_manage_own_profile"
on public.profiles
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

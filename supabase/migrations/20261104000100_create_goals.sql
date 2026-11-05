create table public.goals (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    category_id uuid not null,
    title text not null,
    target_value numeric(12, 2) not null,
    unit text not null,
    frequency text not null,
    comparison text not null,
    start_date date not null default current_date,
    end_date date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint goals_title_check
        check (char_length(btrim(title)) between 1 and 200),
    constraint goals_target_value_check
        check (target_value > 0),
    constraint goals_unit_check
        check (char_length(btrim(unit)) between 1 and 50),
    constraint goals_frequency_check
        check (frequency in ('daily', 'weekly', 'monthly', 'once')),
    constraint goals_comparison_check
        check (comparison in ('at_least', 'at_most', 'exactly')),
    constraint goals_date_range_check
        check (end_date is null or end_date >= start_date),
    constraint goals_category_owner_fkey
        foreign key (category_id, user_id)
        references public.categories (id, user_id)
        on delete restrict,
    constraint goals_id_category_id_user_id_key
        unique (id, category_id, user_id)
);

create index goals_user_id_idx
    on public.goals (user_id);

create index goals_category_id_idx
    on public.goals (category_id);

create function public.set_goal_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

revoke all on function public.set_goal_updated_at() from public;

create trigger goals_set_updated_at
before update on public.goals
for each row
execute function public.set_goal_updated_at();

alter table public.goals enable row level security;
alter table public.goals force row level security;

revoke all on table public.goals from anon, authenticated;
grant select, insert, delete on table public.goals to authenticated;
grant update (category_id, title, target_value, unit, frequency, comparison, start_date, end_date)
    on table public.goals to authenticated;

create policy "users_manage_own_goals"
on public.goals
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

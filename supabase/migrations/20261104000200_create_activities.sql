create table public.activities (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    category_id uuid not null,
    goal_id uuid,
    value numeric(12, 2) not null,
    unit text not null,
    occurred_at timestamptz not null default now(),
    note text,
    created_at timestamptz not null default now(),

    constraint activities_value_check
        check (value > 0),
    constraint activities_unit_check
        check (char_length(btrim(unit)) between 1 and 50),
    constraint activities_completion_value_check
        check (lower(btrim(unit)) <> 'completion' or value = 1),
    constraint activities_note_check
        check (note is null or char_length(note) <= 2000),
    constraint activities_category_owner_fkey
        foreign key (category_id, user_id)
        references public.categories (id, user_id)
        on delete restrict,
    constraint activities_goal_owner_fkey
        foreign key (goal_id, category_id, user_id)
        references public.goals (id, category_id, user_id)
        on update cascade
        on delete set null (goal_id)
);

create function public.set_activity_fields_from_goal()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    if new.goal_id is not null then
        select goals.category_id, goals.unit
        into new.category_id, new.unit
        from public.goals as goals
        where goals.id = new.goal_id
          and goals.user_id = new.user_id;

        if not found then
            raise exception 'Goal does not exist or is not owned by the user'
                using errcode = '23503';
        end if;
    elsif new.category_id is null then
        raise exception 'A standalone activity requires a category'
            using errcode = '23502';
    elsif new.unit is null then
        raise exception 'A standalone activity requires a unit'
            using errcode = '23502';
    end if;

    return new;
end;
$$;

revoke all on function public.set_activity_fields_from_goal() from public;

create trigger activities_set_fields_from_goal
before insert or update of goal_id, user_id, category_id, unit
on public.activities
for each row
execute function public.set_activity_fields_from_goal();

create index activities_user_occurred_at_idx
    on public.activities (user_id, occurred_at desc);

create index activities_goal_id_idx
    on public.activities (goal_id)
    where goal_id is not null;

create index activities_category_id_idx
    on public.activities (category_id);

alter table public.activities enable row level security;
alter table public.activities force row level security;

revoke all on table public.activities from anon, authenticated;
grant select, insert, delete on table public.activities to authenticated;
grant update (category_id, goal_id, value, unit, occurred_at, note)
    on table public.activities to authenticated;

create policy "users_manage_own_activities"
on public.activities
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create table public.categories (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users (id) on delete cascade,
    name text not null,
    color text not null,
    created_at timestamptz not null default now(),

    constraint categories_name_check
        check (char_length(btrim(name)) between 1 and 50),
    constraint categories_color_check
        check (color ~ '^#[0-9A-Fa-f]{6}$'),
    constraint categories_id_user_id_key
        unique (id, user_id)
);

create unique index categories_user_name_key
    on public.categories (user_id, lower(name));

create index categories_user_id_idx
    on public.categories (user_id);

alter table public.categories enable row level security;
alter table public.categories force row level security;

revoke all on table public.categories from anon, authenticated;
grant select, insert, delete on table public.categories to authenticated;
grant update (name, color) on table public.categories to authenticated;

create policy "users_manage_own_categories"
on public.categories
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

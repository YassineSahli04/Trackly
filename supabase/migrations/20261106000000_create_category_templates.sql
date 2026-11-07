create table public.category_templates (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    name text not null,
    description text not null,
    color text not null,
    icon text not null,
    sort_order smallint not null default 0,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    constraint category_templates_slug_check
        check (
            char_length(slug) between 1 and 50
            and slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
        ),
    constraint category_templates_name_check
        check (char_length(btrim(name)) between 1 and 50),
    constraint category_templates_description_check
        check (char_length(btrim(description)) between 1 and 200),
    constraint category_templates_color_check
        check (color ~ '^#[0-9A-Fa-f]{6}$'),
    constraint category_templates_icon_check
        check (char_length(btrim(icon)) between 1 and 50),
    constraint category_templates_sort_order_check
        check (sort_order >= 0)
);

create index category_templates_active_sort_idx
    on public.category_templates (sort_order, name)
    where is_active;

create function public.set_category_template_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

revoke all on function public.set_category_template_updated_at() from public;

create trigger category_templates_set_updated_at
before update on public.category_templates
for each row
execute function public.set_category_template_updated_at();

alter table public.category_templates enable row level security;
alter table public.category_templates force row level security;

revoke all on table public.category_templates from public, anon, authenticated, service_role;
grant select on table public.category_templates to service_role;

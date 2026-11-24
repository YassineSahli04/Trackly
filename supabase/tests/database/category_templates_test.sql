begin;

create extension if not exists pgtap with schema extensions;
select plan(7);

select ok(
    (select relrowsecurity from pg_class where oid = 'public.category_templates'::regclass),
    'category_templates has RLS enabled'
);

select extensions.is(
    (select count(*) from public.category_templates),
    8::bigint,
    'the initial category templates exist'
);

select ok(
    not has_table_privilege('anon', 'public.category_templates', 'select'),
    'anonymous users cannot read category templates directly'
);

select ok(
    not has_table_privilege('authenticated', 'public.category_templates', 'select'),
    'authenticated users cannot read category templates directly'
);

select ok(
    not has_table_privilege('service_role', 'public.category_templates', 'select'),
    'the Supabase service role has no category template grant'
);

select ok(
    has_table_privilege('trackly_backend', 'public.category_templates', 'select'),
    'the restricted backend role can read category templates'
);

insert into public.category_templates (
    slug,
    name,
    description,
    color,
    icon,
    sort_order,
    is_active
)
values (
    'inactive-test',
    'Inactive test',
    'Template hidden from the application.',
    '#000000',
    'circle',
    999,
    false
);

create temporary table backend_template_count (
    value bigint not null
);

grant insert on backend_template_count to trackly_backend;

set local role trackly_backend;

insert into backend_template_count (value)
select count(*)
from public.category_templates;

reset role;

select is(
    (select value from backend_template_count),
    8::bigint,
    'the backend only sees active category templates'
);

select * from finish();
rollback;

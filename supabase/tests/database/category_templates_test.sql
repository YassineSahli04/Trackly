begin;

create extension if not exists pgtap with schema extensions;
select plan(5);

select ok(
    (select relrowsecurity from pg_class where oid = 'public.category_templates'::regclass),
    'category_templates has RLS enabled'
);

select is(
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
    has_table_privilege('service_role', 'public.category_templates', 'select'),
    'the backend service role can read category templates'
);

select * from finish();
rollback;

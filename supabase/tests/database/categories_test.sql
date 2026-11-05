begin;

create extension if not exists pgtap with schema extensions;
select plan(4);

insert into auth.users (id, email)
values
    ('00000000-0000-0000-0000-000000000001', 'category-user-1@test.com'),
    ('00000000-0000-0000-0000-000000000002', 'category-user-2@test.com');

insert into public.categories (user_id, name, color)
values
    ('00000000-0000-0000-0000-000000000001', 'Work', '#2563EB'),
    ('00000000-0000-0000-0000-000000000002', 'Home', '#16A34A');

select ok(
    (select relrowsecurity from pg_class where oid = 'public.categories'::regclass),
    'categories has RLS enabled'
);

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000001';

select is(
    (select count(*) from public.categories),
    1::bigint,
    'a user only sees their own categories'
);

select lives_ok(
    $$insert into public.categories (user_id, name, color)
      values ('00000000-0000-0000-0000-000000000001', 'Health', '#DC2626')$$,
    'a user can create their own category'
);

select throws_ok(
    $$insert into public.categories (user_id, name, color)
      values ('00000000-0000-0000-0000-000000000002', 'Private', '#000000')$$,
    '42501'::char(5),
    null,
    'a user cannot create a category for another user'
);

select * from finish();
rollback;

begin;

create extension if not exists pgtap with schema extensions;
select plan(3);

insert into auth.users (id, email)
values
    ('00000000-0000-0000-0000-000000000011', 'profile-user-1@test.com'),
    ('00000000-0000-0000-0000-000000000012', 'profile-user-2@test.com');

insert into public.profiles (user_id, display_name)
values
    ('00000000-0000-0000-0000-000000000011', 'User One'),
    ('00000000-0000-0000-0000-000000000012', 'User Two');

select ok(
    (select relrowsecurity from pg_class where oid = 'public.profiles'::regclass),
    'profiles has RLS enabled'
);

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000011';

select is(
    (select count(*) from public.profiles),
    1::bigint,
    'a user only sees their own profile'
);

select throws_ok(
    $$insert into public.profiles (user_id, display_name)
      values ('00000000-0000-0000-0000-000000000012', 'Impersonated')$$,
    '42501'::char(5),
    null,
    'a user cannot create a profile for another user'
);

select * from finish();
rollback;

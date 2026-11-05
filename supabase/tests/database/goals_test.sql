begin;

create extension if not exists pgtap with schema extensions;
select plan(4);

insert into auth.users (id, email)
values
    ('00000000-0000-0000-0000-000000000021', 'goal-user-1@test.com'),
    ('00000000-0000-0000-0000-000000000022', 'goal-user-2@test.com');

insert into public.categories (id, user_id, name, color)
values
    ('10000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000021', 'Learning', '#7C3AED'),
    ('10000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000022', 'Work', '#2563EB');

insert into public.goals (user_id, category_id, title, target_value, unit, frequency, comparison)
values
    ('00000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000021', 'Read', 10, 'pages', 'daily', 'at_least'),
    ('00000000-0000-0000-0000-000000000022', '10000000-0000-0000-0000-000000000022', 'Work', 2, 'hours', 'daily', 'at_least');

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000021';

select is(
    (select count(*) from public.goals),
    1::bigint,
    'a user only sees their own goals'
);

select lives_ok(
    $$insert into public.goals
      (user_id, category_id, title, target_value, unit, frequency, comparison)
      values
      ('00000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000021', 'Study', 6, 'hours', 'weekly', 'at_least')$$,
    'a user can create a goal in their own category'
);

select throws_ok(
    $$insert into public.goals
      (user_id, category_id, title, target_value, unit, frequency, comparison)
      values
      ('00000000-0000-0000-0000-000000000021', '10000000-0000-0000-0000-000000000022', 'Invalid', 1, 'hours', 'daily', 'at_least')$$,
    '23503'::char(5),
    null,
    'a user cannot link a goal to another user category'
);

select throws_ok(
    $$insert into public.goals
      (user_id, category_id, title, target_value, unit, frequency, comparison)
      values
      ('00000000-0000-0000-0000-000000000022', '10000000-0000-0000-0000-000000000022', 'Impersonated', 1, 'hours', 'daily', 'at_least')$$,
    '42501'::char(5),
    null,
    'a user cannot create a goal for another user'
);

select * from finish();
rollback;

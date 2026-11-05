begin;

create extension if not exists pgtap with schema extensions;
select plan(7);

insert into auth.users (id, email)
values
    ('00000000-0000-0000-0000-000000000031', 'activity-user-1@test.com'),
    ('00000000-0000-0000-0000-000000000032', 'activity-user-2@test.com');

insert into public.categories (id, user_id, name, color)
values
    ('10000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000031', 'Learning', '#7C3AED'),
    ('10000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000032', 'Work', '#2563EB');

insert into public.goals (id, user_id, category_id, title, target_value, unit, frequency, comparison)
values
    ('20000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000031', 'Study', 6, 'hours', 'weekly', 'at_least'),
    ('20000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000032', '10000000-0000-0000-0000-000000000032', 'Work', 2, 'hours', 'daily', 'at_least');

insert into public.activities (user_id, category_id, value, unit, note)
values
    ('00000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000031', 1, 'completion', 'user-one-existing'),
    ('00000000-0000-0000-0000-000000000032', '10000000-0000-0000-0000-000000000032', 1, 'completion', 'user-two-existing');

set local role authenticated;
set local request.jwt.claim.sub = '00000000-0000-0000-0000-000000000031';

select is(
    (select count(*) from public.activities),
    1::bigint,
    'a user only sees their own activities'
);

select lives_ok(
    $$insert into public.activities (user_id, goal_id, value, note)
      values ('00000000-0000-0000-0000-000000000031', '20000000-0000-0000-0000-000000000031', 2, 'inherited')$$,
    'a linked activity inherits fields from its goal'
);

select is(
    (select category_id from public.activities where note = 'inherited'),
    '10000000-0000-0000-0000-000000000031'::uuid,
    'a linked activity inherits its goal category'
);

select is(
    (select unit from public.activities where note = 'inherited'),
    'hours'::text,
    'a linked activity inherits its goal unit'
);

select throws_ok(
    $$insert into public.activities (user_id, value, note)
      values ('00000000-0000-0000-0000-000000000031', 1, 'missing-fields')$$,
    '23502'::char(5),
    null,
    'a standalone activity requires a category and unit'
);

select throws_ok(
    $$insert into public.activities (user_id, category_id, value, unit, note)
      values ('00000000-0000-0000-0000-000000000031', '10000000-0000-0000-0000-000000000031', 2, 'completion', 'invalid-completion')$$,
    '23514'::char(5),
    null,
    'a completion activity must have value one'
);

select throws_ok(
    $$insert into public.activities (user_id, goal_id, value, note)
      values ('00000000-0000-0000-0000-000000000031', '20000000-0000-0000-0000-000000000032', 1, 'foreign-goal')$$,
    '23503'::char(5),
    null,
    'a user cannot link an activity to another user goal'
);

select * from finish();
rollback;

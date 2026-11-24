do $$
begin
    if not exists (
        select 1
        from pg_roles
        where rolname = 'trackly_backend'
    ) then
        create role trackly_backend
            nologin
            nosuperuser
            nocreatedb
            nocreaterole
            noreplication
            nobypassrls;
    end if;
end;
$$;

grant connect on database postgres to trackly_backend;
grant usage on schema public to trackly_backend;

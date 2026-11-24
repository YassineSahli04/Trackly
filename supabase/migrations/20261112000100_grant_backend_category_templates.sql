revoke all on table public.category_templates from service_role;
grant select on table public.category_templates to trackly_backend;

create policy "backend_reads_active_category_templates"
on public.category_templates
for select
to trackly_backend
using (is_active);

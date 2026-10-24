-- Permisos del rol de servicio. El proyecto se creó sin exponer tablas automáticamente, así
-- que ningún rol recibe privilegios por defecto: los visitantes y gestores los tienen tabla
-- por tabla en las migraciones anteriores, pero el rol de servicio (el que usa el scraper, que
-- salta las políticas RLS) no tenía ninguno y no podía ni leer ni escribir.

grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;

-- Y lo mismo para lo que se cree a partir de ahora con migraciones (las ejecuta postgres).
alter default privileges for role postgres in schema public grant all on tables to service_role;
alter default privileges for role postgres in schema public grant all on sequences to service_role;
alter default privileges for role postgres in schema public grant execute on functions to service_role;

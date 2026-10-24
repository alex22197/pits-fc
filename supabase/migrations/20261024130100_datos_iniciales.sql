-- Datos iniciales de la temporada 2026-2027, tomados de la intranet de la federación el
-- 23-10-2026: competición, los 13 equipos del grupo, las 26 jornadas con sus fechas y los
-- emparejamientos del calendario. Fechas, horas, campos y marcadores los mantiene el scraper.

-- Devuelve el id de un equipo por su nombre en la federación. La usa esta migración y el
-- scraper. Falla si el nombre no existe: mejor eso que insertar basura.
create function public.id_equipo(nombre_en_federacion text)
returns uuid
language sql
stable
set search_path = ''
as $$
  select e.id from public.equipo e where e.nombre_federacion = id_equipo.nombre_en_federacion;
$$;

insert into public.competicion (nombre, temporada, grupo, cod_competicion, cod_grupo, cod_temporada)
values ('Ayto. Alcobendas Fútbol 7', '2026-2027', '2ª Aficionados G2', '339610', '339627', '22');

insert into public.equipo (nombre, nombre_federacion, cod_equipo, es_nuestro) values
  ('PITS FC',            'PITS',               '326330', true),
  ('C.D. Montejo',       'C.D. MONTEJO',       '305516', false),
  ('Pride of Sparta',    'PRIDE OF SPARTA',    '303862', false),
  ('Drink Team F.C.',    'DRINK TEAM F.C.',    '310096', false),
  ('MMCHC FC',           'MMCHC FC',           '303948', false),
  ('Perfumería Óscar',   'PERFUMERIA OSCAR',   '303903', false),
  ('Pin Pals',           'PIN PALS',           '313659', false),
  ('La Ganga C.F.',      'LA GANGA C.F.',      '313651', false),
  ('S.S.C. Carbonara',   'S.S.C. CARBONARA',   '318610', false),
  ('Reptilians F.C.',    'REPTILIANS F.C.',    '303869', false),
  ('Vergosos C.F.',      'VERGOSOS C.F',       '333237', false),
  ('Hathor C.F.',        'HATHOR C.F',         '303906', false),
  ('Frenahaybache F.C.', 'FRENAHAYBACHE F.C.', '303912', false);

-- Las 26 jornadas. La segunda vuelta repite el orden de la primera con los campos cambiados.
with competicion as (
  select id from public.competicion where temporada = '2026-2027' and grupo = '2ª Aficionados G2'
),
jornadas (numero, fecha, descansa) as (
  values
    (1,  date '2026-10-02', 'DRINK TEAM F.C.'),
    (2,  date '2026-10-16', 'FRENAHAYBACHE F.C.'),
    (3,  date '2026-10-23', 'HATHOR C.F'),
    (4,  date '2026-11-06', 'LA GANGA C.F.'),
    (5,  date '2026-11-13', 'MMCHC FC'),
    (6,  date '2026-11-20', 'PERFUMERIA OSCAR'),
    (7,  date '2026-11-27', 'PIN PALS'),
    (8,  date '2026-12-11', 'PITS'),
    (9,  date '2026-12-18', 'PRIDE OF SPARTA'),
    (10, date '2027-01-08', 'REPTILIANS F.C.'),
    (11, date '2027-01-15', 'S.S.C. CARBONARA'),
    (12, date '2027-01-22', 'VERGOSOS C.F'),
    (13, date '2027-01-29', 'C.D. MONTEJO'),
    (14, date '2027-02-05', 'DRINK TEAM F.C.'),
    (15, date '2027-02-19', 'FRENAHAYBACHE F.C.'),
    (16, date '2027-02-26', 'HATHOR C.F'),
    (17, date '2027-03-05', 'LA GANGA C.F.'),
    (18, date '2027-03-12', 'MMCHC FC'),
    (19, date '2027-04-02', 'PERFUMERIA OSCAR'),
    (20, date '2027-04-09', 'PIN PALS'),
    (21, date '2027-04-16', 'PITS'),
    (22, date '2027-04-23', 'PRIDE OF SPARTA'),
    (23, date '2027-05-07', 'REPTILIANS F.C.'),
    (24, date '2027-05-14', 'S.S.C. CARBONARA'),
    (25, date '2027-05-21', 'VERGOSOS C.F'),
    (26, date '2027-05-28', 'C.D. MONTEJO')
)
insert into public.jornada (competicion_id, numero, vuelta, fecha_prevista, descansa_id)
select competicion.id, numero, case when numero <= 13 then 1 else 2 end, fecha, public.id_equipo(descansa)
from jornadas, competicion;

-- Emparejamientos de la primera vuelta (local, visitante). La segunda vuelta se genera
-- invirtiéndolos, como hace el calendario oficial.
with emparejamientos (jornada, local, visitante) as (
  values
    (1,  'C.D. MONTEJO',       'FRENAHAYBACHE F.C.'),
    (1,  'S.S.C. CARBONARA',   'LA GANGA C.F.'),
    (1,  'PRIDE OF SPARTA',    'PERFUMERIA OSCAR'),
    (1,  'MMCHC FC',           'REPTILIANS F.C.'),
    (1,  'HATHOR C.F',         'VERGOSOS C.F'),
    (1,  'PIN PALS',           'PITS'),
    (2,  'PERFUMERIA OSCAR',   'S.S.C. CARBONARA'),
    (2,  'PITS',               'PRIDE OF SPARTA'),
    (2,  'LA GANGA C.F.',      'C.D. MONTEJO'),
    (2,  'REPTILIANS F.C.',    'PIN PALS'),
    (2,  'VERGOSOS C.F',       'MMCHC FC'),
    (2,  'DRINK TEAM F.C.',    'HATHOR C.F'),
    (3,  'PRIDE OF SPARTA',    'REPTILIANS F.C.'),
    (3,  'C.D. MONTEJO',       'PERFUMERIA OSCAR'),
    (3,  'S.S.C. CARBONARA',   'PITS'),
    (3,  'FRENAHAYBACHE F.C.', 'LA GANGA C.F.'),
    (3,  'PIN PALS',           'VERGOSOS C.F'),
    (3,  'MMCHC FC',           'DRINK TEAM F.C.'),
    (4,  'REPTILIANS F.C.',    'S.S.C. CARBONARA'),
    (4,  'DRINK TEAM F.C.',    'PIN PALS'),
    (4,  'PERFUMERIA OSCAR',   'FRENAHAYBACHE F.C.'),
    (4,  'HATHOR C.F',         'MMCHC FC'),
    (4,  'PITS',               'C.D. MONTEJO'),
    (4,  'VERGOSOS C.F',       'PRIDE OF SPARTA'),
    (5,  'FRENAHAYBACHE F.C.', 'PITS'),
    (5,  'PRIDE OF SPARTA',    'DRINK TEAM F.C.'),
    (5,  'C.D. MONTEJO',       'REPTILIANS F.C.'),
    (5,  'S.S.C. CARBONARA',   'VERGOSOS C.F'),
    (5,  'LA GANGA C.F.',      'PERFUMERIA OSCAR'),
    (5,  'PIN PALS',           'HATHOR C.F'),
    (6,  'VERGOSOS C.F',       'C.D. MONTEJO'),
    (6,  'HATHOR C.F',         'PRIDE OF SPARTA'),
    (6,  'PITS',               'LA GANGA C.F.'),
    (6,  'DRINK TEAM F.C.',    'S.S.C. CARBONARA'),
    (6,  'REPTILIANS F.C.',    'FRENAHAYBACHE F.C.'),
    (6,  'MMCHC FC',           'PIN PALS'),
    (7,  'PERFUMERIA OSCAR',   'PITS'),
    (7,  'LA GANGA C.F.',      'REPTILIANS F.C.'),
    (7,  'FRENAHAYBACHE F.C.', 'VERGOSOS C.F'),
    (7,  'PRIDE OF SPARTA',    'MMCHC FC'),
    (7,  'C.D. MONTEJO',       'DRINK TEAM F.C.'),
    (7,  'S.S.C. CARBONARA',   'HATHOR C.F'),
    (8,  'HATHOR C.F',         'C.D. MONTEJO'),
    (8,  'MMCHC FC',           'S.S.C. CARBONARA'),
    (8,  'VERGOSOS C.F',       'LA GANGA C.F.'),
    (8,  'PIN PALS',           'PRIDE OF SPARTA'),
    (8,  'REPTILIANS F.C.',    'PERFUMERIA OSCAR'),
    (8,  'DRINK TEAM F.C.',    'FRENAHAYBACHE F.C.'),
    (9,  'PERFUMERIA OSCAR',   'VERGOSOS C.F'),
    (9,  'C.D. MONTEJO',       'MMCHC FC'),
    (9,  'PITS',               'REPTILIANS F.C.'),
    (9,  'FRENAHAYBACHE F.C.', 'HATHOR C.F'),
    (9,  'LA GANGA C.F.',      'DRINK TEAM F.C.'),
    (9,  'S.S.C. CARBONARA',   'PIN PALS'),
    (10, 'HATHOR C.F',         'LA GANGA C.F.'),
    (10, 'PRIDE OF SPARTA',    'S.S.C. CARBONARA'),
    (10, 'DRINK TEAM F.C.',    'PERFUMERIA OSCAR'),
    (10, 'PIN PALS',           'C.D. MONTEJO'),
    (10, 'VERGOSOS C.F',       'PITS'),
    (10, 'MMCHC FC',           'FRENAHAYBACHE F.C.'),
    (11, 'REPTILIANS F.C.',    'VERGOSOS C.F'),
    (11, 'PITS',               'DRINK TEAM F.C.'),
    (11, 'LA GANGA C.F.',      'MMCHC FC'),
    (11, 'FRENAHAYBACHE F.C.', 'PIN PALS'),
    (11, 'PERFUMERIA OSCAR',   'HATHOR C.F'),
    (11, 'C.D. MONTEJO',       'PRIDE OF SPARTA'),
    (12, 'HATHOR C.F',         'PITS'),
    (12, 'PIN PALS',           'LA GANGA C.F.'),
    (12, 'DRINK TEAM F.C.',    'REPTILIANS F.C.'),
    (12, 'MMCHC FC',           'PERFUMERIA OSCAR'),
    (12, 'PRIDE OF SPARTA',    'FRENAHAYBACHE F.C.'),
    (12, 'S.S.C. CARBONARA',   'C.D. MONTEJO'),
    (13, 'PERFUMERIA OSCAR',   'PIN PALS'),
    (13, 'FRENAHAYBACHE F.C.', 'S.S.C. CARBONARA'),
    (13, 'VERGOSOS C.F',       'DRINK TEAM F.C.'),
    (13, 'LA GANGA C.F.',      'PRIDE OF SPARTA'),
    (13, 'REPTILIANS F.C.',    'HATHOR C.F'),
    (13, 'PITS',               'MMCHC FC')
),
ambas_vueltas as (
  select jornada, local, visitante from emparejamientos
  union all
  select jornada + 13, visitante, local from emparejamientos
)
insert into public.partido (jornada_id, local_id, visitante_id)
select j.id, public.id_equipo(a.local), public.id_equipo(a.visitante)
from ambas_vueltas a
join public.jornada j on j.numero = a.jornada;

-- Resultados conocidos al 23-10-2026 (la federación los confirma en la primera importación).
update public.partido set estado = 'jugado', goles_local = 4, goles_visitante = 0
  where jornada_id = (select id from public.jornada where numero = 1)
    and local_id = public.id_equipo('C.D. MONTEJO');
update public.partido set estado = 'jugado', goles_local = 3, goles_visitante = 3
  where jornada_id = (select id from public.jornada where numero = 1)
    and local_id = public.id_equipo('S.S.C. CARBONARA');
update public.partido set estado = 'jugado', goles_local = 5, goles_visitante = 4
  where jornada_id = (select id from public.jornada where numero = 1)
    and local_id = public.id_equipo('PRIDE OF SPARTA');

update public.partido set estado = 'jugado', goles_local = 5, goles_visitante = 3,
  fecha_hora = timestamptz '2026-10-16 20:00 Europe/Madrid', campo = 'Pvo. José Caballero, campo 2'
  where jornada_id = (select id from public.jornada where numero = 2)
    and local_id = public.id_equipo('PERFUMERIA OSCAR');
update public.partido set estado = 'jugado', goles_local = 3, goles_visitante = 3,
  fecha_hora = timestamptz '2026-10-16 21:00 Europe/Madrid', campo = 'Pvo. José Caballero, campo 2'
  where jornada_id = (select id from public.jornada where numero = 2)
    and local_id = public.id_equipo('PITS');
update public.partido set estado = 'jugado', goles_local = 3, goles_visitante = 4,
  fecha_hora = timestamptz '2026-10-16 22:00 Europe/Madrid', campo = 'Pvo. José Caballero, campo 2'
  where jornada_id = (select id from public.jornada where numero = 2)
    and local_id = public.id_equipo('LA GANGA C.F.');
update public.partido set estado = 'jugado', goles_local = 3, goles_visitante = 4,
  fecha_hora = timestamptz '2026-10-19 22:00 Europe/Madrid', campo = 'Navarra 1-1'
  where jornada_id = (select id from public.jornada where numero = 2)
    and local_id = public.id_equipo('REPTILIANS F.C.');
update public.partido set estado = 'jugado', goles_local = 3, goles_visitante = 5,
  fecha_hora = timestamptz '2026-10-19 22:00 Europe/Madrid', campo = 'Navarra 1-2'
  where jornada_id = (select id from public.jornada where numero = 2)
    and local_id = public.id_equipo('VERGOSOS C.F');
update public.partido set estado = 'jugado', goles_local = 5, goles_visitante = 1,
  fecha_hora = timestamptz '2026-10-21 22:00 Europe/Madrid', campo = 'Navarra 1-2'
  where jornada_id = (select id from public.jornada where numero = 2)
    and local_id = public.id_equipo('DRINK TEAM F.C.');

-- Jornada 3: fechas, horas y campos ya publicados.
update public.partido set fecha_hora = timestamptz '2026-10-23 20:00 Europe/Madrid', campo = 'Pvo. José Caballero, campo 2'
  where jornada_id = (select id from public.jornada where numero = 3) and local_id = public.id_equipo('PRIDE OF SPARTA');
update public.partido set fecha_hora = timestamptz '2026-10-23 21:00 Europe/Madrid', campo = 'Pvo. José Caballero, campo 2'
  where jornada_id = (select id from public.jornada where numero = 3) and local_id = public.id_equipo('C.D. MONTEJO');
update public.partido set fecha_hora = timestamptz '2026-10-23 22:00 Europe/Madrid', campo = 'Pvo. José Caballero, campo 2'
  where jornada_id = (select id from public.jornada where numero = 3) and local_id = public.id_equipo('S.S.C. CARBONARA');
update public.partido set fecha_hora = timestamptz '2026-10-26 21:00 Europe/Madrid', campo = 'Navarra 1-1'
  where jornada_id = (select id from public.jornada where numero = 3) and local_id = public.id_equipo('FRENAHAYBACHE F.C.');
update public.partido set fecha_hora = timestamptz '2026-10-26 22:00 Europe/Madrid', campo = 'Navarra 1-1'
  where jornada_id = (select id from public.jornada where numero = 3) and local_id = public.id_equipo('PIN PALS');
update public.partido set fecha_hora = timestamptz '2026-10-26 22:00 Europe/Madrid', campo = 'Navarra 1-2'
  where jornada_id = (select id from public.jornada where numero = 3) and local_id = public.id_equipo('MMCHC FC');

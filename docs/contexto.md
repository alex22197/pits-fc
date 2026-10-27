# Contexto del proyecto

Todo lo que se sabe del equipo, de la liga y de cómo se trabaja, recogido de las
conversaciones en las que se diseñó el proyecto (octubre de 2026). Léelo antes de proponer
cambios. El repositorio es público: aquí no van nombres completos ni datos de contacto.

## Quién lo usa

- **Autor y administrador**: Alex (cuenta de GitHub `alex22197`). **No pertenece al equipo**:
  hace la web para ellos. Programa en **Angular**; tiene otro proyecto parecido,
  `ctp-valdelasfuentes` (equipo de pádel), del que este hereda la estructura y las
  convenciones. Las pantallas de gestión las prueban y usan los gestores del equipo, por lo
  que tienen que ser autoexplicativas y poder invitarse desde la propia web.
- **Jugadores y cuerpo técnico**: consultan la web desde el móvil, sin cuenta. La
  comunicación del equipo va por **WhatsApp**, así que los enlaces se comparten por ahí.
- **Gestores**: quien publica las convocatorias y revisa los datos. Entran con Google y el
  administrador les da el rol (ADR 0002).
- **Presupuesto: 0 €.** Todo debe funcionar en planes gratuitos.

## El equipo y la liga

- Equipo: **PITS FC**. En la federación es el club 615 «PITS F.C» y en la liga aparece como
  **PITS**. Escudo: gorila y estrellas en salmón sobre negro (ver [`diseno.md`](diseno.md)).
- Competición: **Ayto. Alcobendas Fútbol 7**, temporada **2026-2027**, grupo
  **2ª Aficionados G2**, organizada por la delegación de Alcobendas de la Real Federación de
  Fútbol de Madrid (RFFM).
- 13 equipos, liga a doble vuelta: **26 jornadas**, una por semana, del 2 de octubre de 2026
  al 28 de mayo de 2027, con un equipo que descansa cada jornada.
- Los partidos se juegan entre semana por la noche (viernes, lunes o miércoles, de 20:00 a
  22:00) en campos municipales de hierba artificial: Pvo. José Caballero y Navarra.
- Rivales: C.D. Montejo, Pride of Sparta, Drink Team F.C., MMCHC FC, Perfumería Óscar,
  Pin Pals, La Ganga C.F., S.S.C. Carbonara, Reptilians F.C., Vergosos C.F., Hathor C.F y
  Frenahaybache F.C.
- Plantilla: 14 jugadores con licencia en la federación. Los nombres que se muestran en
  público los decide Alex (nombre corto o apodo).
- Aparte de la liga, la delegación organiza un «Torneo de la Hispanidad». No está decidido
  si se incluirá: el modelo de datos admite varias competiciones por si acaso.

## De dónde salen los datos

La liga no tiene web pública: calendario, resultados, clasificación, goleadores y actas solo
están en la **intranet de la federación** (`alcobendas.ffmadrid.es`), con el usuario del
club. La web pública de la RFFM solo publica competiciones de la propia federación y las
locales de Leganés; se comprobó el 23-10-2026.

Un **scraper** semanal entra en la intranet con las credenciales del club, guardadas como
secretos de Supabase, y guarda en la base de datos (ADR 0003, [`scraper.md`](scraper.md)):

- Calendario completo y marcadores.
- Clasificación del grupo.
- Goleadores del grupo.
- Actas de nuestros partidos: titulares con dorsal, suplentes, goles con minuto y autor,
  tarjetas con minuto, árbitro y campo.

Lo que la federación **no** tiene y meten los gestores a mano:

- **Alineación**: quién va a cada partido y cómo salen: los siete titulares colocados en la
  pizarra en un 1-2-3-1 (portero, dos centrales, lateral izquierdo, medio, lateral derecho y
  delantero), el banquillo, las dudas y quienes no van. La disponibilidad se sigue preguntando
  por WhatsApp; la web solo publica la alineación final.
- Nombres cortos, dorsal y posición de cada jugador.

Las actas de esta liga no registran sustituciones, así que **no se pueden calcular minutos
por jugador**. Se tienen partidos jugados, titular o suplente, goles y tarjetas.

## Decisiones de producto

- **Web pública** para consultar; **login con Google** solo para gestionar (ADR 0002).
- **Privacidad** (ADR 0004): en público, nombres cortos de nuestros jugadores y ningún nombre
  de rivales ni árbitros; los nombres completos de las actas solo los ven los gestores, en
  una tabla aparte. Antes de publicar la web se avisará al equipo.
- **Datos propios por ahora: solo convocatorias.** Disponibilidad en la web, entrenamientos,
  cuotas y multas se descartaron para empezar; el modelo permite añadirlos.
- **Estadísticas**: partidos, titularidades, goles, tarjetas y goles encajados; con gráficas
  interactivas (Apache ECharts) cuando haya datos de varias jornadas.
- **Tema oscuro fijo** con los colores del escudo (ADR 0006).

## Preferencias de Alex sobre el código

Recogidas en [`AGENTS.md`](../AGENTS.md). Lo esencial: proyecto muy organizado y bien
componetizado, sin componentes enormes; interfaces y tipos siempre en ficheros propios;
nombres de fichero descriptivos; todo en castellano salvo los términos técnicos; textos de
interfaz en castellano.

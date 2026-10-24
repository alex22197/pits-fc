import type { CodigosCompeticion } from '../interfaces/codigos-competicion.interface.ts';

/** Rutas de la intranet de la delegación. Los parámetros se documentan en docs/scraper.md. */
const PRIMARIA = '1000128';
const DELEGACION = '40032';

export function urlLogin(): string {
  return '/nfg/NLogin';
}

export function urlCalendario(codigos: CodigosCompeticion): string {
  return (
    '/nfg/NPcd/NFG_VisCalendario_Vis?' +
    new URLSearchParams({
      cod_primaria: PRIMARIA,
      codtemporada: codigos.temporada,
      codcompeticion: codigos.competicion,
      codgrupo: codigos.grupo,
      CodJornada: '1',
    })
  );
}

export function urlJornada(codigos: CodigosCompeticion, jornada: number): string {
  return (
    '/nfg/NPcd/NFG_CmpJornada?' +
    new URLSearchParams({
      cod_primaria: PRIMARIA,
      CodCompeticion: codigos.competicion,
      CodGrupo: codigos.grupo,
      CodTemporada: codigos.temporada,
      CodJornada: String(jornada),
      cod_agrupacion: '',
      Sch_Codigo_Delegacion: DELEGACION,
      Sch_Tipo_Juego: '',
    })
  );
}

export function urlClasificacion(codigos: CodigosCompeticion, jornada: number): string {
  return (
    '/nfg/NPcd/NFG_VisClasificacion?' +
    new URLSearchParams({
      cod_primaria: PRIMARIA,
      codjornada: String(jornada),
      codcompeticion: codigos.competicion,
      codgrupo: codigos.grupo,
    })
  );
}

export function urlActa(codActa: string): string {
  return (
    '/nfg/NPcd/NFG_CmpPartido?' +
    new URLSearchParams({ cod_primaria: PRIMARIA, CodActa: codActa, cod_acta: codActa })
  );
}

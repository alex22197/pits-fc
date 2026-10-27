import { assertEquals } from '@std/assert';
import { analizarActa } from './analizar-acta.ts';

// Estructura real del acta de la intranet, con nombres inventados.
function jugadores(lista: [number, string][]): string {
  return lista
    .map(
      ([dorsal, nombre]) =>
        `<tr><td width="1%" class="textosm">&nbsp;&nbsp;${dorsal}&nbsp;</td><td class="textosm"><p style="margin:0;">&nbsp;${nombre}</p></td></tr>`,
    )
    .join('');
}

function tarjetas(lista: [string, string, number][]): string {
  return lista
    .map(
      ([tipo, nombre, minuto]) =>
        `<tr><td width="10%" class="title"><img src="/nfg/img/NFG/ESP/tarj_${tipo}.gif" width="8" height="11"></td><td width="90%" class="textosm"><p style="margin:0;">${nombre} (${minuto}')</p></td></tr>`,
    )
    .join('');
}

function columna(nombre: string, titulares: string, suplentes: string, cartulinas: string): string {
  return `<td width="34%" align="center" valign="top">
    <center><span class="tituloprograma"> ${nombre} </span></center><br>
    <span class="title" align="left">Titulares:</span>
    <table width="100%" class="tabla_rdg"><tbody>${titulares}</tbody></table><br>
    <span class="title">Suplentes:</span>
    <table width="100%" class="tabla_rdg"><tbody>${suplentes}</tbody></table><br>
    <p align="center"><span class="title"> CUERPO TÉCNICO</span></p><table class="tabla_rdg"><tbody><tr><td>No presenta</td></tr></tbody></table>
    <p align="center"><span class="title">SUSTITUCIONES</span></p><table></table><br>
    <center><span class="title">TARJETAS</span></center><br>
    <table border="0" width="100%" class="tabla_rdg"><tbody>${cartulinas}</tbody></table>
  </td>`;
}

function gol(marcador: string, nombre: string, minuto: number): string {
  return `<tr><td align="left" class="tit4" nowrap="">&nbsp; &nbsp;<a class="img lgol no_print" title="Gol normal">&nbsp;</a>&nbsp;&nbsp; ${marcador}&nbsp; </td><td class="textosm">&nbsp; ${nombre} (${minuto}') </td></tr>`;
}

const HTML = `<html><body><table class="tabla_rdg"><tbody><tr><td>
  <table><tbody><tr>
    <td><span class="subtitulos">&nbsp;Fecha:</span>&nbsp;&nbsp;16-10-2026&nbsp;&nbsp;<span class="subtitulos">Hora:</span>&nbsp;&nbsp;21:00 h</td>
    <td align="right"><span class="title">AYTO. ALCOBENDAS FUTBOL 7 (2ª AFICIONADOS G2 )</span> <span class="title">Jornada 2&nbsp;&nbsp;</span></td>
  </tr></tbody></table>
  <table class="tabla_rdg"><tbody><tr>
    ${
  columna(
    'PITS',
    jugadores([[29, 'APELLIDO UNO, ALEJANDRO'], [8, 'APELLIDO DOS, RAUL'], [
      10,
      'APELLIDO TRES, CARLOS',
    ]]),
    '',
    tarjetas([['amar', 'APELLIDO UNO, ALEJANDRO', 18], ['roja', 'APELLIDO DOS, RAUL', 60]]),
  )
}
    <td width="33%" align="center" valign="top">
      <table><tbody><tr align="center"><td><img src="escudo.jpg"></td><td><span class="IMPRIMIR_TITULO_CABECERA">3</span></td><td><span class="IMPRIMIR_TITULO_CABECERA">-</span></td><td><span class="IMPRIMIR_TITULO_CABECERA"> 3</span></td><td><img src="escudo.jpg"></td></tr></tbody></table>
      <table class="tabla_rdg"><tbody><tr><td class="title">ÁRBITROS</td></tr><tr><td class="subtitulos"> : </td><td class="textosm"> COLEGIADO, PERSONA </td></tr></tbody></table>
      <center><span class="title">GOLES</span></center>
      <table><tbody>
        ${gol('1 - 0', 'APELLIDO TRES, CARLOS', 24)}
        ${gol('1 - 1', 'RIVAL UNO, PABLO', 28)}
        ${gol('2 - 1', 'APELLIDO DOS, RAUL', 47)}
        ${gol('2 - 2', 'RIVAL DOS, JAIME', 50)}
        <tr><td height="10"></td></tr>
      </tbody></table>
      <table><tbody><tr><td align="center"><br><span class="subtitulos">ESTADIO:</span> PVO. JOSE CABALLERO CAMPO 2 - 2 </td></tr><tr><td align="center"><span class="subtitulos">Ciudad:</span> Alcobendas</td></tr></tbody></table>
    </td>
    ${
  columna(
    'PRIDE OF SPARTA',
    jugadores([[1, 'RIVAL CERO, ENRIQUE'], [27, 'RIVAL UNO, PABLO']]),
    jugadores([[15, 'RIVAL TRES, LUIS']]),
    '',
  )
}
  </tr></tbody></table>
</td></tr></tbody></table></body></html>`;

Deno.test('analizarActa lee cabecera, marcador y campo', () => {
  const acta = analizarActa(HTML);
  assertEquals(acta.fecha, '2026-10-16');
  assertEquals(acta.hora, '21:00');
  assertEquals(acta.golesLocal, 3);
  assertEquals(acta.golesVisitante, 3);
  assertEquals(acta.campo, 'PVO. JOSE CABALLERO CAMPO 2 - 2');
});

Deno.test('analizarActa lee titulares, suplentes y tarjetas de cada equipo', () => {
  const acta = analizarActa(HTML);
  assertEquals(acta.local.nombre, 'PITS');
  assertEquals(acta.local.titulares, [
    { dorsal: 29, nombre: 'APELLIDO UNO, ALEJANDRO' },
    { dorsal: 8, nombre: 'APELLIDO DOS, RAUL' },
    { dorsal: 10, nombre: 'APELLIDO TRES, CARLOS' },
  ]);
  assertEquals(acta.local.suplentes, []);
  assertEquals(acta.local.tarjetas, [
    { nombre: 'APELLIDO UNO, ALEJANDRO', tipo: 'amarilla', minuto: 18 },
    { nombre: 'APELLIDO DOS, RAUL', tipo: 'roja', minuto: 60 },
  ]);
  assertEquals(acta.visitante.nombre, 'PRIDE OF SPARTA');
  assertEquals(acta.visitante.suplentes, [{ dorsal: 15, nombre: 'RIVAL TRES, LUIS' }]);
  assertEquals(acta.visitante.tarjetas, []);
});

Deno.test('analizarActa lee los goles en orden de marcador', () => {
  const acta = analizarActa(HTML);
  assertEquals(acta.goles.length, 4);
  assertEquals(acta.goles[0], {
    marcadorLocal: 1,
    marcadorVisitante: 0,
    nombre: 'APELLIDO TRES, CARLOS',
    minuto: 24,
  });
  assertEquals(acta.goles[3], {
    marcadorLocal: 2,
    marcadorVisitante: 2,
    nombre: 'RIVAL DOS, JAIME',
    minuto: 50,
  });
});

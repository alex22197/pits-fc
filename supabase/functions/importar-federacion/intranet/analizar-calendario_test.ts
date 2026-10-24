import { assertEquals, assertThrows } from '@std/assert';
import { analizarCalendario } from './analizar-calendario.ts';

function fila(id: string, local: string, gl: string, gv: string, visitante: string): string {
  return `<tr bgcolor="#FFFFFF" id="${id}">
    <td width="40%" align="right" class="fondolistados"> ${local} &nbsp; </td>
    <td class="fondolistados_solohoriz" align="center"> ${gl} </td>
    <td nowrap="" class="fondolistados_solohoriz" align="center">-</td>
    <td class="fondolistados_solohoriz" align="center"> ${gv} </td>
    <td width="40%" class="fondolistados_solohoriz"> ${visitante} </td>
    <td nowrap="" class="fondolistadoscierre_dcha"> &nbsp; <span id="disp_${id}"></span> </td>
  </tr>`;
}

function jornada(numero: number, fecha: string, filas: string): string {
  return `<div id="trPartidosJornada_${numero}"><table class="table"><thead><tr><th colspan="6">
    <span class="subtitulos" id="Jornada_${numero}"> Jornada ${numero}
    <span id="fecha_jornada_org_${numero}">(${fecha})</span></span></th></tr></thead>
    <tbody>${filas}</tbody></table></div>`;
}

const HTML = `<html><body>
  ${
  jornada(
    1,
    '02-10-2026',
    [
      fila('93474', 'Descansa', '', '', 'DRINK TEAM F.C.'),
      fila('93468', 'C.D. MONTEJO', '4', '0', 'FRENAHAYBACHE F.C.'),
      fila('93471', 'PIN PALS', '', '', 'PITS'),
    ].join(''),
  )
}
  ${
  jornada(
    2,
    '16-10-2026',
    [
      fila('93475', 'FRENAHAYBACHE F.C.', '', '', 'Descansa'),
      fila('93478', 'PITS', '3', '3', 'PRIDE OF SPARTA'),
    ].join(''),
  )
}
</body></html>`;

Deno.test('analizarCalendario lee jornadas, fechas, descansos y marcadores', () => {
  const jornadas = analizarCalendario(HTML);
  assertEquals(jornadas.length, 2);
  assertEquals(jornadas[0].numero, 1);
  assertEquals(jornadas[0].fecha, '2026-10-02');
  assertEquals(jornadas[0].descansa, 'DRINK TEAM F.C.');
  assertEquals(jornadas[0].partidos, [
    {
      codActa: '93468',
      local: 'C.D. MONTEJO',
      visitante: 'FRENAHAYBACHE F.C.',
      golesLocal: 4,
      golesVisitante: 0,
    },
    {
      codActa: '93471',
      local: 'PIN PALS',
      visitante: 'PITS',
      golesLocal: null,
      golesVisitante: null,
    },
  ]);
  assertEquals(jornadas[1].descansa, 'FRENAHAYBACHE F.C.');
  assertEquals(jornadas[1].partidos[0].golesVisitante, 3);
});

Deno.test('analizarCalendario falla si una jornada no tiene fecha', () => {
  const sinFecha = jornada(3, 'por fijar', fila('1', 'A', '', '', 'B'));
  assertThrows(() => analizarCalendario(`<html><body>${sinFecha}</body></html>`));
});

import { assertEquals, assertThrows } from '@std/assert';
import { analizarClasificacion } from './analizar-clasificacion.ts';

function fila(
  codigo: string,
  posicion: number,
  nombre: string,
  valores: number[],
  ultimos: string[],
  sancion = 0,
): string {
  const celdas = valores.map((valor) => `<td align="center" class="fondolistados">${valor}</td>`)
    .join('');
  const racha = ultimos.map((letra) =>
    `<span title="x" style="background-color:#04B431;">${letra}</span>`
  ).join(' ');
  return `<tr bgcolor="#FFFFFF" id="${codigo}_2">
    <td width="1%">&nbsp;</td>
    <td width="3%" align="center"> ${posicion} </td>
    <td nowrap="" class="fondolistados"> <a href="NFG_VisCompeticiones_Grupo?codequipo=${codigo}"> <span id="${codigo}_nombre">${nombre} </span> </a> </td>
    ${celdas}
    <td align="center" class="fondolistados" nowrap=""> ${racha} </td>
    <td align="center" class="fondolistadoscierre">${sancion}&nbsp;</td>
  </tr>`;
}

const CABECERA_DETALLADA =
  `<thead><tr><th colspan="5">Equipos</th><th colspan="4">Partidos Casa</th><th colspan="4">Partidos Fuera</th><th colspan="2">Goles</th><th>Últimos</th><th>Sanción</th></tr></thead>`;
const CABECERA_RESUMIDA =
  `<thead><tr><th colspan="4">Equipos</th><th colspan="4">Partidos</th><th colspan="2">Goles</th><th>Últimos</th><th>Sanción</th></tr>
  <tr><th colspan="3">Ordenar por:</th><th>Puntos</th><th>J.</th><th>G.</th><th>E.</th><th>P.</th><th>F.</th><th>C.</th><th></th><th>Puntos</th></tr></thead>`;

const HTML = `<html><body>
  <table class="table">${CABECERA_DETALLADA}<tbody>${
  fila('303862', 1, 'PRIDE OF SPARTA', [7, 1, 1, 0, 0, 1, 1, 1, 0, 11, 8], ['G'])
}</tbody></table>
  <table class="table">${CABECERA_RESUMIDA}<tbody>
    ${fila('303862', 1, 'PRIDE OF SPARTA', [7, 3, 2, 1, 0, 11, 8], ['G', 'E', 'G'])}
    ${fila('326330', 7, 'PITS', [1, 1, 0, 1, 0, 3, 3], ['E'], -1)}
  </tbody></table>
</body></html>`;

Deno.test('analizarClasificacion lee la tabla resumida con códigos de equipo', () => {
  const filas = analizarClasificacion(HTML);
  assertEquals(filas.length, 2);
  assertEquals(filas[0], {
    posicion: 1,
    codEquipo: '303862',
    nombre: 'PRIDE OF SPARTA',
    puntos: 7,
    jugados: 3,
    ganados: 2,
    empatados: 1,
    perdidos: 0,
    golesFavor: 11,
    golesContra: 8,
    ultimos: 'G E G',
    sancion: 0,
  });
  assertEquals(filas[1].codEquipo, '326330');
  assertEquals(filas[1].ultimos, 'E');
  assertEquals(filas[1].sancion, -1);
});

Deno.test('analizarClasificacion falla si no encuentra la tabla', () => {
  assertThrows(() =>
    analizarClasificacion(
      '<html><body><table><thead><tr><th>Nada</th></tr></thead></table></body></html>',
    )
  );
});

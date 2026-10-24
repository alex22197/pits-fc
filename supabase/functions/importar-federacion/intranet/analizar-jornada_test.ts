import { assertEquals } from '@std/assert';
import { analizarJornada } from './analizar-jornada.ts';

function equipo(codigo: string, nombre: string): string {
  return `<span class="font_widgetL"> &nbsp; <a style="color:#000;" href="NFG_VisEquipos?cod_primaria=1000102&amp;Codigo_Equipo=${codigo}"> ${nombre} </a> </span>`;
}

function bloque(opciones: {
  local: string;
  visitante: string;
  marcador?: [string, string];
  fecha?: string;
  hora?: string;
  acta?: string;
  campo?: string;
}): string {
  const marcador = opciones.marcador
    ? `<span class="title"> <span class="resultado_cerrada">${
      opciones.marcador[0]
    } -</span> </span> <span class="title"> <span class="resultado_cerrada">${
      opciones.marcador[1]
    }</span> </span>`
    : `<span class="title"> </span> <span class="title"> </span>`;
  const detalles = opciones.fecha
    ? `<span class="esconder"><i class="fa fa-clock-o"></i> ${opciones.fecha} &nbsp;&nbsp;</span> <span class="esconder"> ${opciones.hora} &nbsp;&nbsp;</span>`
    : '';
  const acta = opciones.acta
    ? `<a class="btn btn-sm btn-success" href="/nfg/NPcd/NFG_CmpPartido?cod_primaria=1000128&amp;CodActa=${opciones.acta}&amp;cod_acta=${opciones.acta}"><i class="fa fa-clipboard"></i></a>`
    : '';
  const campo = opciones.campo
    ? `<td width="476"> <span class="textocolor"><b>Campo:</b></span> ${opciones.campo} </td>`
    : '<td width="476"> </td>';
  return `<div class="portlet-body body_fed"><table width="100%"><tbody>
    <tr>
      <td width="40%" align="left"><img src="escudo.jpg" class="escudo_clb"> ${opciones.local} &nbsp;</td>
      <td width="100" align="center"><h4><strong>${marcador}</strong></h4><div></div><h5>${detalles}</h5></td>
      <td width="40%" align="right">&nbsp;${opciones.visitante} <img src="escudo.jpg" class="escudo_clb"></td>
    </tr>
    <tr><td colspan="7"><table><tbody><tr><td width="126"> &nbsp; ${acta} </td>${campo}<td> &nbsp; </td></tr></tbody></table></td></tr>
  </tbody></table></div>`;
}

const HTML = `<html><body>
  ${
  bloque({
    local: equipo('303912', 'FRENAHAYBACHE F.C.'),
    visitante: '<span class="font_widgetL"><span class="title">Descansa</span></span>',
  })
}
  ${
  bloque({
    local: equipo('326330', 'PITS'),
    visitante: equipo('303862', 'PRIDE OF SPARTA'),
    marcador: ['3', '3'],
    fecha: '16-10-2026',
    hora: '21:00',
    acta: '93478',
    campo: 'PVO. JOSE CABALLERO CAMPO 2 - 2 - Hierba Artificial',
  })
}
  ${
  bloque({
    local: equipo('313659', 'PIN PALS'),
    visitante: equipo('333237', 'VERGOSOS C.F'),
    fecha: '26-10-2026',
    hora: '22:00',
    acta: '93490',
  })
}
</body></html>`;

Deno.test('analizarJornada lee equipos, marcador, fecha, hora, acta y campo', () => {
  const partidos = analizarJornada(HTML);
  assertEquals(partidos.length, 2);
  assertEquals(partidos[0], {
    codActa: '93478',
    local: 'PITS',
    visitante: 'PRIDE OF SPARTA',
    fecha: '2026-10-16',
    hora: '21:00',
    campo: 'PVO. JOSE CABALLERO CAMPO 2 - 2 - Hierba Artificial',
    golesLocal: 3,
    golesVisitante: 3,
  });
});

Deno.test('analizarJornada deja vacío lo que aún no existe', () => {
  const pendiente = analizarJornada(HTML)[1];
  assertEquals(pendiente.golesLocal, null);
  assertEquals(pendiente.campo, null);
  assertEquals(pendiente.fecha, '2026-10-26');
  assertEquals(pendiente.codActa, '93490');
});

import { Injectable, computed, effect, inject, resource, signal } from '@angular/core';
import { ActasService } from '@data-access/actas/actas.service';
import type { GolActa } from '@data-access/actas/interfaces/gol-acta.interface';
import type { TarjetaActa } from '@data-access/actas/interfaces/tarjeta-acta.interface';
import { contarGoles } from '@data-access/actas/marcadores-acta';
import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';
import type { Jugador } from '@data-access/jugadores/interfaces/jugador.interface';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { JugadoresService } from '@data-access/jugadores/jugadores.service';
import { PartidosService } from '@data-access/partidos/partidos.service';
import {
  momentoDeReferencia,
  partidosDeNuestroEquipo,
} from '@data-access/partidos/proximo-partido';
import type { EstadoGuardado } from '../interfaces/estado-guardado.interface';

/**
 * Datos de la pantalla del acta: nuestros partidos jugados, el elegido, la plantilla y los
 * goles y tarjetas que el gestor va apuntando. Avisa si no cuadran con el resultado.
 */
@Injectable()
export class DatosActaGestionService {
  private readonly competiciones = inject(CompeticionesService);
  private readonly partidos = inject(PartidosService);
  private readonly jugadores = inject(JugadoresService);
  private readonly actas = inject(ActasService);

  readonly competicion = resource({ loader: () => this.competiciones.obtenerActiva() });
  readonly calendario = resource({
    params: () => this.competicion.value()?.id,
    loader: ({ params }) => this.partidos.obtenerCalendario(params),
  });
  readonly plantilla = resource({ loader: () => this.jugadores.obtenerPlantilla() });

  /** Nuestros partidos ya jugados, del más reciente al más antiguo. */
  readonly jugados = computed(() =>
    partidosDeNuestroEquipo(this.calendario.value() ?? [])
      .filter((partido) => partido.estado === 'jugado')
      .sort((a, b) => momentoDeReferencia(b).getTime() - momentoDeReferencia(a).getTime()),
  );

  private readonly idElegido = signal<string | null>(null);
  readonly partido = computed(
    () => this.jugados().find((p) => p.id === this.idElegido()) ?? this.jugados()[0] ?? null,
  );

  readonly guardada = resource({
    params: () => this.partido() ?? undefined,
    loader: ({ params }) => this.actas.obtenerActa(params),
  });

  /** El acta con quién jugó, para colocar a los titulares en la pizarra. */
  readonly detalle = resource({
    params: () => this.partido()?.id,
    loader: ({ params }) => this.partidos.obtenerDetalle(params),
  });
  readonly titularesActa = computed(() =>
    (this.detalle.value()?.participantes ?? []).filter((p) => p.titular).map((p) => p.jugador),
  );
  readonly alineacion = signal<ReadonlyMap<PuestoAlineacion, Jugador>>(new Map());

  readonly goles = signal<readonly GolActa[]>([]);
  readonly tarjetas = signal<readonly TarjetaActa[]>([]);
  readonly estado = signal<EstadoGuardado | null>(null);
  readonly ocupado = signal(false);

  /** Si los goles apuntados no cuadran con el resultado de la federación, lo dice. */
  readonly aviso = computed(() => {
    const partido = this.partido();
    if (!partido?.marcador) {
      return null;
    }
    const somosLocal = partido.local.esNuestro;
    const esperados = {
      nuestros: somosLocal ? partido.marcador.local : partido.marcador.visitante,
      rival: somosLocal ? partido.marcador.visitante : partido.marcador.local,
    };
    const apuntados = contarGoles(this.goles());
    if (apuntados.nuestros === esperados.nuestros && apuntados.rival === esperados.rival) {
      return null;
    }
    return `Hay ${apuntados.nuestros} goles nuestros y ${apuntados.rival} del rival apuntados, y el resultado de la federación es ${esperados.nuestros}-${esperados.rival}.`;
  });

  constructor() {
    // Cada vez que llega el acta guardada de un partido, el formulario parte de ella.
    effect(() => {
      const guardada = this.guardada.value();
      if (guardada === undefined) {
        return;
      }
      this.goles.set(guardada.goles);
      this.tarjetas.set(guardada.tarjetas);
      this.estado.set(null);
    });
    effect(() => {
      const participantes = this.detalle.value()?.participantes;
      if (!participantes) {
        return;
      }
      this.alineacion.set(
        new Map(
          participantes
            .filter((p) => p.titular && p.puesto !== null)
            .map((p) => [p.puesto as PuestoAlineacion, p.jugador]),
        ),
      );
    });
  }

  elegirPartido(id: string): void {
    this.idElegido.set(id);
  }

  colocar(alineacion: ReadonlyMap<PuestoAlineacion, Jugador>): void {
    this.alineacion.set(alineacion);
  }

  anadirGol(): void {
    this.goles.update((lista) => [
      ...lista,
      { nuestro: true, minuto: null, jugadorId: null, asistenteId: null },
    ]);
  }

  cambiarGol(indice: number, cambios: Partial<GolActa>): void {
    this.goles.update((lista) =>
      lista.map((gol, i) => {
        if (i !== indice) {
          return gol;
        }
        const nuevo = { ...gol, ...cambios };
        return nuevo.nuestro ? nuevo : { ...nuevo, jugadorId: null, asistenteId: null };
      }),
    );
  }

  quitarGol(indice: number): void {
    this.goles.update((lista) => lista.filter((_, i) => i !== indice));
  }

  anadirTarjeta(): void {
    const primero = this.plantilla.value()?.[0];
    if (!primero) {
      return;
    }
    this.tarjetas.update((lista) => [
      ...lista,
      { jugadorId: primero.id, tipo: 'amarilla', minuto: null },
    ]);
  }

  cambiarTarjeta(indice: number, cambios: Partial<TarjetaActa>): void {
    this.tarjetas.update((lista) =>
      lista.map((tarjeta, i) => (i === indice ? { ...tarjeta, ...cambios } : tarjeta)),
    );
  }

  quitarTarjeta(indice: number): void {
    this.tarjetas.update((lista) => lista.filter((_, i) => i !== indice));
  }

  async guardar(): Promise<void> {
    const partido = this.partido();
    if (!partido) {
      return;
    }
    this.ocupado.set(true);
    this.estado.set(null);
    try {
      await this.actas.guardarActa(partido, { goles: this.goles(), tarjetas: this.tarjetas() });
      await this.actas.guardarAlineacion(
        partido.id,
        new Map([...this.alineacion()].map(([puesto, jugador]) => [puesto, jugador.id])),
      );
      this.estado.set({ tipo: 'ok', mensaje: 'Acta guardada' });
    } catch (error) {
      this.estado.set({
        tipo: 'error',
        mensaje: error instanceof Error ? error.message : 'Algo ha fallado.',
      });
    } finally {
      this.ocupado.set(false);
    }
  }
}

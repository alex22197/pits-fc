import { Injectable, computed, effect, inject, resource, signal } from '@angular/core';
import { CompeticionesService } from '@data-access/competiciones/competiciones.service';
import { ConvocatoriasService } from '@data-access/convocatorias/convocatorias.service';
import type { DecisionConvocatoria } from '@data-access/convocatorias/interfaces/decision-convocatoria.interface';
import type { EstadoConvocatoria } from '@data-access/convocatorias/interfaces/estado-convocatoria.type';
import type { PuestoAlineacion } from '@data-access/convocatorias/interfaces/puesto-alineacion.type';
import { titularesPorPuesto } from '@data-access/convocatorias/puestos';
import { textoConvocatoria } from '@data-access/convocatorias/texto-convocatoria';
import { JugadoresService } from '@data-access/jugadores/jugadores.service';
import { PartidosService } from '@data-access/partidos/partidos.service';
import {
  elegirProximoPartido,
  momentoDeReferencia,
  partidosDeNuestroEquipo,
} from '@data-access/partidos/proximo-partido';
import { FechaPartidoPipe } from '@shared/pipes/fecha-partido.pipe';
import type { EstadoGuardado } from '../interfaces/estado-guardado.interface';
import { anotarNota, colocarEnPuesto, decidirEstado, vaciarPuesto } from './decisiones-alineacion';

/**
 * Datos de la gestión de la convocatoria: nuestros partidos pendientes, el elegido, los
 * jugadores y lo decidido para cada uno. Guarda, publica y genera el texto para WhatsApp.
 */
@Injectable()
export class DatosConvocatoriaGestionService {
  private readonly competiciones = inject(CompeticionesService);
  private readonly partidos = inject(PartidosService);
  private readonly jugadores = inject(JugadoresService);
  private readonly convocatorias = inject(ConvocatoriasService);
  private readonly fechaPartido = new FechaPartidoPipe();

  readonly competicion = resource({ loader: () => this.competiciones.obtenerActiva() });
  readonly calendario = resource({
    params: () => this.competicion.value()?.id,
    loader: ({ params }) => this.partidos.obtenerCalendario(params),
  });
  readonly plantilla = resource({ loader: () => this.jugadores.obtenerPlantilla() });

  /** Nuestros partidos aún no jugados, del más cercano al más lejano. */
  readonly pendientes = computed(() =>
    partidosDeNuestroEquipo(this.calendario.value() ?? [])
      .filter((partido) => partido.estado !== 'jugado')
      .sort((a, b) => momentoDeReferencia(a).getTime() - momentoDeReferencia(b).getTime()),
  );

  private readonly idElegido = signal<string | null>(null);
  readonly partido = computed(() => {
    const id = this.idElegido();
    return (
      this.pendientes().find((partido) => partido.id === id) ??
      elegirProximoPartido(this.pendientes(), new Date()) ??
      this.pendientes()[0] ??
      null
    );
  });

  readonly guardada = resource({
    params: () => this.partido()?.id,
    loader: ({ params }) => this.convocatorias.obtenerConvocatoria(params),
  });

  /** Lo que hay en el formulario: parte de lo guardado y cambia con el gestor. */
  readonly decisiones = signal<ReadonlyMap<string, DecisionConvocatoria>>(new Map());
  readonly estado = signal<EstadoGuardado | null>(null);
  readonly ocupado = signal(false);

  readonly convocadosEnFormulario = computed(() => {
    const decisiones = this.decisiones();
    return (this.plantilla.value() ?? [])
      .filter((jugador) => decisiones.has(jugador.id))
      .map((jugador) => {
        const decision = decisiones.get(jugador.id) as DecisionConvocatoria;
        return { jugador, estado: decision.estado, puesto: decision.puesto, nota: decision.nota };
      });
  });
  readonly titulares = computed(() => titularesPorPuesto(this.convocadosEnFormulario()));
  readonly texto = computed(() => {
    const partido = this.partido();
    return partido
      ? textoConvocatoria(partido, this.convocadosEnFormulario(), (p) =>
          this.fechaPartido.transform(p, 'larga'),
        )
      : '';
  });

  constructor() {
    // Cada vez que llega la convocatoria guardada de un partido, el formulario parte de ella.
    effect(() => {
      const guardada = this.guardada.value();
      if (guardada === undefined) {
        return;
      }
      this.decisiones.set(
        new Map(
          guardada.map((c) => [
            c.jugador.id,
            { jugadorId: c.jugador.id, estado: c.estado, puesto: c.puesto, nota: c.nota },
          ]),
        ),
      );
      this.estado.set(null);
    });
  }

  elegirPartido(id: string): void {
    this.idElegido.set(id);
  }

  decidir(jugadorId: string, estado: EstadoConvocatoria | null): void {
    this.decisiones.update((actual) => decidirEstado(actual, jugadorId, estado));
  }

  colocar(jugadorId: string, puesto: PuestoAlineacion): void {
    this.decisiones.update((actual) => colocarEnPuesto(actual, jugadorId, puesto));
  }

  vaciar(puesto: PuestoAlineacion): void {
    this.decisiones.update((actual) => vaciarPuesto(actual, puesto));
  }

  anotar(jugadorId: string, nota: string): void {
    this.decisiones.update((actual) => anotarNota(actual, jugadorId, nota));
  }

  async guardar(): Promise<void> {
    const partido = this.partido();
    if (!partido) {
      return;
    }
    await this.ejecutar('Convocatoria guardada', () =>
      this.convocatorias.guardarConvocatoria(partido.id, [...this.decisiones().values()]),
    );
  }

  async publicar(publicada: boolean): Promise<void> {
    const partido = this.partido();
    if (!partido) {
      return;
    }
    await this.ejecutar(
      publicada ? 'Convocatoria publicada' : 'Convocatoria retirada',
      async () => {
        await this.convocatorias.guardarConvocatoria(partido.id, [...this.decisiones().values()]);
        await this.convocatorias.publicar(partido.id, publicada);
        this.calendario.reload();
      },
    );
  }

  private async ejecutar(mensajeOk: string, accion: () => Promise<void>): Promise<void> {
    this.ocupado.set(true);
    this.estado.set(null);
    try {
      await accion();
      this.estado.set({ tipo: 'ok', mensaje: mensajeOk });
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

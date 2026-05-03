import { Mesa } from '../entities/Mesa';
import { Reserva } from '../entities/Reserva';
import { ASIGNACION_INTELIGENTE } from '../constants';

/**
 * Criterio de selección de mesa
 */
interface CriterioSeleccion {
  mesa: Mesa;
  puntuacion: number;
}

/**
 * Servicio de dominio para asignación inteligente de mesas
 * Optimiza la ocupación del restaurante
 * 
 * Algoritmo de puntuación:
 * - 70% peso en eficiencia de ocupación (aprovechar capacidad de la mesa)
 * - 30% peso en minimizar desperdicio (evitar mesas demasiado grandes)
 * 
 * Esto maximiza la satisfacción del cliente mientras optimiza el uso del espacio.
 */
export class ServicioAsignacionInteligente {
  /**
   * Selecciona la mejor mesa disponible para un número de comensales
   * Prioriza:
   * 1. Minimizar desperdicio de capacidad
   * 2. Maximizar ocupación general
   * 3. Mesas más cercanas al tamaño solicitado
   */
  seleccionarMesaOptima(
    mesasDisponibles: Mesa[],
    comensales: number
  ): Mesa | null {
    if (mesasDisponibles.length === 0) {
      return null;
    }

    // Calcula puntuación para cada mesa
    const criterios: CriterioSeleccion[] = mesasDisponibles.map((mesa) => ({
      mesa,
      puntuacion: this.calcularPuntuacion(mesa, comensales),
    }));

    // Ordena por mejor puntuación (mayor es mejor)
    criterios.sort((a, b) => b.puntuacion - a.puntuacion);

    return criterios[0]?.mesa ?? null;
  }

  /**
   * Calcula una puntuación para la mesa basada en eficiencia
   * Puntuación más alta = mejor elección
   */
  private calcularPuntuacion(mesa: Mesa, comensales: number): number {
    // Eficiencia de ocupación (0-1, siendo 1 ocupación perfecta)
    const eficiencia = mesa.calcularEficienciaOcupacion(comensales);

    // Penalización por desperdicio de capacidad
    // Si la mesa es mucho más grande de lo necesario, reduce la puntuación
    const desperdicioCapacidad = mesa.capacidad - comensales;
    const penalizacionDesperdicio = Math.max(
      0,
      1 - desperdicioCapacidad / ASIGNACION_INTELIGENTE.FACTOR_DESPERDICIO
    );

    // Combinar factores con pesos configurados
    return (
      eficiencia * ASIGNACION_INTELIGENTE.PESO_EFICIENCIA +
      penalizacionDesperdicio * ASIGNACION_INTELIGENTE.PESO_PENALIZACION_DESPERDICIO
    );
  }

  /**
   * Sugiere múltiples alternativas de mesas ordenadas por idoneidad
   */
  sugerirAlternativas(
    mesasDisponibles: Mesa[],
    comensales: number,
    limite: number = ASIGNACION_INTELIGENTE.LIMITE_SUGERENCIAS_DEFAULT
  ): Mesa[] {
    const criterios: CriterioSeleccion[] = mesasDisponibles.map((mesa) => ({
      mesa,
      puntuacion: this.calcularPuntuacion(mesa, comensales),
    }));

    criterios.sort((a, b) => b.puntuacion - a.puntuacion);

    return criterios.slice(0, limite).map((c) => c.mesa);
  }

  /**
   * Calcula estadísticas de ocupación para un conjunto de reservas
   */
  calcularEstadisticasOcupacion(
    mesas: Mesa[],
    reservas: Reserva[]
  ): {
    capacidadTotal: number;
    capacidadUtilizada: number;
    porcentajeOcupacion: number;
  } {
    const capacidadTotal = mesas.reduce(
      (sum, mesa) => sum + mesa.capacidad,
      0
    );

    const capacidadUtilizada = reservas.reduce((sum, reserva) => {
      if (
        reserva.estado === 'OCCUPIED' ||
        (reserva.estado === 'RESERVED' && this.estaEnRango(reserva))
      ) {
        return sum + reserva.comensales;
      }
      return sum;
    }, 0);

    return {
      capacidadTotal,
      capacidadUtilizada,
      porcentajeOcupacion: capacidadTotal > 0 ? capacidadUtilizada / capacidadTotal : 0,
    };
  }

  private estaEnRango(reserva: Reserva): boolean {
    const ahora = new Date();
    const inicio = new Date(reserva.horaInicio);
    const fin = new Date(reserva.horaFin);
    return ahora >= inicio && ahora <= fin;
  }
}

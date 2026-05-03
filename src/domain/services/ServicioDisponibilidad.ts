import { Mesa } from '../entities/Mesa';
import { Reserva } from '../entities/Reserva';
import { ConfiguracionRestaurante } from '../entities/ConfiguracionRestaurante';

/**
 * Resultado de verificación de disponibilidad
 */
export interface ResultadoDisponibilidad {
  disponible: boolean;
  motivo?: string;
  mesasDisponibles?: Mesa[];
}

/**
 * Servicio de dominio para lógica de disponibilidad de mesas
 * Contiene las reglas críticas de negocio para reservas
 */
export class ServicioDisponibilidad {
  /**
   * Verifica si una mesa está disponible en un rango horario específico
   */
  verificarDisponibilidadMesa(
    mesa: Mesa,
    comensales: number,
    reservasActivas: Reserva[],
    horaInicio: string,
    horaFin: string
  ): ResultadoDisponibilidad {
    // Verificar capacidad
    if (!mesa.puedeAcomodar(comensales)) {
      return {
        disponible: false,
        motivo: `La mesa ${mesa.numero} tiene capacidad para ${mesa.capacidad} personas, pero se requieren ${comensales}`,
      };
    }

    // Verificar conflictos de horario
    const tieneConflicto = reservasActivas.some((reserva) =>
      reserva.conflictoConRango(horaInicio, horaFin)
    );

    if (tieneConflicto) {
      return {
        disponible: false,
        motivo: `La mesa ${mesa.numero} ya está reservada en ese horario`,
      };
    }

    return {
      disponible: true,
    };
  }

  /**
   * Filtra mesas disponibles dado un conjunto de mesas y reservas
   */
  filtrarMesasDisponibles(
    mesas: Mesa[],
    comensales: number,
    reservasPorMesa: Map<string, Reserva[]>,
    horaInicio: string,
    horaFin: string
  ): Mesa[] {
    return mesas.filter((mesa) => {
      const reservasActivas = reservasPorMesa.get(mesa.id) || [];
      const resultado = this.verificarDisponibilidadMesa(
        mesa,
        comensales,
        reservasActivas,
        horaInicio,
        horaFin
      );
      return resultado.disponible;
    });
  }

  /**
   * Valida que el horario de reserva esté dentro del horario del restaurante
   */
  validarHorarioRestaurante(
    horaInicio: string,
    horaFin: string,
    configuracion: ConfiguracionRestaurante
  ): ResultadoDisponibilidad {
    if (!configuracion.estaDentroHorario(horaInicio)) {
      return {
        disponible: false,
        motivo: `El restaurante abre a las ${configuracion.horaApertura} y cierra a las ${configuracion.horaCierre}`,
      };
    }

    if (!configuracion.estaDentroHorario(horaFin)) {
      return {
        disponible: false,
        motivo: `La reserva terminaría después del horario de cierre (${configuracion.horaCierre})`,
      };
    }

    return {
      disponible: true,
    };
  }
}

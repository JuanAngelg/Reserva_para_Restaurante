import { Reserva } from '../../domain/entities/Reserva';
import { IReservaRepository } from '../../domain/ports/IReservaRepository';
import { IMesaRepository } from '../../domain/ports/IMesaRepository';
import { IConfiguracionRepository } from '../../domain/ports/IConfiguracionRepository';
import { ICalendarioService } from '../../domain/ports/ICalendarioService';
import { ServicioDisponibilidad } from '../../domain/services/ServicioDisponibilidad';
import { ServicioAsignacionInteligente } from '../../domain/services/ServicioAsignacionInteligente';
import { Email } from '../../domain/value-objects/Email';
import { CrearReservaDTO, ReservaDTO } from '../dtos/ReservaDTO';
import {
  ErrorNoEncontrado,
  ErrorValidacion,
  ErrorNegocio,
} from '../errors';
import { EstadoReserva } from '../../types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Caso de uso: Crear nueva reserva
 * Implementa la lógica crítica de disponibilidad y asignación inteligente
 */
export class CrearReservaUseCase {
  private readonly servicioDisponibilidad = new ServicioDisponibilidad();
  private readonly servicioAsignacion = new ServicioAsignacionInteligente();

  constructor(
    private readonly reservaRepository: IReservaRepository,
    private readonly mesaRepository: IMesaRepository,
    private readonly configuracionRepository: IConfiguracionRepository,
    private readonly calendarioService: ICalendarioService
  ) {}

  async ejecutar(dto: CrearReservaDTO): Promise<ReservaDTO> {
    // Validar email
    new Email(dto.emailCliente);

    // Obtener configuración del restaurante
    const configuracion = await this.configuracionRepository.obtener();
    if (!configuracion) {
      throw new ErrorNoEncontrado('Configuración del restaurante');
    }

    // Parsear fecha
    const fecha = new Date(dto.fecha);
    if (isNaN(fecha.getTime())) {
      throw new ErrorValidacion('Formato de fecha inválido');
    }

    // Calcular hora de fin
    const horaFin = configuracion.calcularHoraFin(dto.horaInicio);

    // Validar horario del restaurante
    const resultadoHorario = this.servicioDisponibilidad.validarHorarioRestaurante(
      dto.horaInicio,
      horaFin,
      configuracion
    );

    if (!resultadoHorario.disponible) {
      throw new ErrorNegocio(
        resultadoHorario.motivo || 'Horario no disponible'
      );
    }

    let mesaAsignada;

    // Iniciar transacción para prevenir race conditions
    await this.reservaRepository.iniciarTransaccion();

    try {
      if (dto.mesaId) {
        // Mesa específica solicitada
        mesaAsignada = await this.mesaRepository.buscarPorId(dto.mesaId);
        if (!mesaAsignada) {
          throw new ErrorNoEncontrado('Mesa', dto.mesaId);
        }

        // Verificar disponibilidad de la mesa específica
        const reservasActivas =
          await this.reservaRepository.buscarReservasActivasPorMesaYRango(
            dto.mesaId,
            fecha,
            dto.horaInicio,
            horaFin
          );

        const resultadoDisponibilidad =
          this.servicioDisponibilidad.verificarDisponibilidadMesa(
            mesaAsignada,
            dto.comensales,
            reservasActivas,
            dto.horaInicio,
            horaFin
          );

        if (!resultadoDisponibilidad.disponible) {
          throw new ErrorNegocio(
            resultadoDisponibilidad.motivo || 'Mesa no disponible'
          );
        }
      } else {
        // Asignacion automatica con validacion de disponibilidad
        const mesasConCapacidad = await this.mesaRepository.listarPorCapacidadMinima(
          dto.comensales
        );

        if (mesasConCapacidad.length === 0) {
          throw new ErrorNegocio(
            `No hay mesas con capacidad para ${dto.comensales} comensales`
          );
        }

        const reservasPorMesa = new Map<string, Reserva[]>();
        for (const mesa of mesasConCapacidad) {
          const reservasActivas =
            await this.reservaRepository.buscarReservasActivasPorMesaYRango(
              mesa.id,
              fecha,
              dto.horaInicio,
              horaFin
            );
          reservasPorMesa.set(mesa.id, reservasActivas);
        }

        const mesasDisponibles = this.servicioDisponibilidad.filtrarMesasDisponibles(
          mesasConCapacidad,
          dto.comensales,
          reservasPorMesa,
          dto.horaInicio,
          horaFin
        );

        if (mesasDisponibles.length === 0) {
          throw new ErrorNegocio('No hay mesas disponibles en ese horario');
        }

        mesaAsignada = this.servicioAsignacion.seleccionarMesaOptima(
          mesasDisponibles,
          dto.comensales
        );

        if (!mesaAsignada) {
          throw new ErrorNegocio('No se pudo asignar una mesa');
        }
      }

      // Crear la reserva
      if (!mesaAsignada) {
        throw new ErrorNegocio('No se pudo asignar una mesa');
      }

      const reserva = new Reserva(
        uuidv4(),
        dto.usuarioId ?? null,
        dto.nombreCliente,
        dto.emailCliente,
        mesaAsignada.id,
        dto.comensales,
        fecha,
        dto.horaInicio,
        horaFin,
        EstadoReserva.RESERVADA
      );

      // Guardar en base de datos
      await this.reservaRepository.guardar(reserva);

      // Sincronizar con Google Calendar
      try {
        await this.calendarioService.crearEvento({
          titulo: `Reserva - ${reserva.nombreCliente}`,
          descripcion: `${reserva.comensales} personas en mesa ${mesaAsignada.numero}`,
          fechaInicio: new Date(`${fecha.toISOString().split('T')[0]}T${dto.horaInicio}:00`),
          fechaFin: new Date(`${fecha.toISOString().split('T')[0]}T${horaFin}:00`),
        });
      } catch (error) {
        // Log pero no fallar si el calendario no está disponible
        console.warn('No se pudo sincronizar con Google Calendar:', error);
      }

      // Confirmar transacción
      await this.reservaRepository.confirmarTransaccion();

      return {
        id: reserva.id,
        usuarioId: reserva.usuarioId,
        nombreCliente: reserva.nombreCliente,
        emailCliente: reserva.emailCliente,
        mesaId: reserva.mesaId,
        comensales: reserva.comensales,
        fecha: reserva.fecha,
        horaInicio: reserva.horaInicio,
        horaFin: reserva.horaFin,
        estado: reserva.estado,
        createdAt: reserva.createdAt,
        updatedAt: reserva.updatedAt,
      };
    } catch (error) {
      await this.reservaRepository.revertirTransaccion();
      throw error;
    }
  }
}

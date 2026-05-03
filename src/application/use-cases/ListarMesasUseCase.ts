import { IMesaRepository } from '../../domain/ports/IMesaRepository';
import { ResultadoPaginado } from '../../types';
import { MesaDTO } from '../dtos/MesaDTO';

/**
 * Caso de uso: Listar todas las mesas
 */
export class ListarMesasUseCase {
  constructor(private readonly mesaRepository: IMesaRepository) {}

  async ejecutar(
    pagina: number = 1,
    limite: number = 10
  ): Promise<ResultadoPaginado<MesaDTO>> {
    const resultado = await this.mesaRepository.listar({ pagina, limite });

    return {
      datos: resultado.datos.map((mesa) => ({
        id: mesa.id,
        numero: mesa.numero,
        capacidad: mesa.capacidad,
        forma: mesa.forma,
        posicionX: mesa.posicionX,
        posicionY: mesa.posicionY,
        createdAt: mesa.createdAt,
        updatedAt: mesa.updatedAt,
      })),
      total: resultado.total,
      pagina: resultado.pagina,
      limite: resultado.limite,
      totalPaginas: resultado.totalPaginas,
    };
  }
}

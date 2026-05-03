import Database from 'better-sqlite3';
import { Reserva } from '../../domain/entities/Reserva';
import {
  IReservaRepository,
  FiltrosReserva,
} from '../../domain/ports/IReservaRepository';
import { EstadoReserva, OpcionesPaginacion, ResultadoPaginado } from '../../types';
import { DatabaseManager } from '../database/DatabaseManager';

/**
 * Implementación del repositorio de Reserva usando SQLite
 * Soporta transacciones para operaciones críticas
 */
export class ReservaRepository implements IReservaRepository {
  constructor(
    private readonly db: Database.Database,
    private readonly dbManager?: DatabaseManager
  ) {}

  async guardar(reserva: Reserva): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO reservas (
        id, usuario_id, nombre_cliente, email_cliente, mesa_id,
        comensales, fecha, hora_inicio, hora_fin, estado,
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      reserva.id,
      reserva.usuarioId,
      reserva.nombreCliente,
      reserva.emailCliente,
      reserva.mesaId,
      reserva.comensales,
      reserva.fecha.toISOString().split('T')[0],
      reserva.horaInicio,
      reserva.horaFin,
      reserva.estado,
      reserva.createdAt.toISOString(),
      reserva.updatedAt.toISOString()
    );
  }

  async buscarPorId(id: string): Promise<Reserva | null> {
    const stmt = this.db.prepare('SELECT * FROM reservas WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return null;

    return this.mapearReserva(row);
  }

  async listar(
    filtros?: FiltrosReserva,
    opciones?: OpcionesPaginacion
  ): Promise<ResultadoPaginado<Reserva>> {
    const paginacion = opciones || { pagina: 1, limite: 10 };

    let whereClause = '';
    const parametros: any[] = [];

    if (filtros?.usuarioId) {
      whereClause += ' AND usuario_id = ?';
      parametros.push(filtros.usuarioId);
    }
    if (filtros?.mesaId) {
      whereClause += ' AND mesa_id = ?';
      parametros.push(filtros.mesaId);
    }
    if (filtros?.estado) {
      whereClause += ' AND estado = ?';
      parametros.push(filtros.estado);
    }
    if (filtros?.fecha) {
      whereClause += ' AND fecha = ?';
      parametros.push(filtros.fecha.toISOString().split('T')[0]);
    }

    whereClause = whereClause ? 'WHERE 1=1' + whereClause : '';

    const countStmt = this.db.prepare(`SELECT COUNT(*) as count FROM reservas ${whereClause}`);
    const { count: total } = countStmt.get(...parametros) as { count: number };

    const offset = (paginacion.pagina - 1) * paginacion.limite;
    const dataStmt = this.db.prepare(
      `SELECT * FROM reservas ${whereClause} ORDER BY fecha DESC, hora_inicio DESC LIMIT ? OFFSET ?`
    );

    const rows = dataStmt.all(...parametros, paginacion.limite, offset) as any[];

    return {
      datos: rows.map(row => this.mapearReserva(row)),
      total,
      pagina: paginacion.pagina,
      limite: paginacion.limite,
      totalPaginas: Math.ceil(total / paginacion.limite),
    };
  }

  async actualizar(reserva: Reserva): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE reservas SET
        estado = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      reserva.estado,
      reserva.updatedAt.toISOString(),
      reserva.id
    );
  }

  async buscarReservasActivasPorMesaYRango(
    mesaId: string,
    fecha: Date,
    horaInicio: string,
    horaFin: string
  ): Promise<Reserva[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM reservas
      WHERE mesa_id = ?
        AND fecha = ?
        AND estado IN ('RESERVED', 'OCCUPIED')
        AND NOT (hora_fin <= ? OR hora_inicio >= ?)
    `);

    const fechaStr = fecha.toISOString().split('T')[0];
    const rows = stmt.all(mesaId, fechaStr, horaInicio, horaFin) as any[];

    return rows.map(row => this.mapearReserva(row));
  }

  async buscarReservasActivasPorFechaYRango(
    fecha: Date,
    horaInicio: string,
    horaFin: string
  ): Promise<Reserva[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM reservas
      WHERE fecha = ?
        AND estado IN ('RESERVED', 'OCCUPIED')
        AND NOT (hora_fin <= ? OR hora_inicio >= ?)
    `);

    const fechaStr = fecha.toISOString().split('T')[0];
    const rows = stmt.all(fechaStr, horaInicio, horaFin) as any[];

    return rows.map(row => this.mapearReserva(row));
  }

  async eliminar(id: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM reservas WHERE id = ?');
    stmt.run(id);
  }

  async contarPorEstado(estado: EstadoReserva): Promise<number> {
    const stmt = this.db.prepare('SELECT COUNT(*) as count FROM reservas WHERE estado = ?');
    const result = stmt.get(estado) as { count: number };
    return result.count;
  }

  async iniciarTransaccion(): Promise<void> {
    if (this.dbManager) {
      this.dbManager.abrirTransaccion();
    }
  }

  async confirmarTransaccion(): Promise<void> {
    if (this.dbManager) {
      this.dbManager.confirmarTransaccion();
    }
  }

  async revertirTransaccion(): Promise<void> {
    if (this.dbManager) {
      this.dbManager.revertirTransaccion();
    }
  }

  private mapearReserva(row: any): Reserva {
    return new Reserva(
      row.id,
      row.usuario_id,
      row.nombre_cliente,
      row.email_cliente,
      row.mesa_id,
      row.comensales,
      new Date(row.fecha),
      row.hora_inicio,
      row.hora_fin,
      row.estado as EstadoReserva,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }
}

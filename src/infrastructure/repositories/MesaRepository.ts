import Database from 'better-sqlite3';
import { Mesa } from '../../domain/entities/Mesa';
import { IMesaRepository } from '../../domain/ports/IMesaRepository';
import { OpcionesPaginacion, ResultadoPaginado } from '../../types';

/**
 * Implementación del repositorio de Mesa usando SQLite
 */
export class MesaRepository implements IMesaRepository {
  constructor(private readonly db: Database.Database) {}

  async guardar(mesa: Mesa): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO mesas (id, numero, capacidad, forma, posicion_x, posicion_y, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      mesa.id,
      mesa.numero,
      mesa.capacidad,
      mesa.forma,
      mesa.posicionX,
      mesa.posicionY,
      mesa.createdAt.toISOString(),
      mesa.updatedAt.toISOString()
    );
  }

  async buscarPorId(id: string): Promise<Mesa | null> {
    const stmt = this.db.prepare('SELECT * FROM mesas WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return null;

    return new Mesa(
      row.id,
      row.numero,
      row.capacidad,
      row.forma,
      row.posicion_x,
      row.posicion_y,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  async buscarPorNumero(numero: number): Promise<Mesa | null> {
    const stmt = this.db.prepare('SELECT * FROM mesas WHERE numero = ?');
    const row = stmt.get(numero) as any;

    if (!row) return null;

    return new Mesa(
      row.id,
      row.numero,
      row.capacidad,
      row.forma,
      row.posicion_x,
      row.posicion_y,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  async listar(
    opciones: OpcionesPaginacion
  ): Promise<ResultadoPaginado<Mesa>> {
    const offset = (opciones.pagina - 1) * opciones.limite;

    const countStmt = this.db.prepare('SELECT COUNT(*) as total FROM mesas');
    const countRow = countStmt.get() as any;
    const total = countRow?.total || 0;

    const stmt = this.db.prepare(`
      SELECT * FROM mesas 
      ORDER BY numero ASC 
      LIMIT ? OFFSET ?
    `);

    const rows = stmt.all(opciones.limite, offset) as any[];

    const mesas = rows.map(
      (row) =>
        new Mesa(
          row.id,
          row.numero,
          row.capacidad,
          row.forma,
          row.posicion_x,
          row.posicion_y,
          new Date(row.created_at),
          new Date(row.updated_at)
        )
    );

    return {
      datos: mesas,
      total,
      pagina: opciones.pagina,
      limite: opciones.limite,
      totalPaginas: Math.ceil(total / opciones.limite),
    };
  }

  async listarPorCapacidadMinima(capacidadMinima: number): Promise<Mesa[]> {
    const stmt = this.db.prepare(`
      SELECT * FROM mesas 
      WHERE capacidad >= ? 
      ORDER BY capacidad ASC
    `);

    const rows = stmt.all(capacidadMinima) as any[];

    return rows.map(
      (row) =>
        new Mesa(
          row.id,
          row.numero,
          row.capacidad,
          row.forma,
          row.posicion_x,
          row.posicion_y,
          new Date(row.created_at),
          new Date(row.updated_at)
        )
    );
  }

  async actualizar(mesa: Mesa): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE mesas 
      SET numero = ?, capacidad = ?, forma = ?, posicion_x = ?, posicion_y = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      mesa.numero,
      mesa.capacidad,
      mesa.forma,
      mesa.posicionX,
      mesa.posicionY,
      mesa.updatedAt.toISOString(),
      mesa.id
    );
  }

  async eliminar(id: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM mesas WHERE id = ?');
    stmt.run(id);
  }
}

import Database from 'better-sqlite3';
import { ConfiguracionRestaurante } from '../../domain/entities/ConfiguracionRestaurante';
import { IConfiguracionRepository } from '../../domain/ports/IConfiguracionRepository';

/**
 * Implementación del repositorio de Configuración usando SQLite
 */
export class ConfiguracionRepository implements IConfiguracionRepository {
  constructor(private readonly db: Database.Database) {}

  async obtener(): Promise<ConfiguracionRestaurante | null> {
    const stmt = this.db.prepare('SELECT * FROM configuracion LIMIT 1');
    const row = stmt.get() as any;

    if (!row) return null;

    return new ConfiguracionRestaurante(
      row.id,
      row.hora_apertura,
      row.hora_cierre,
      row.duracion_reserva,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  async guardar(configuracion: ConfiguracionRestaurante): Promise<void> {
    // Verificar si existe configuración
    const existente = await this.obtener();

    if (existente) {
      // Actualizar
      const stmt = this.db.prepare(`
        UPDATE configuracion 
        SET hora_apertura = ?, hora_cierre = ?, duracion_reserva = ?, updated_at = ?
        WHERE id = ?
      `);

      stmt.run(
        configuracion.horaApertura,
        configuracion.horaCierre,
        configuracion.duracionReserva,
        configuracion.updatedAt.toISOString(),
        existente.id
      );
    } else {
      // Insertar
      const stmt = this.db.prepare(`
        INSERT INTO configuracion (id, hora_apertura, hora_cierre, duracion_reserva, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        configuracion.id,
        configuracion.horaApertura,
        configuracion.horaCierre,
        configuracion.duracionReserva,
        configuracion.createdAt.toISOString(),
        configuracion.updatedAt.toISOString()
      );
    }
  }
}

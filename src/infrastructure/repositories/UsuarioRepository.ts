import Database from 'better-sqlite3';
import { Usuario } from '../../domain/entities/Usuario';
import { IUsuarioRepository } from '../../domain/ports/IUsuarioRepository';
import { OpcionesPaginacion, ResultadoPaginado } from '../../types';

/**
 * Implementación del repositorio de Usuario usando SQLite
 */
export class UsuarioRepository implements IUsuarioRepository {
  constructor(private readonly db: Database.Database) {}

  async guardar(usuario: Usuario): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO usuarios (id, nombre, email, password, rol, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      usuario.id,
      usuario.nombre,
      usuario.email,
      usuario.password,
      usuario.rol,
      usuario.createdAt.toISOString(),
      usuario.updatedAt.toISOString()
    );
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const stmt = this.db.prepare('SELECT * FROM usuarios WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return null;

    return new Usuario(
      row.id,
      row.nombre,
      row.email,
      row.password,
      row.rol,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const stmt = this.db.prepare('SELECT * FROM usuarios WHERE email = ?');
    const row = stmt.get(email) as any;

    if (!row) return null;

    return new Usuario(
      row.id,
      row.nombre,
      row.email,
      row.password,
      row.rol,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  async actualizar(usuario: Usuario): Promise<void> {
    const stmt = this.db.prepare(`
      UPDATE usuarios 
      SET nombre = ?, email = ?, password = ?, rol = ?, updated_at = ?
      WHERE id = ?
    `);

    stmt.run(
      usuario.nombre,
      usuario.email,
      usuario.password,
      usuario.rol,
      usuario.updatedAt.toISOString(),
      usuario.id
    );
  }

  async listar(
    opciones: OpcionesPaginacion
  ): Promise<ResultadoPaginado<Usuario>> {
    const offset = (opciones.pagina - 1) * opciones.limite;

    const countStmt = this.db.prepare('SELECT COUNT(*) as total FROM usuarios');
    const countRow = countStmt.get() as any;
    const total = countRow?.total || 0;

    const stmt = this.db.prepare(`
      SELECT * FROM usuarios 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `);

    const rows = stmt.all(opciones.limite, offset) as any[];

    const usuarios = rows.map(
      (row) =>
        new Usuario(
          row.id,
          row.nombre,
          row.email,
          row.password,
          row.rol,
          new Date(row.created_at),
          new Date(row.updated_at)
        )
    );

    return {
      datos: usuarios,
      total,
      pagina: opciones.pagina,
      limite: opciones.limite,
      totalPaginas: Math.ceil(total / opciones.limite),
    };
  }

  async eliminar(id: string): Promise<void> {
    const stmt = this.db.prepare('DELETE FROM usuarios WHERE id = ?');
    stmt.run(id);
  }
}

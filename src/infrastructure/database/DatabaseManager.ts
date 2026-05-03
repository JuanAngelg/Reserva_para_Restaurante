import Database from 'better-sqlite3';

/**
 * Gestor de base de datos SQLite
 * Proporciona conexión y operaciones transaccionales
 * 
 * Características:
 * - Modo WAL para mejor concurrencia
 * - Foreign keys habilitadas
 * - BEGIN IMMEDIATE para transacciones (previene race conditions)
 * - Índices optimizados para consultas frecuentes
 */
export class DatabaseManager {
  private db: Database.Database;
  private transaccionActiva: boolean = false;

  constructor(databasePath?: string) {
    const path = databasePath || process.env.DATABASE_PATH || './database.sqlite';
    this.db = new Database(path);
    this.db.pragma('foreign_keys = ON');
    this.db.pragma('journal_mode = WAL');
    this.inicializarEsquema();
  }

  /**
   * Inicializa el esquema de la base de datos
   */
  private inicializarEsquema(): void {
    // Tabla: usuarios
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        rol TEXT NOT NULL CHECK(rol IN ('CLIENT', 'HOST', 'MANAGER')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
    `);

    // Tabla: mesas
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS mesas (
        id TEXT PRIMARY KEY,
        numero INTEGER NOT NULL,
        capacidad INTEGER NOT NULL CHECK(capacidad > 0),
        forma TEXT NOT NULL CHECK(forma IN ('round', 'square')),
        posicion_x REAL NOT NULL,
        posicion_y REAL NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_mesas_numero ON mesas(numero);
    `);

    this.asegurarColumnasMesa();

    // Tabla: reservas
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS reservas (
        id TEXT PRIMARY KEY,
        usuario_id TEXT,
        mesa_id TEXT NOT NULL,
        nombre_cliente TEXT NOT NULL,
        email_cliente TEXT NOT NULL,
        comensales INTEGER NOT NULL CHECK(comensales > 0),
        fecha TEXT NOT NULL,
        hora_inicio TEXT NOT NULL,
        hora_fin TEXT NOT NULL,
        estado TEXT NOT NULL CHECK(estado IN ('RESERVED', 'OCCUPIED', 'CANCELLED', 'NO_SHOW')),
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
        FOREIGN KEY (mesa_id) REFERENCES mesas(id) ON DELETE RESTRICT
      );
      CREATE INDEX IF NOT EXISTS idx_reservas_usuario ON reservas(usuario_id);
      CREATE INDEX IF NOT EXISTS idx_reservas_mesa ON reservas(mesa_id);
      CREATE INDEX IF NOT EXISTS idx_reservas_fecha ON reservas(fecha);
      CREATE INDEX IF NOT EXISTS idx_reservas_estado ON reservas(estado);
    `);

    // Tabla: configuracion
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS configuracion (
        id TEXT PRIMARY KEY,
        hora_apertura TEXT NOT NULL,
        hora_cierre TEXT NOT NULL,
        duracion_reserva INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);
  }

  /**
   * Agrega columnas faltantes en la tabla mesas para compatibilidad
   */
  private asegurarColumnasMesa(): void {
    const columnas = this.db.prepare('PRAGMA table_info(mesas)').all() as any[];
    const nombres = new Set(columnas.map((c) => c.name));

    if (!nombres.has('forma')) {
      this.db.exec("ALTER TABLE mesas ADD COLUMN forma TEXT NOT NULL DEFAULT 'round'");
    }
    if (!nombres.has('posicion_x')) {
      this.db.exec('ALTER TABLE mesas ADD COLUMN posicion_x REAL NOT NULL DEFAULT 0');
    }
    if (!nombres.has('posicion_y')) {
      this.db.exec('ALTER TABLE mesas ADD COLUMN posicion_y REAL NOT NULL DEFAULT 0');
    }
  }

  /**
   * Abre una transacción
   */
  abrirTransaccion(): void {
    if (!this.transaccionActiva) {
      this.db.exec('BEGIN IMMEDIATE');
      this.transaccionActiva = true;
    }
  }

  /**
   * Confirma la transacción actual
   */
  confirmarTransaccion(): void {
    if (this.transaccionActiva) {
      this.db.exec('COMMIT');
      this.transaccionActiva = false;
    }
  }

  /**
   * Revierte la transacción actual
   */
  revertirTransaccion(): void {
    if (this.transaccionActiva) {
      this.db.exec('ROLLBACK');
      this.transaccionActiva = false;
    }
  }

  /**
   * Ejecuta una función dentro de una transacción
   */
  enTransaccion<T>(fn: () => T): T {
    this.abrirTransaccion();
    try {
      const result = fn();
      this.confirmarTransaccion();
      return result;
    } catch (error) {
      this.revertirTransaccion();
      throw error;
    }
  }

  /**
   * Obtiene la instancia de la base de datos
   */
  obtenerDb(): Database.Database {
    return this.db;
  }

  /**
   * Cierra la conexión a la base de datos
   */
  cerrar(): void {
    this.db.close();
  }
}

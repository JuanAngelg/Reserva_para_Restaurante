export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'API Sistema de Reservas para Restaurante',
    version: '1.0.0',
    description: 'Documentacion de endpoints del backend con arquitectura hexagonal.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor local',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Autenticacion y perfil' },
    { name: 'Mesas', description: 'Gestion de mesas' },
    { name: 'Reservas', description: 'Gestion de reservas' },
    { name: 'Configuracion', description: 'Configuracion del restaurante' },
    { name: 'Reportes', description: 'Analitica y reportes' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          mensaje: { type: 'string' },
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
        },
      },
      RegisterRequest: {
        type: 'object',
        required: ['nombre', 'email', 'password'],
        properties: {
          nombre: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
          rol: { type: 'string', enum: ['CLIENT', 'HOST', 'MANAGER'] },
        },
      },
      RecoverPasswordRequest: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
        },
      },
      ChangePasswordRequest: {
        type: 'object',
        required: ['passwordActual', 'passwordNueva'],
        properties: {
          passwordActual: { type: 'string' },
          passwordNueva: { type: 'string' },
        },
      },
      MesaRequest: {
        type: 'object',
        required: ['numero', 'capacidad', 'forma', 'posicionX', 'posicionY'],
        properties: {
          numero: { type: 'integer', minimum: 1 },
          capacidad: { type: 'integer', minimum: 1 },
          forma: { type: 'string', enum: ['round', 'square'] },
          posicionX: { type: 'number' },
          posicionY: { type: 'number' },
        },
      },
      CrearReservaRequest: {
        type: 'object',
        required: ['nombreCliente', 'emailCliente', 'comensales', 'fecha', 'horaInicio'],
        properties: {
          usuarioId: { type: 'string', format: 'uuid' },
          nombreCliente: { type: 'string' },
          emailCliente: { type: 'string', format: 'email' },
          comensales: { type: 'integer', minimum: 1 },
          fecha: { type: 'string', example: '2026-03-20' },
          horaInicio: { type: 'string', example: '20:00' },
          mesaId: { type: 'string', format: 'uuid' },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Auth'],
        summary: 'Health check',
        responses: {
          '200': {
            description: 'Servidor operativo',
          },
        },
      },
    },
    '/api/health': {
      get: {
        tags: ['Auth'],
        summary: 'Health check API',
        responses: {
          '200': {
            description: 'Servidor operativo',
          },
        },
      },
    },
    '/api/openapi.json': {
      get: {
        tags: ['Auth'],
        summary: 'Especificacion OpenAPI',
        responses: {
          '200': { description: 'OpenAPI JSON' },
        },
      },
    },
    '/api/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Registrar usuario',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterRequest' },
            },
          },
        },
        responses: {
          '201': { description: 'Usuario registrado' },
          '409': { description: 'Email ya registrado' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Iniciar sesion',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Login exitoso' },
          '401': { description: 'Credenciales invalidas' },
        },
      },
    },
    '/api/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Cerrar sesion',
        responses: {
          '200': { description: 'Sesion cerrada' },
        },
      },
    },
    '/api/auth/recover-password': {
      post: {
        tags: ['Auth'],
        summary: 'Recuperar contrasena (simulado)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RecoverPasswordRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Solicitud procesada' },
        },
      },
    },
    '/api/users/profile': {
      get: {
        tags: ['Auth'],
        summary: 'Obtener perfil',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Perfil del usuario' },
          '401': { description: 'No autorizado' },
        },
      },
      put: {
        tags: ['Auth'],
        summary: 'Actualizar perfil',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Perfil actualizado' },
          '401': { description: 'No autorizado' },
        },
      },
    },
    '/api/users/change-password': {
      put: {
        tags: ['Auth'],
        summary: 'Cambiar contrasena',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ChangePasswordRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Contrasena actualizada' },
          '401': { description: 'No autorizado' },
        },
      },
    },
    '/api/mesas': {
      post: {
        tags: ['Mesas'],
        summary: 'Crear mesa',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MesaRequest' },
            },
          },
        },
        responses: {
          '201': { description: 'Mesa creada' },
          '403': { description: 'Sin permisos' },
        },
      },
      get: {
        tags: ['Mesas'],
        summary: 'Listar mesas',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Listado de mesas' },
        },
      },
    },
    '/api/mesas/{id}': {
      get: {
        tags: ['Mesas'],
        summary: 'Obtener mesa por id',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Mesa encontrada' },
          '404': { description: 'Mesa no encontrada' },
        },
      },
      put: {
        tags: ['Mesas'],
        summary: 'Actualizar mesa',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/MesaRequest' },
            },
          },
        },
        responses: {
          '200': { description: 'Mesa actualizada' },
          '403': { description: 'Sin permisos' },
          '404': { description: 'Mesa no encontrada' },
        },
      },
      delete: {
        tags: ['Mesas'],
        summary: 'Eliminar mesa',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Mesa eliminada' },
          '403': { description: 'Sin permisos' },
          '404': { description: 'Mesa no encontrada' },
        },
      },
    },
    '/api/reservations/check-availability': {
      post: {
        tags: ['Reservas'],
        summary: 'Verificar disponibilidad',
        responses: {
          '200': { description: 'Resultado disponibilidad' },
        },
      },
    },
    '/api/reservations': {
      post: {
        tags: ['Reservas'],
        summary: 'Crear reserva',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CrearReservaRequest' },
            },
          },
        },
        responses: {
          '201': { description: 'Reserva creada' },
          '422': { description: 'Conflicto de negocio' },
        },
      },
      get: {
        tags: ['Reservas'],
        summary: 'Listar reservas',
        responses: {
          '200': { description: 'Listado de reservas' },
        },
      },
    },
    '/api/reservations/{id}/status': {
      patch: {
        tags: ['Reservas'],
        summary: 'Actualizar estado de reserva',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Reserva actualizada' },
          '404': { description: 'Reserva no encontrada' },
        },
      },
    },
    '/api/reservations/{id}': {
      delete: {
        tags: ['Reservas'],
        summary: 'Cancelar reserva',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Reserva cancelada' },
          '404': { description: 'Reserva no encontrada' },
        },
      },
    },
    '/api/config': {
      get: {
        tags: ['Configuracion'],
        summary: 'Obtener configuracion',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Configuracion actual' },
        },
      },
      put: {
        tags: ['Configuracion'],
        summary: 'Actualizar configuracion',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Configuracion actualizada' },
        },
      },
    },
    '/api/reports/occupancy': {
      get: {
        tags: ['Reportes'],
        summary: 'Reporte de ocupacion',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Reporte generado' },
        },
      },
    },
    '/api/reports/no-shows': {
      get: {
        tags: ['Reportes'],
        summary: 'Reporte de no-shows',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Reporte generado' },
        },
      },
    },
  },
} as const;

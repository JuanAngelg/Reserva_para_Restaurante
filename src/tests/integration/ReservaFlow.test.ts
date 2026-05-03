import { describe, it, beforeAll, afterAll, expect } from 'vitest';
import request from 'supertest';
import { App } from '../../app';

/**
 * Pruebas de integracion: autenticacion y flujo de reserva
 */
describe('Integracion - Flujo de reservas', () => {
  let appInstance: App;
  let api: request.SuperTest<request.Test>;
  let tokenManager: string;
  let mesaId: string;

  beforeAll(() => {
    process.env.DATABASE_PATH = ':memory:';
    process.env.JWT_SECRET = 'test_secret';
    appInstance = new App();
    api = request(appInstance.obtenerApp());
  });

  afterAll(() => {
    appInstance.cerrarConexion();
  });

  it('registra y autentica un manager', async () => {
    const registerRes = await api.post('/api/auth/register').send({
      nombre: 'Manager Test',
      email: 'manager@test.com',
      password: 'Password123',
      rol: 'MANAGER',
    });

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.token).toBeTruthy();
    tokenManager = registerRes.body.token;

    const loginRes = await api.post('/api/auth/login').send({
      email: 'manager@test.com',
      password: 'Password123',
    });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeTruthy();
  });

  it('recupera contrasena (simulado)', async () => {
    const res = await api.post('/api/auth/recover-password').send({
      email: 'manager@test.com',
    });

    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBeTruthy();
  });

  it('configura restaurante y crea mesa', async () => {
    const configRes = await api
      .put('/api/config')
      .set('Authorization', `Bearer ${tokenManager}`)
      .send({
        horaApertura: '10:00',
        horaCierre: '23:00',
        duracionReserva: 90,
      });

    expect(configRes.status).toBe(200);

    const mesaRes = await api
      .post('/api/mesas')
      .set('Authorization', `Bearer ${tokenManager}`)
      .send({
        numero: 1,
        capacidad: 4,
        forma: 'round',
        posicionX: 10,
        posicionY: 20,
      });

    expect(mesaRes.status).toBe(201);
    mesaId = mesaRes.body.id;
    expect(mesaId).toBeTruthy();
  });

  it('crea una reserva y evita overbooking', async () => {
    const disponibilidadRes = await api
      .post('/api/reservations/check-availability')
      .send({
        comensales: 4,
        fecha: '2026-03-15',
        horaInicio: '21:00',
      });

    expect(disponibilidadRes.status).toBe(200);
    expect(disponibilidadRes.body.disponible).toBe(true);

    const reservaRes = await api
      .post('/api/reservations')
      .set('Authorization', `Bearer ${tokenManager}`)
      .send({
        nombreCliente: 'Cliente Test',
        emailCliente: 'cliente@test.com',
        comensales: 4,
        fecha: '2026-03-15',
        horaInicio: '21:00',
        mesaId,
      });

    expect(reservaRes.status).toBe(201);
    expect(reservaRes.body.mesaId).toBe(mesaId);

    const segundaReserva = await api
      .post('/api/reservations')
      .set('Authorization', `Bearer ${tokenManager}`)
      .send({
        nombreCliente: 'Cliente Test 2',
        emailCliente: 'cliente2@test.com',
        comensales: 4,
        fecha: '2026-03-15',
        horaInicio: '21:00',
        mesaId,
      });

    expect(segundaReserva.status).toBe(422);
  });
});

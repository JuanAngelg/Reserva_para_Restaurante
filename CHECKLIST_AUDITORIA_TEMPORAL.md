# Checklist temporal de auditoría

## 1. Raíz del proyecto
- [x] `package.json` con scripts para dev/build/start/test/typecheck.
- [x] `tsconfig.json` en modo estricto.
- [x] `vitest.config.ts` configurado para tests backend y frontend.
- [x] `.gitignore` evita artefactos, SQLite temporal y compilados.
- [x] `.env.example` presente.

## 2. Stack y restricciones técnicas
- [x] HTML5 + CSS3 + TypeScript + Node + Express presentes.
- [x] No se usan frameworks frontend tipo React/Angular/Vue.
- [x] CSS personalizado y responsive.
- [x] Tema claro/oscuro implementado.
- [x] i18n ES/EN implementado.
- [x] Base de datos desacoplada mediante adaptador/repositorio.
- [x] Pruebas unitarias e integración backend presentes.
- [x] Pruebas frontend unitarias presentes.
- [ ] Pruebas frontend de integración/E2E no detectadas aún (opcional si el curso las pide).

## 3. Backend hexagonal
- [x] Dominio separado en `src/domain`.
- [x] Aplicación separada en `src/application`.
- [x] Infraestructura separada en `src/infrastructure`.
- [x] API REST documentada con OpenAPI/Swagger.
- [x] JWT + RBAC + validaciones con Zod.
- [x] Manejo de errores centralizado.
- [x] Adaptador externo para calendario (`GoogleCalendarAdapter`).
- [x] Persistencia SQLite con repositorios.

## 4. Frontend MVC
- [x] MVC nativo con `models`, `views` y `controllers`.
- [x] Componentes reutilizables nativos (`app-header`, `BaseView`).
- [x] Menú dinámico por rol.
- [x] Rutas por hash y control de acceso en el cliente.
- [x] Soporte de tema claro/oscuro.
- [x] Soporte de i18n ES/EN.
- [x] Formularios básicos y accesibles.
- [x] Diseño visual actualizado con un layout más profesional y coherente.

## 5. Negocio del sistema
- [x] Registro / Login / Logout.
- [x] Perfil / cambio de contraseña / recuperación.
- [x] CRUD de mesas.
- [x] Verificación de disponibilidad.
- [x] Creación / cancelación / cambio de estado de reservas.
- [x] Plano visual simplificado de mesas.
- [x] Reportes de ocupación y no-shows.
- [x] Asignación inteligente de mesa.

## 6. Evidencias / pruebas
- [x] Typecheck backend y frontend ejecutado sin errores.
- [x] Suite Vitest pasa.
- [x] Smoke test backend verificado manualmente.
- [x] Frontend compila a `frontend/dist`.
- [ ] No se detectaron aún pruebas E2E visuales del frontend (pendiente opcional).

## 7. Observaciones de auditoría
- [x] El frontend ya se rediseñó para verse más profesional y terminado.
- [x] El proyecto usa SQLite local y WAL para concurrencia.
- [x] La lógica de reservas evita overbooking con transacciones.
- [x] La API está lista para exposición académica.

## 8. Cierre provisional de auditoría
- [x] El backend cumple la arquitectura hexagonal requerida.
- [x] El frontend cumple MVC nativo con componentes reutilizables.
- [x] La comunicación backend/frontend es REST.
- [x] Hay soporte claro/oscuro e i18n.
- [x] Hay pruebas unitarias e integración verificadas.
- [x] Pendiente principal resuelta: mejorar el diseño visual del frontend para que se vea más profesional y terminado.
- [ ] Pendiente secundario: añadir pruebas E2E o de integración frontend si el curso lo exige explícitamente.



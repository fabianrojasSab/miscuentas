# Mis Cuentas

Aplicación web para la gestión y administración de finanzas personales.

Permite a los usuarios registrar y administrar ingresos, gastos, categorías, cuentas bancarias y períodos, así como visualizar la información correspondiente a sus gastos e ingresos.

El proyecto está desarrollado con **React/Next.js**, **TypeScript** y **MySQL**.

---

## Características

- Registro e inicio de sesión de usuarios.
- Creación y administración de ingresos.
- Creación y administración de gastos.
- Gestión de categorías de gastos.
- Gestión de cuentas bancarias.
- Creación y administración de períodos.
- Visualización de gastos asociados a períodos.
- Estados de gastos:
  - Pendiente.
  - Pago.
- Dashboard para visualizar la información financiera del usuario.
- Migraciones de base de datos.
- Seed inicial para la creación de datos necesarios para el funcionamiento de la aplicación.

---

## Tecnologías utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [MySQL](https://www.mysql.com/)
- [mysql2](https://www.npmjs.com/package/mysql2)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- Tailwind CSS
- shadcn/ui

---

# Requisitos previos

Antes de ejecutar el proyecto debes tener instalado:

- Node.js
- npm
- MySQL

Puedes verificar las versiones instaladas con:

```bash
node -v
npm -v
mysql --version
```

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

Ingresar a la carpeta del proyecto:

```bash
cd miscuentas
```

---

## 2. Instalar las dependencias

Ejecuta:

```bash
npm i
```

Este comando instalará todas las dependencias necesarias definidas en el archivo:

```text
package.json
```

---

# Configuración de la base de datos

La aplicación utiliza **MySQL** como sistema de gestión de base de datos.

Primero debes crear una base de datos:

```sql
CREATE DATABASE micuentabd;
```

Después configura las variables de entorno.

Crea un archivo:

```text
.env.local
```

o utiliza el archivo de variables de entorno definido en el proyecto.

Ejemplo:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=TU_PASSWORD
DB_NAME=micuentabd

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=123
```

### Variables de entorno

| Variable | Descripción |
|---|---|
| `DB_HOST` | Dirección del servidor MySQL |
| `DB_PORT` | Puerto de MySQL |
| `DB_USER` | Usuario de MySQL |
| `DB_PASSWORD` | Contraseña de MySQL |
| `DB_NAME` | Nombre de la base de datos |
| `ADMIN_EMAIL` | Correo del usuario administrador inicial |
| `ADMIN_PASSWORD` | Contraseña del usuario administrador inicial |

Ejemplo para una instalación local:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=123456
DB_NAME=miscuentas

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=123
```

> ⚠️ No subas tu archivo `.env.local` ni archivos que contengan contraseñas al repositorio.

---

# Migraciones

Después de instalar las dependencias y configurar la base de datos, ejecuta las migraciones:

```bash
npm run migrate
```

Este comando crea la estructura necesaria en la base de datos.

Las migraciones se encuentran en:

```text
db/migrations/
```

Estas incluyen las tablas necesarias para el funcionamiento de la aplicación, como:

```text
users
bank_accounts
incomes
bank_account_incomes
expense_categories
expense_states
expenses
periods
period_expenses
transactions
sessions
```

El sistema de migraciones registra cuáles archivos ya fueron ejecutados para evitar ejecutar nuevamente una migración completada.

Ejemplo de salida:

```text
🚀 Ejecutando migración: 0001_create_users.sql
✅ Migración completada: 0001_create_users.sql

🚀 Ejecutando migración: 0002_create_bank_accounts.sql
✅ Migración completada: 0002_create_bank_accounts.sql
```

Si una migración ya fue ejecutada:

```text
⏭️ Migración ya ejecutada: 0001_create_users.sql
```

---

# Seed de datos iniciales

Después de ejecutar las migraciones, debes ejecutar:

```bash
npm run seed
```

El seed crea los datos iniciales requeridos por la aplicación.

Actualmente incluye datos como:

- Estados de gastos.
- Usuario administrador inicial.

Por ejemplo:

```text
Pendiente
Pago
```

También crea o actualiza el usuario administrador utilizando:

```env
ADMIN_EMAIL
ADMIN_PASSWORD
```

Ejemplo de ejecución:

```text
Seed completado con éxito ✅
```

---

# ▶Ejecutar la aplicación

Después de realizar la instalación, las migraciones y el seed, inicia el proyecto:

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:3000
```

---

# Proceso completo de instalación

Para una nueva instalación, ejecuta los siguientes comandos en orden:

```bash
npm i
```

```bash
npm run migrate
```

```bash
npm run seed
```

Finalmente:

```bash
npm run dev
```

El flujo completo es:

```text
npm i
   ↓
Instalar dependencias
   ↓
npm run migrate
   ↓
Crear estructura de la base de datos
   ↓
npm run seed
   ↓
Crear datos iniciales
   ↓
npm run dev
   ↓
Iniciar aplicación
```

---

# Estructura general del proyecto

La estructura principal del proyecto está organizada de forma similar a:

```text
miscuentas/
│
├── db/
│   ├── migrations/
│   │   ├── 0001_create_users.sql
│   │   ├── ...
│   │
│   └── index.ts
│
├── scripts/
│   ├── migrate.ts
│   └── seed.ts
│
├── src/
│   ├── components/
│   │   ├── Income/
│   │   ├── Expenses/
│   │   ├── Periods/
│   │   └── ...
│   │
│   ├── pages/
│   │   ├── api/
│   │   │   ├── incomes/
│   │   │   ├── expenses/
│   │   │   ├── periods/
│   │   │   ├── periodExpenses/
│   │   │   └── ...
│   │
│   │   └── user/
│   │
│   ├── lib/
│   └── types/
│
├── package.json
└── README.md
```

> La estructura puede variar dependiendo de la organización actual del proyecto.

---

# API

La aplicación utiliza endpoints internos para comunicarse con la base de datos.

Algunos de los recursos principales son:

| Recurso | Descripción |
|---|---|
| `/api/incomes` | Administración de ingresos |
| `/api/expenses` | Administración de gastos |
| `/api/periods` | Administración de períodos |
| `/api/periodExpenses` | Gastos asociados a períodos |
| `/api/me` | Información del usuario autenticado |

Los endpoints utilizan diferentes métodos HTTP según la operación:

```text
GET     → Consultar información
POST    → Crear información
PUT     → Actualizar información
DELETE  → Eliminar información
```

Ejemplo:

```text
GET /api/incomes
```

Consulta los ingresos correspondientes al usuario autenticado.

---

# Autenticación y sesiones

La aplicación utiliza un sistema de autenticación basado en sesiones.

El usuario debe autenticarse para acceder a las funcionalidades protegidas.

Las solicitudes a los endpoints verifican la sesión mediante cookies y validan el usuario asociado al token de sesión.

El flujo general es:

```text
Usuario
   ↓
Inicio de sesión
   ↓
Creación de sesión
   ↓
Cookie de sesión
   ↓
Solicitud a API
   ↓
Validación del token
   ↓
Obtención del usuario
   ↓
Respuesta
```

---

# Tipos de usuario

La aplicación contempla usuarios con diferentes permisos.

El campo:

```text
sw_admin
```

permite identificar si el usuario tiene permisos de administrador.

De esta forma, las consultas pueden variar según el usuario autenticado.

Ejemplo:

```text
Usuario normal
    ↓
Consulta únicamente su información

Administrador
    ↓
Puede realizar consultas administrativas
```

---

# Gestión de ingresos

Los usuarios pueden:

- Crear ingresos.
- Consultar sus ingresos.
- Actualizar ingresos.
- Eliminar ingresos.

Los ingresos incluyen información como:

```text
Monto
Fecha
Descripción
Usuario
Fecha de creación
Fecha de actualización
```

---

# Gestión de gastos

Los gastos pueden ser configurados por el usuario y asociados posteriormente a períodos específicos.

El dashboard valida los períodos actuales y consulta los gastos correspondientes al usuario.

Cuando corresponde, los gastos configurados pueden ser registrados para el período actual.

---

# Gestión de períodos

La aplicación maneja diferentes tipos de períodos:

- Anual.
- Mensual.
- Semanal.
- Diario.

Dependiendo del tipo de período, se almacena la información correspondiente en campos como:

```text
year
month
week
day
```

Esto permite realizar consultas específicas, por ejemplo:

```text
Período del año actual
Período del mes actual
Período semanal
Período diario
```

---

# Base de datos

La aplicación utiliza MySQL y mantiene la estructura de la base de datos mediante migraciones.

El proceso recomendado para crear o desplegar una nueva instancia es:

```text
Crear base de datos
        ↓
Configurar variables de entorno
        ↓
Ejecutar migraciones
        ↓
Ejecutar seed
        ↓
Iniciar aplicación
```

---

# Despliegue

Para que la aplicación pueda funcionar correctamente en un nuevo entorno, deben ejecutarse los siguientes comandos:

```bash
npm i
```

```bash
npm run migrate
```

```bash
npm run seed
```

Posteriormente se debe iniciar o construir la aplicación según la plataforma de despliegue.

Por ejemplo:

```bash
npm run build
```

y:

```bash
npm start
```

## Orden obligatorio del despliegue

```text
1. Instalar dependencias
        ↓
2. Configurar variables de entorno
        ↓
3. Conectar MySQL
        ↓
4. Ejecutar migraciones
        ↓
5. Ejecutar seed
        ↓
6. Construir/Iniciar aplicación
```

Los comandos principales son:

```bash
npm i && npm run migrate && npm run seed
```

---

# Consideraciones importantes

- MySQL debe estar disponible antes de ejecutar las migraciones.
- Las variables de entorno deben estar correctamente configuradas.
- Las migraciones deben ejecutarse antes del seed.
- El seed depende de que las tablas ya hayan sido creadas.
- No se deben ejecutar las migraciones contra una base de datos incorrecta.
- No se deben almacenar contraseñas reales dentro del repositorio.
- Las credenciales de producción deben configurarse mediante variables de entorno.

---

# Scripts principales

Los comandos disponibles pueden incluir:

| Comando | Descripción |
|---|---|
| `npm i` | Instala las dependencias |
| `npm run dev` | Inicia la aplicación en desarrollo |
| `npm run build` | Construye la aplicación para producción |
| `npm start` | Inicia la aplicación en producción |
| `npm run migrate` | Ejecuta las migraciones de MySQL |
| `npm run seed` | Inserta los datos iniciales |

---

# Contribución

Para contribuir al proyecto:

```bash
git checkout -b nombre-de-la-rama
```

Realiza los cambios necesarios y posteriormente:

```bash
git add .
git commit -m "Descripción de los cambios"
git push origin nombre-de-la-rama
```

---

# Licencia

Este proyecto se encuentra destinado al desarrollo y aprendizaje de una aplicación de gestión financiera.
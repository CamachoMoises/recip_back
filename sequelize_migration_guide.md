# Guía de Migraciones con Sequelize CLI

> Proyecto: `recip_backend` — Node.js + Express + Sequelize + MySQL  
> Contexto: el proyecto usa `"type": "module"` en `package.json`, por lo que los archivos del CLI deben ser `.cjs`.

---

## Configuración del proyecto

### Archivos clave

```
recip_backend/
├── config/
│   └── database.cjs        ← credenciales de BD para el CLI
├── migrations/
│   └── XXXX-nombre.cjs     ← archivos de migración (siempre .cjs)
├── seeders/                ← archivos de seed (ej: 20260530100002-seed-attendance-status.cjs)
└── package.json            ← scripts de migración definidos aquí
```

### Scripts en `package.json`

```json
{
  "scripts": {
    "migrate": "sequelize-cli db:migrate --config config/database.cjs --migrations-path migrations --models-path models --seeders-path seeders",
    "migrate:undo": "sequelize-cli db:migrate:undo --config config/database.cjs --migrations-path migrations --models-path models --seeders-path seeders",
    "migrate:generate": "sequelize-cli migration:generate --migrations-path migrations",
    "seed": "sequelize-cli db:seed:all --config config/database.cjs --migrations-path migrations --models-path models --seeders-path seeders",
    "seed:undo": "sequelize-cli db:seed:undo --config config/database.cjs --migrations-path migrations --models-path models --seeders-path seeders"
  }
}
```

---

## Flujo de trabajo estándar

### 1. Generar una migración

```bash
npm run migrate:generate -- --name nombre-descriptivo
```

Ejemplos de nombres descriptivos:
```bash
npm run migrate:generate -- --name create-user-suggestion
npm run migrate:generate -- --name add-status-to-course
npm run migrate:generate -- --name remove-flag-from-user
```

### 2. Renombrar a `.cjs` (obligatorio)

El archivo generado tendrá extensión `.js`, hay que renombrarlo:

```bash
# PowerShell
Rename-Item migrations/XXXX-nombre-descriptivo.js migrations/XXXX-nombre-descriptivo.cjs
```

### 3. Editar el archivo de migración

Abre el archivo `.cjs` y completa las funciones `up` y `down`.

### 4. Ejecutar la migración

```bash
npm run migrate
```

---

## Casos de uso comunes

### Crear una tabla nueva

```js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('nombre_tabla', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      title: {
        type: Sequelize.STRING(500),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('nombre_tabla');
  },
};
```

---

### Agregar una columna a tabla existente

```js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('nombre_tabla', 'nueva_columna', {
      type: Sequelize.STRING(255),
      allowNull: true,       // ← siempre true para no romper registros existentes
      defaultValue: null,
      after: 'columna_referencia', // opcional: posición en MySQL
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('nombre_tabla', 'nueva_columna');
  },
};
```

---

### Eliminar una columna

```js
'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('nombre_tabla', 'columna_a_eliminar');
  },

  async down(queryInterface, Sequelize) {
    // Restaurar la columna si se hace undo
    await queryInterface.addColumn('nombre_tabla', 'columna_a_eliminar', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },
};
```

---

### Modificar una columna existente

```js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('nombre_tabla', 'nombre_columna', {
      type: Sequelize.STRING(1000), // cambiar tamaño
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('nombre_tabla', 'nombre_columna', {
      type: Sequelize.STRING(500), // valor original
      allowNull: false,
    });
  },
};
```

---

### Renombrar una columna

```js
'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.renameColumn('nombre_tabla', 'nombre_viejo', 'nombre_nuevo');
  },

  async down(queryInterface) {
    await queryInterface.renameColumn('nombre_tabla', 'nombre_nuevo', 'nombre_viejo');
  },
};
```

---

### Agregar un índice

```js
'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex('nombre_tabla', ['columna1', 'columna2'], {
      name: 'idx_tabla_columna1_columna2',
      unique: false, // true si es único
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('nombre_tabla', 'idx_tabla_columna1_columna2');
  },
};
```

---

## Comandos de referencia rápida

| Acción | Comando |
|--------|---------|
| Generar migración | `npm run migrate:generate -- --name nombre` |
| Ejecutar migraciones pendientes | `npm run migrate` |
| Deshacer última migración | `npm run migrate:undo` |
| Deshacer hasta migración específica | ver abajo |
| Deshacer todas las migraciones | ver abajo |
| Ver estado de migraciones | ver abajo |
| Ejecutar seeds | `npm run seed` |
| Deshacer último seed | `npm run seed:undo` |

### Comandos avanzados (con parámetros completos)

```bash
# Ver cuáles migraciones han sido aplicadas
npx sequelize-cli db:migrate:status --config config/database.cjs --migrations-path migrations

# Deshacer hasta una migración específica (las posteriores se revierten)
npx sequelize-cli db:migrate:undo:all --to 20260523093607-create-user-suggestion.cjs --config config/database.cjs --migrations-path migrations

# Deshacer TODAS las migraciones (⚠️ peligroso en producción)
npx sequelize-cli db:migrate:undo:all --config config/database.cjs --migrations-path migrations
```

---

## ¿Qué hace `migrate:undo`?

Ejecuta la función `down` de la **última migración aplicada**.

```
migrate        → ejecuta up()   → aplica el cambio
migrate:undo   → ejecuta down() → revierte el cambio
```

> ⚠️ El `down` de una migración que crea una tabla hace `dropTable`, lo que **elimina todos los datos** de esa tabla. Usar con precaución en producción.

---

## Buenas prácticas

- **Nunca edites** una migración que ya fue ejecutada en producción. Crea una nueva.
- El `down` siempre debe ser el **inverso exacto** del `up`.
- Usa `allowNull: true` al agregar columnas a tablas con datos existentes.
- Haz **backup** de la BD antes de correr migraciones en producción.
- Los nombres de migración deben ser descriptivos: `add-status-to-course`, no `update-course`.
- Sequelize registra las migraciones ejecutadas en la tabla `SequelizeMeta` — no la toques manualmente.

---

## Tipos de datos más usados

```js
Sequelize.INTEGER
Sequelize.BIGINT
Sequelize.FLOAT
Sequelize.DECIMAL(10, 2)
Sequelize.STRING(255)      // VARCHAR
Sequelize.TEXT             // TEXT largo
Sequelize.BOOLEAN
Sequelize.DATE             // DATETIME
Sequelize.DATEONLY         // DATE sin hora
Sequelize.UUID
Sequelize.JSON
Sequelize.ENUM('valor1', 'valor2')
```
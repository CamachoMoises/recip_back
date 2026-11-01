'use strict';

/**
 * Orden manual de cursos (`course.row_order`).
 *
 * La columna se llama `row_order` y no `order` para no depender de comillas en
 * SQL crudo (`ORDER` es palabra reservada en MySQL). El objetivo es el mismo que
 * `subject.order`: un entero 1..N que define el orden de presentacion.
 *
 * El orden es GLOBAL (la lista de cursos no cuelga de otro registro), asi que no
 * hay indice unico: los empates se resuelven con `id ASC` como desempate
 * determinista. Solo el endpoint `PUT /api/courses/order` reasigna valores; un
 * `POST` nuevo recibe `MAX(row_order) + 1` y un `PUT` normal no toca el orden.
 *
 * Se agrega primero como NULL, se rellena por `id ASC` (1..N) y luego se pasa a
 * NOT NULL: MySQL no permite agregar una columna NOT NULL sin default cuando ya
 * hay filas. La re-ejecucion solo rellena los NULL pendientes (idempotente).
 *
 * NO se ejecuta automaticamente: correr `npm run migrate` manualmente ANTES de
 * desplegar este codigo. Sin la migracion, cualquier SELECT sobre `course` falla
 * con `Unknown column 'course.row_order'`.
 *
 * El indice se crea SOLO aqui y no en `models/course.js` a proposito: `sync`
 * (alter: false) procesa los `indexes` declarados en el modelo, y un CREATE INDEX
 * sobre una columna inexistente haria fallar el arranque del servidor.
 */
const hasColumn = async (queryInterface, table, column) => {
	const description = await queryInterface.describeTable(table);
	return Object.prototype.hasOwnProperty.call(description, column);
};

const hasIndex = async (queryInterface, table, indexName) => {
	const indexes = await queryInterface.showIndex(table);
	return indexes.some((index) => index.name === indexName);
};

module.exports = {
	async up(queryInterface, Sequelize) {
		if (!(await hasColumn(queryInterface, 'course', 'row_order'))) {
			await queryInterface.addColumn('course', 'row_order', {
				type: Sequelize.INTEGER,
				allowNull: true,
				defaultValue: null,
			});
		}

		// Rellena solo las filas sin valor, continuando desde el maximo actual:
		// asi una segunda ejecucion no reordena lo que el usuario ya ordeno.
		await queryInterface.sequelize.transaction(async (transaction) => {
			const [maxRows] = await queryInterface.sequelize.query(
				'SELECT COALESCE(MAX(`row_order`), 0) AS maxOrder FROM `course`',
				{ transaction },
			);
			let nextOrder = Number(maxRows[0].maxOrder) + 1;

			const [pending] = await queryInterface.sequelize.query(
				'SELECT `id` FROM `course` WHERE `row_order` IS NULL ORDER BY `id` ASC',
				{ transaction },
			);

			for (const row of pending) {
				await queryInterface.sequelize.query(
					'UPDATE `course` SET `row_order` = ? WHERE `id` = ?',
					{
						replacements: [nextOrder, row.id],
						transaction,
					},
				);
				nextOrder += 1;
			}
		});

		const description = await queryInterface.describeTable('course');
		if (description.row_order.allowNull !== false) {
			await queryInterface.changeColumn('course', 'row_order', {
				type: Sequelize.INTEGER,
				allowNull: false,
			});
		}

		if (!(await hasIndex(queryInterface, 'course', 'idx_course_row_order'))) {
			await queryInterface.addIndex('course', ['row_order'], {
				name: 'idx_course_row_order',
			});
		}
	},

	async down(queryInterface) {
		if (
			await hasIndex(queryInterface, 'course', 'idx_course_row_order')
		) {
			await queryInterface.removeIndex(
				'course',
				'idx_course_row_order',
			);
		}

		if (await hasColumn(queryInterface, 'course', 'row_order')) {
			await queryInterface.removeColumn('course', 'row_order');
		}
	},
};

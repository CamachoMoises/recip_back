'use strict';

/**
 * Fase 2 del soft delete de curso: auditoria + indice de lectura.
 *
 * El predicado sigue siendo UNO SOLO: el curso esta eliminado si y solo si
 * `course.status = 0` (false). `deleted_at` y `deleted_by` son solo auditoria de
 * la ultima eliminacion; ninguna query filtra por ellos y se limpian al reactivar.
 *
 * - `deleted_at`  DATETIME NULL: momento de la ultima eliminacion.
 * - `deleted_by`  INTEGER NULL: `user.id` que elimino. Sin FK a proposito: un
 *   usuario borrado no debe romper la auditoria del curso.
 * - `idx_course_status`: los dashboards y `GET /courses` filtran por `status`.
 *
 * Ademas normaliza `status` NULL a 1 para que `status = 0` sea el unico valor
 * "eliminado" y ningun curso existente quede en un estado ambiguo.
 *
 * Idempotente: se puede correr sobre una BD que ya tenga columnas/indice.
 * NO se ejecuta automaticamente: correr `npm run migrate` manualmente ANTES de
 * desplegar este codigo (el modelo ya declara las columnas y `sync` usa
 * `alter: false`, asi que sin la migracion los SELECT fallan).
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
		if (!(await hasColumn(queryInterface, 'course', 'deleted_at'))) {
			await queryInterface.addColumn('course', 'deleted_at', {
				type: Sequelize.DATE,
				allowNull: true,
				defaultValue: null,
			});
		}

		if (!(await hasColumn(queryInterface, 'course', 'deleted_by'))) {
			await queryInterface.addColumn('course', 'deleted_by', {
				type: Sequelize.INTEGER,
				allowNull: true,
				defaultValue: null,
			});
		}

		// Un curso sin `status` explicito nunca estuvo eliminado: se normaliza a 1.
		await queryInterface.sequelize.query(
			'UPDATE course SET status = 1 WHERE status IS NULL',
		);

		if (!(await hasIndex(queryInterface, 'course', 'idx_course_status'))) {
			await queryInterface.addIndex('course', ['status'], {
				name: 'idx_course_status',
			});
		}
	},

	async down(queryInterface) {
		if (await hasIndex(queryInterface, 'course', 'idx_course_status')) {
			await queryInterface.removeIndex('course', 'idx_course_status');
		}

		if (await hasColumn(queryInterface, 'course', 'deleted_by')) {
			await queryInterface.removeColumn('course', 'deleted_by');
		}

		if (await hasColumn(queryInterface, 'course', 'deleted_at')) {
			await queryInterface.removeColumn('course', 'deleted_at');
		}
	},
};

'use strict';

/**
 * Introduce el modo "sesiones" para cursos programados.
 *
 * - `uses_sessions` = 0 (default, curso legacy): el ordinal `subject_days.day` /
 *   `attendance.day` / `course_group_signature.day_number` es un DIA y el techo del
 *   programa es `course.days`. Comportamiento identico al previo.
 * - `uses_sessions` = 1: ese mismo ordinal es un numero de SESION, el techo del
 *   programa es `course.sessions` y varias sesiones pueden compartir fecha calendario.
 *
 * `sessions` se rellena con `days` para que ningun curso existente quede sin valor
 * (copia derivada, no altera semantica). El discriminador es el flag, no el NULL,
 * asi que ningun consumidor necesita fallback por NULL.
 *
 * NO se ejecuta automaticamente: correr `npm run migrate` manualmente.
 */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('course', 'uses_sessions', {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		});

		await queryInterface.addColumn('course', 'sessions', {
			type: Sequelize.INTEGER,
			allowNull: true,
			defaultValue: null,
		});

		await queryInterface.sequelize.query(
			'UPDATE course SET sessions = days WHERE sessions IS NULL',
		);
	},

	async down(queryInterface) {
		await queryInterface.removeColumn('course', 'sessions');
		await queryInterface.removeColumn('course', 'uses_sessions');
	},
};

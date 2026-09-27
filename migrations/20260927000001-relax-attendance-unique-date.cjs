'use strict';

/**
 * Permite mas de una sesion por dia calendario.
 *
 * `uq_attendance_course_student_date` UNIQUE (course_student_id, date) es lo unico que
 * impede registrar varias sesiones del mismo alumno en la misma fecha. Se reemplaza por:
 *
 *   - `idx_attendance_course_student_date` (no unico): mantiene la aceleracion de busqueda.
 *   - `uq_attendance_course_student_date_day` UNIQUE (course_student_id, date, day):
 *     clave estrictamente mas fuerte que la anterior para los datos existentes (agrega
 *     `day`), por lo que la integridad legacy queda preservada mientras ahora se admiten
 *     N sesiones por fecha.
 *
 * `attendance.day` sigue NOT NULL y conserva `uq_attendance_course_student_day`: en modo
 * sesiones el ordinal es el numero de sesion, que desambigua las sesiones de una fecha.
 *
 * Los indices se agregan/eliminan de forma idempotente: `20260530100001-create-attendance.cjs`
 * nunca creo el indice viejo (solo esta declarado en el model), asi que puede no existir en
 * la base, y este archivo se puede reintentar sin dejar estado parcial.
 *
 * OJO con `SHOW INDEX`: no acepta `replacements` de Sequelize (los convierte a literales y
 * MySQL rechaza `SHOW INDEX FROM 'attendance'`). Se arma el SQL con `quoteIdentifier` +
 * `sequelize.escape`.
 *
 * NO se ejecuta automaticamente: correr `npm run migrate` manualmente.
 */

const indexExists = async (queryInterface, tableName, indexName) => {
	const { sequelize } = queryInterface;
	const [rows] = await sequelize.query(
		'SHOW INDEX FROM ' +
			queryInterface.quoteIdentifier(tableName) +
			' WHERE Key_name = ' +
			sequelize.escape(indexName),
	);
	return rows.length > 0;
};

module.exports = {
	async up(queryInterface) {
		const OLD = 'uq_attendance_course_student_date';
		const PLAIN = 'idx_attendance_course_student_date';
		const NEW = 'uq_attendance_course_student_date_day';

		if (await indexExists(queryInterface, 'attendance', OLD)) {
			await queryInterface.removeIndex('attendance', OLD);
		}

		if (!(await indexExists(queryInterface, 'attendance', PLAIN))) {
			await queryInterface.addIndex(
				'attendance',
				['course_student_id', 'date'],
				{ name: PLAIN, unique: false },
			);
		}

		if (!(await indexExists(queryInterface, 'attendance', NEW))) {
			await queryInterface.addIndex(
				'attendance',
				['course_student_id', 'date', 'day'],
				{ name: NEW, unique: true },
			);
		}
	},

	async down(queryInterface) {
		const OLD = 'uq_attendance_course_student_date';
		const PLAIN = 'idx_attendance_course_student_date';
		const NEW = 'uq_attendance_course_student_date_day';

		if (await indexExists(queryInterface, 'attendance', NEW)) {
			await queryInterface.removeIndex('attendance', NEW);
		}
		if (await indexExists(queryInterface, 'attendance', PLAIN)) {
			await queryInterface.removeIndex('attendance', PLAIN);
		}

		// Falla aca si ya existen varias sesiones en la misma fecha: en ese caso el modo
		// sesiones ya esta en uso y la vuelta a la restriccion no es automatica.
		await queryInterface.addIndex(
			'attendance',
			['course_student_id', 'date'],
			{ name: OLD, unique: true },
		);
	},
};

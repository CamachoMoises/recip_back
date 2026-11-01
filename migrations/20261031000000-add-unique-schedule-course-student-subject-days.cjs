'use strict';

/**
 * Evita registrar dos horarios para la misma actividad del programa de un alumno.
 *
 * Clave `(course_student_id, subject_days_id)`: un `subject_days` es una actividad
 * (subject + ordinal día/sesión) del programa del curso, por lo que un alumno no
 * puede tener mas de un horario para esa misma actividad. Es la proteccion a nivel
 * de base de datos contra doble submit/reintentos (la validacion de aplicacion vive
 * en `createSchedule` de `src/database/repositories/course.js`).
 *
 * OJO: esto NO impide el duplicado por "mover la actividad a otro día"; eso se
 * bloquea impidiendo desactivar un `subject_days` que ya tiene horarios
 * (`updateSubjectDay` de `src/database/repositories/subject.js`).
 *
 * Idempotente: se puede reintentar sin dejar estado parcial. Si existieran filas
 * duplicadas previas, el alta del indice falla con el detalle de los duplicados.
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

const duplicateGroups = async (queryInterface) => {
	const { sequelize } = queryInterface;
	const [rows] = await sequelize.query(
		'SELECT course_student_id, subject_days_id, COUNT(*) AS total ' +
			'FROM ' +
			queryInterface.quoteIdentifier('schedule') +
			' GROUP BY course_student_id, subject_days_id HAVING total > 1 LIMIT 20',
	);
	return rows;
};

module.exports = {
	async up(queryInterface) {
		const INDEX = 'uq_schedule_course_student_subject_days';

		if (await indexExists(queryInterface, 'schedule', INDEX)) {
			return;
		}

		const duplicates = await duplicateGroups(queryInterface);
		if (duplicates.length > 0) {
			throw new Error(
				'No se puede crear ' +
					INDEX +
					': existen horarios duplicados por (course_student_id, subject_days_id): ' +
					JSON.stringify(duplicates) +
					'. Limpia los duplicados y vuelve a correr la migracion.',
			);
		}

		await queryInterface.addIndex(
			'schedule',
			['course_student_id', 'subject_days_id'],
			{ name: INDEX, unique: true },
		);
	},

	async down(queryInterface) {
		const INDEX = 'uq_schedule_course_student_subject_days';
		if (await indexExists(queryInterface, 'schedule', INDEX)) {
			await queryInterface.removeIndex('schedule', INDEX);
		}
	},
};

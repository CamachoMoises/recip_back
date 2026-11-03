'use strict';

/**
 * Corrige `course.hours` de los cursos de entrenamiento (`course_type_id = 2`).
 *
 * El calculo anterior multiplicaba 8 horas por CADA `subject_days` activo. Como
 * un mismo dia del programa suele tener varias fases (Briefing, Vuelo,
 * Debriefing, etc.), el total se inflaba: el curso 29 terminaba con 25
 * actividades x 8 = 200 h para un programa de solo 3 dias.
 *
 * La regla vigente (la misma que aplica `calculateCourseTotalHours`) es 8 horas
 * por dia/sesion del programa:
 *
 *   8 * (uses_sessions ? COALESCE(sessions, days) : days)
 *
 * Solo toca `course_type_id = 2`; los demas tipos conservan su formula de
 * secciones. Es idempotente: recalcular sobre el mismo programa da el mismo
 * resultado.
 *
 * NO se ejecuta automaticamente. Correr `npm run migrate` manualmente para
 * corregir los cursos ya existentes al desplegar este cambio.
 */
module.exports = {
	async up(queryInterface) {
		await queryInterface.sequelize.transaction(async (transaction) => {
			await queryInterface.sequelize.query(
				`UPDATE \`course\`
				 SET \`hours\` = 8 * COALESCE(
					CASE
						WHEN \`uses_sessions\` = 1 THEN \`sessions\`
						ELSE \`days\`
					END,
					\`days\`,
					0
				 )
				 WHERE \`course_type_id\` = 2`,
				{ transaction },
			);
		});
	},

	// Backfill de datos: no hay forma de reconstruir los totales inflados
	// anteriores, y no son un estado valido. Se deja como no-op.
	async down() {},
};

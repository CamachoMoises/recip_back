'use strict';

/**
 * Corrige `course.hours` de los cursos "Experiencia Reciente"
 * (`course_type_id = 2` + `course_level_id = 4`).
 *
 * La regla de 8 h por día/sesión aplica a los cursos de Entrenamiento de
 * jornada completa (Inicial/Periódico/Especial). Los cursos de "Experiencia
 * Reciente" (PIC/PI) son experiencias cortas cuya carga real la define el
 * programa: Briefing 1h + Vuelo 1h + Debriefing 1h = 3 h (cursos 23 y 24,
 * ambos con 1 día de programa).
 *
 * La regla vigente (la misma que aplica `calculateCourseTotalHours`) para ese
 * nivel es la suma de secciones, idéntica a la del resto de tipos:
 *
 *   SUM(subject.hours * (# subject_days activos de esa sección))
 *
 * Solo toca `course_type_id = 2 AND course_level_id = 4`; el resto de los
 * cursos de Entrenamiento conserva 8 × días/sesiones del programa. Es
 * idempotente: recalcular sobre el mismo programa da el mismo resultado.
 *
 * NO se ejecuta automáticamente. Correr `npm run migrate` manualmente para
 * corregir los cursos ya existentes al desplegar este cambio.
 */
module.exports = {
	async up(queryInterface) {
		await queryInterface.sequelize.transaction(async (transaction) => {
			await queryInterface.sequelize.query(
				`UPDATE \`course\` c
				 SET \`hours\` = COALESCE(
					(SELECT SUM(s.\`hours\` * (
						SELECT COUNT(*)
						FROM \`subject_days\` sd
						WHERE sd.\`subject_id\` = s.\`id\`
							AND sd.\`status\` = 1
					))
					FROM \`subject\` s
					WHERE s.\`course_id\` = c.\`id\`
				), 0)
				 WHERE c.\`course_type_id\` = 2
					AND c.\`course_level_id\` = 4`,
				{ transaction },
			);
		});
	},

	// Backfill de datos: el 8 × días anterior no es un estado válido para este
	// nivel. Se deja como no-op.
	async down() {},
};

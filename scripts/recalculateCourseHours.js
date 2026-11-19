import 'dotenv/config';
import { sequelize } from '../src/database/index.js';
import { calculateCourseTotalHours } from '../src/controller/course.js';
import { getAllCourses } from '../src/database/repositories/course.js';

/*
 * Recalcula `course.hours` de todos los cursos (incluye los eliminados) usando
 * `calculateCourseTotalHours`: la misma función que ya usan CreateCourse,
 * UpdateCourse, CloneCourse, UpdateSubject y ChangeStatusDayFunc. La regla no
 * se duplica en SQL.
 *
 * Uso:
 *   npm run recalculate:course-hours
 *   node scripts/recalculateCourseHours.js
 *   node scripts/recalculateCourseHours.js --course-id 29
 *
 * Este script SÍ escribe en la base de datos. Solo debe ejecutarlo el dueño del
 * proyecto, después de desplegar el cambio de la regla de horas.
 */

const parseArgs = (argv) => {
	let courseId = null;
	for (let i = 0; i < argv.length; i += 1) {
		const arg = argv[i];
		if (arg === '--course-id') {
			courseId = Number(argv[++i]);
			if (!Number.isInteger(courseId) || courseId <= 0) {
				throw new Error('--course-id debe ser un entero positivo');
			}
		} else if (arg === '--help' || arg === '-h') {
			console.log(
				'Uso: node scripts/recalculateCourseHours.js [--course-id <id>]',
			);
			process.exit(0);
		} else {
			throw new Error(`Argumento desconocido: ${arg}`);
		}
	}
	return courseId;
};

const main = async () => {
	const courseId = parseArgs(process.argv.slice(2));
	const courses = await getAllCourses({ include_inactive: true });
	const targets = courseId
		? courses.filter((course) => course.id === courseId)
		: courses;

	if (targets.length === 0) {
		throw new Error(
			courseId
				? `No existe el curso ${courseId}`
				: 'No hay cursos para recalcular',
		);
	}

	let changed = 0;
	for (const course of targets) {
		const before = Number(course.hours) || 0;
		const after = await calculateCourseTotalHours(course.id);
		if (before !== after) changed += 1;
		console.log(
			`curso ${course.id} (${course.name}): ${before} h -> ${after} h`,
		);
	}

	console.log(
		`Recalculados ${targets.length} curso(s); ${changed} cambiaron de horas.`,
	);
};

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await sequelize.close();
	});

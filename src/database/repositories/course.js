import { Op, Sequelize } from 'sequelize';
import { models, sequelize } from '../index.js';
import { getCourseStudentIdsByInstructor } from './instructor.js';

const {
	Course,
	CourseType,
	CourseLevel,
	CourseStudent,
	CourseStudentTest,
	CourseStudentAssessment,
	CourseGroup,
	SubjectDays,
	SubjectLesson,
	SubjectLessonDays,
	Subject,
	Student,
	Test,
	Instructor,
	User,
	Schedule,
	Attendance,
	AttendanceSignature,
} = models;

const getAllCourses = async (filters) => {
	const whereClause = {};
	if (filters.name) {
		whereClause.name = { [Op.like]: `%${filters.name}%` };
	}
	if (filters.description) {
		whereClause.description = {
			[Op.like]: `%${filters.description}%`,
		};
	}
	if (filters.course_type_id) {
		whereClause.course_type_id = filters.course_type_id;
	}
	if (filters.course_level_id) {
		whereClause.course_level_id = filters.course_level_id;
	}
	/*
	 * Fase 3: el listado por defecto oculta los cursos eliminados (soft delete).
	 * El front pide `include_inactive=true` para verlos en la pantalla de
	 * configuración y poder reactivarlos. Sin ese flag un curso eliminado quedaría
	 * inalcanzable en la UI, por eso el front debe enviarlo.
	 *
	 * `status NULL` nunca estuvo eliminado (la migración lo normaliza a 1), así que
	 * se incluye explícitamente: `status <> 0` por sí solo descartaría los NULL.
	 */
	const includeInactive =
		filters.include_inactive === true ||
		filters.include_inactive === 1 ||
		filters.include_inactive === 'true' ||
		filters.include_inactive === '1';
	if (!includeInactive) {
		whereClause[Op.or] = [
			{ status: null },
			{ status: { [Op.ne]: false } },
		];
	}
	const data = Course.findAll({
		include: [CourseType, CourseLevel],
		where: whereClause,
		// Orden manual (1..N). `id ASC` es el desempate determinista: dos cursos
		// creados a la vez podrían compartir `row_order` hasta el próximo reorder.
		order: [
			['row_order', 'ASC'],
			['id', 'ASC'],
		],
	});
	return data;
};

const getAllCoursesStudent = async (filters) => {
	const whereClause = {};
	if (filters.course_type_id) {
		whereClause.id = filters.course_type_id;
	}
	const courseStudentWhere = {};
	if (filters.status !== undefined && filters.status !== '') {
		courseStudentWhere.status =
			filters.status === 'true' ? true : false;
	}
	if (filters.course_group_id) {
		courseStudentWhere.course_group_id = filters.course_group_id;
	}
	if (filters.course_id) {
		courseStudentWhere.course_id = filters.course_id;
	}
	if (filters.student_id) {
		courseStudentWhere.student_id = filters.student_id;
	}
	if (filters.instructor_id) {
		const csIds = await getCourseStudentIdsByInstructor(
			filters.instructor_id,
		);
		if (csIds.length === 0) {
			return {
				data: [],
				totalItems: 0,
				currentPage: parseInt(filters.currentPage) || 1,
				pageSize: parseInt(filters.pageSize) || 10,
				totalPages: 0,
			};
		}
		courseStudentWhere.id = { [Op.in]: csIds };
	}
	// Calculamos el offset basado en currentPage y pageSize
	const pageSize = parseInt(filters.pageSize) || 10; // Valor por defecto 10
	const currentPage = parseInt(filters.currentPage) || 1; // Valor por defecto 1
	const offset = (currentPage - 1) * pageSize;

	const courseStudent = await CourseStudent.findAndCountAll({
		distinct: true,
		col: 'id',
		where: courseStudentWhere,
		attributes: {
			include: [
				[
					Sequelize.literal(`(
                    SELECT MAX(cst.score)
                    FROM course_student_test AS cst
                    WHERE cst.course_student_id = course_student.id
                )`),
					'highest_score',
				],
			],
		},
		include: [
			{
				model: Student,
				required: 'id' in whereClause ? true : false,
				include: [{ model: User }],
			},
			{
				model: CourseGroup,
				required: false,
			},
			{
				model: Course,
				required: true,
				include: [
					{
						model: CourseType,
						where: whereClause,
						required: true,
					},
					{
						model: CourseLevel,
					},
				],
			},
			{
				model: CourseStudentTest,
				where: {
					course_student_id: {
						[Op.eq]: Sequelize.col('course_student.id'),
					},
				},
				required: false,
			},
			{
				model: CourseStudentAssessment,
				where: {
					course_student_id: {
						[Op.eq]: Sequelize.col('course_student.id'),
					},
				},
				required: false,
			},
			{
				model: Schedule,
				include: [
					{
						model: Subject,
						where:
							whereClause.id == 1
								? {
										name: { [Op.like]: `%examen%` },
									}
								: {},
						required: whereClause.id == 1,
					},
					{
						model: Instructor,
						include: [{ model: User }],
					},
					{
						model: SubjectDays,
						required: false,
					},
				],
			},
		],
		order: [['createdAt', 'DESC']],
		limit: pageSize,
		offset: offset,
	});
	return {
		data: courseStudent.rows,
		totalItems: courseStudent.count,
		currentPage: currentPage,
		pageSize: pageSize,
		totalPages: Math.ceil(courseStudent.count / pageSize),
	};
};

const getAllCoursesTypes = async () => CourseType.findAll();
const getAllCoursesLevel = async () => CourseLevel.findAll();

const getCourseStudentById = async (id) =>
	await CourseStudent.findOne({
		where: { id: id },
		include: [
			{
				model: Student,
			},
			{
				model: CourseGroup,
				required: false,
			},
			{
				model: Course,
				include: [CourseType, CourseLevel, Test],
			},
			{
				model: CourseStudentTest,
			},
			{
				model: Schedule,
				include: [
					{
						model: Subject,
						where: {
							name: {
								[Op.like]: `%examen%`,
							},
						},
					},
				],
			},
		],
	});

const getCourseById = async (id) =>
	await Course.findOne({
		where: { id: id },
		include: [CourseType, CourseLevel],
	});

const getCourseTypeById = async (id) =>
	await CourseType.findOne({ where: { id: id } });

const getCourseLevelById = async (id) =>
	await CourseLevel.findOne({ where: { id: id } });

const getCourseProgramSizeByCourseStudent = async (course_student_id) => {
	const courseStudent = await CourseStudent.findOne({
		where: { id: course_student_id },
		include: [{ model: Course }],
	});
	if (!courseStudent) throw new Error('CourseStudent not found');

	const course = courseStudent.Course;
	if (!course) return null;

	const uses_sessions = !!course.uses_sessions;

	return {
		uses_sessions,
		days: course.days,
		sessions: course.sessions,
		total: uses_sessions ? course.sessions : course.days,
	};
};

/*
 * `row_order` es 1..N y global: un curso nuevo siempre va al final. El orden
 * manual solo cambia con `PUT /api/courses/order`, nunca con POST/PUT.
 */
const getNextCourseRowOrder = async (transaction) => {
	const maxRowOrder = await Course.max('row_order', { transaction });
	return Number.isFinite(maxRowOrder) ? maxRowOrder + 1 : 1;
};

const createCourse = async ({
	name,
	description,
	code,
	// hours,
	days,
	uses_sessions,
	sessions,
	course_type_id,
	course_level_id,
	plane_model,
	color,
	status,
}) => {
	const row_order = await getNextCourseRowOrder();
	return Course.create({
		name,
		description,
		code,
		// hours,
		days,
		uses_sessions,
		sessions,
		plane_model,
		color,
		course_type_id,
		course_level_id,
		status,
		row_order,
	});
};

const editCourse = async ({
	id,
	name,
	description,
	code,
	// hours,
	days,
	uses_sessions,
	sessions,
	plane_model,
	color,
	course_type_id,
	course_level_id,
	status,
	deleted_by = null,
}) => {
	const course = await Course.findByPk(id);
	if (!course) {
		throw courseNotFoundError();
	}
	const wasDeleted = course.status === false || course.status === 0;
	await course.update({
		name,
		description,
		code,
		// hours,
		days,
		// Un PUT parcial no debe degradar el curso a modo legacy ni colapsar el
		// techo del programa (attendance y programación dependen de estos valores).
		uses_sessions: uses_sessions ?? course.uses_sessions,
		sessions: sessions ?? course.sessions ?? days,
		course_type_id,
		course_level_id,
		plane_model,
		color,
		status,
		// `status` sigue siendo el predicado; esta auditoría solo lo acompaña.
		// Omitir `status` conserva la auditoría tal cual.
		deleted_at:
			status === false
				? wasDeleted
					? course.deleted_at
					: new Date()
				: status === true
					? null
					: course.deleted_at,
		deleted_by:
			status === false
				? wasDeleted
					? course.deleted_by
					: (deleted_by ?? null)
				: status === true
					? null
					: course.deleted_by,
	});
	return course;
};
const updateCourseHours = async (id, hours) => {
	const course = await Course.findByPk(id);
	if (!course) {
		throw new Error('Course not found');
	}
	await course.update({
		id,
		hours,
	});
};

const COURSE_CODE_MAX_LENGTH = 50;

const buildUniqueCourseCode = async (baseCode, transaction) => {
	const base = String(baseCode).slice(0, COURSE_CODE_MAX_LENGTH);
	let candidate = base;
	let suffix = 2;

	while (await Course.count({ where: { code: candidate }, transaction })) {
		const suffixStr = `-${suffix}`;
		candidate = `${base.slice(
			0,
			COURSE_CODE_MAX_LENGTH - suffixStr.length,
		)}${suffixStr}`;
		suffix += 1;
	}

	return candidate;
};

const cloneCourse = async (course_id, overrides = {}) => {
	return sequelize.transaction(async (transaction) => {
		const source = await Course.findByPk(course_id, { transaction });
		if (!source) {
			throw new Error('Course not found');
		}

		const code =
			overrides.code !== undefined && overrides.code !== null
				? String(overrides.code)
				: await buildUniqueCourseCode(
						`${source.code}-COPIA`,
						transaction,
					);

		// El clon nace al final de la lista: NO hereda `source.row_order` (eso
		// duplicaría la posición del original).
		const row_order = await getNextCourseRowOrder(transaction);

		const newCourse = await Course.create(
			{
				name:
					overrides.name !== undefined &&
					overrides.name !== null
						? overrides.name
						: `${source.name} (copia)`,
				description:
					overrides.description !== undefined &&
					overrides.description !== null
						? overrides.description
						: source.description,
				code,
				hours: source.hours,
				plane_model: source.plane_model,
				color: source.color,
				days: source.days,
				uses_sessions: source.uses_sessions,
				sessions: source.sessions ?? source.days,
				// Un clon nunca hereda el soft delete: nace activo salvo override explícito.
				status: overrides.status ?? true,
				course_type_id: source.course_type_id,
				course_level_id: source.course_level_id,
				row_order,
			},
			{ transaction },
		);

		const subjects = await Subject.findAll({
			where: { course_id },
			transaction,
		});
		const subjectDays = await SubjectDays.findAll({
			where: { course_id },
			transaction,
		});
		const lessons = await SubjectLesson.findAll({
			where: { course_id },
			transaction,
		});
		const lessonDays = await SubjectLessonDays.findAll({
			where: { course_id },
			transaction,
		});

		const subjectIdMap = new Map();
		for (const subject of subjects) {
			const created = await Subject.create(
				{
					order: subject.order,
					name: subject.name,
					hours: subject.hours,
					is_schedulable: subject.is_schedulable,
					status: subject.status,
					course_id: newCourse.id,
				},
				{ transaction },
			);
			subjectIdMap.set(subject.id, created.id);
		}

		const subjectDayIdMap = new Map();
		for (const subjectDay of subjectDays) {
			const newSubjectId = subjectIdMap.get(subjectDay.subject_id);
			if (newSubjectId === undefined) continue;

			const created = await SubjectDays.create(
				{
					subject_id: newSubjectId,
					course_id: newCourse.id,
					day: subjectDay.day,
					classTime: subjectDay.classTime,
					status: subjectDay.status,
				},
				{ transaction },
			);
			subjectDayIdMap.set(subjectDay.id, created.id);
		}

		const lessonIdMap = new Map();
		for (const lesson of lessons) {
			const newSubjectId = subjectIdMap.get(lesson.subject_id);
			if (newSubjectId === undefined) continue;

			const created = await SubjectLesson.create(
				{
					subject_id: newSubjectId,
					course_id: newCourse.id,
					name: lesson.name,
					order: lesson.order,
					status: lesson.status,
				},
				{ transaction },
			);
			lessonIdMap.set(lesson.id, created.id);
		}

		let clonedLessonDays = 0;
		for (const lessonDay of lessonDays) {
			const newSubjectId = subjectIdMap.get(lessonDay.subject_id);
			const newLessonId = lessonIdMap.get(lessonDay.subject_lesson_id);
			const newSubjectDayId = subjectDayIdMap.get(
				lessonDay.subject_days_id,
			);
			if (
				newSubjectId === undefined ||
				newLessonId === undefined ||
				newSubjectDayId === undefined
			) {
				continue;
			}

			await SubjectLessonDays.create(
				{
					course_id: newCourse.id,
					subject_id: newSubjectId,
					subject_lesson_id: newLessonId,
					subject_days_id: newSubjectDayId,
					day: lessonDay.day,
					classTime: lessonDay.classTime,
					status: lessonDay.status,
				},
				{ transaction },
			);
			clonedLessonDays += 1;
		}

		return {
			course: newCourse,
			counts: {
				subjects: subjectIdMap.size,
				subject_days: subjectDayIdMap.size,
				subject_lessons: lessonIdMap.size,
				subject_lesson_days: clonedLessonDays,
			},
		};
	});
};

const createCourseStudent = async (course_id) => {
	let numberCode = 1;
	const prevCourseStudent = await CourseStudent.findOne({
		order: [['createdAt', 'DESC']],
	});
	if (prevCourseStudent) {
		numberCode = prevCourseStudent.id + 1;
	}
	const stringCode = String(numberCode).padStart(8, '0');
	const code = `CP-${stringCode}`;
	const newCourseStudent = await CourseStudent.create({
		course_id,
		code,
	});
	return newCourseStudent;
};

const EDITABLE_COURSE_STUDENT_FIELDS = {
	date: 'date',
	student_id: 'student_id',
	type_trip: 'typeTrip',
	license: 'license',
	regulation: 'regulation',
instructor_code: 'instructorCode',
	course_group_id: 'courseGroupId',
	client: 'client',
};

const editCourseStudent = async (course_student_id, data) => {
	const courseStudent =
		await CourseStudent.findByPk(course_student_id);
	if (!courseStudent) throw new Error('Course not found');

	if (data.courseGroupId !== undefined && data.courseGroupId !== null) {
		const courseGroup = await CourseGroup.findByPk(data.courseGroupId);
		if (!courseGroup) throw new Error('CourseGroup not found');
		if (courseStudent.course_id !== courseGroup.course_id)
			throw new Error(
				'Student course does not match the group course',
			);
	}

	const updateData = {};
	for (const [dbField, reqField] of Object.entries(EDITABLE_COURSE_STUDENT_FIELDS)) {
		if (data[reqField] !== undefined) {
			updateData[dbField] = data[reqField];
		}
	}

	if (Object.keys(updateData).length === 0) return courseStudent;

	await courseStudent.update(updateData);
	return courseStudent;
};

const updateCourseStudentStatus = async (
	course_student_id,
	status,
) => {
	const courseStudent =
		await CourseStudent.findByPk(course_student_id);
	if (!courseStudent) {
		throw new Error('CourseStudent not found');
	}
	await courseStudent.update({
		status,
	});
	return courseStudent;
};
const getScheduleById = async (id) => {
	const schedule = await Schedule.findOne({
		where: {
			id: id,
		},
		include: [
			{
				model: Student,
				include: [{ model: User }],
			},
			{
				model: Instructor,
				include: [{ model: User }],
			},
			{
				model: CourseStudent,
			},
			{
				model: CourseStudent,
			},
			{
				model: SubjectDays,
			},
			{
				model: Subject,
			},
		],
	});

	return schedule;
};

const getAllSchedule = async (id) => {
	const data = await Schedule.findAll({
		where: {
			course_student_id: id,
		},
		include: [
			{
				model: Student,
				include: [{ model: User }],
			},
			{
				model: Instructor,
				include: [{ model: User }],
			},
			{
				model: CourseStudent,
			},
			{
				model: CourseStudent,
			},
			{
				model: SubjectDays,
			},
			{
				model: Subject,
			},
		],
		order: [
			['date', 'ASC'], // Ordenar por fecha en forma ascendente
			['hour', 'ASC'], // Ordenar por hora en forma ascendente
		],
	});
	return data;
};

const scheduleInputError = (message) => {
	const error = new Error(message);
	error.status = 400;
	return error;
};

const scheduleConflictError = (message) => {
	const error = new Error(message);
	error.status = 409;
	return error;
};

const courseNotFoundError = () => {
	const error = new Error('Curso no encontrado');
	error.status = 404;
	return error;
};

const courseInactiveError = (course) => {
	const error = new Error(
		`El curso "${course.name}" está eliminado. Reactívalo para volver a operar sobre él.`,
	);
	error.status = 409;
	return error;
};

const courseOrderInputError = (message) => {
	const error = new Error(message);
	error.status = 400;
	return error;
};

/*
 * Regla de oro del soft delete de curso: `course.status` decide si puedes CREAR
 * cosas nuevas en el curso, no si puedes ver o cerrar lo que ya existe.
 *
 * - `status === false` (0)  => curso eliminado (404/409 en escrituras nuevas)
 * - `status === null`       => se normaliza a 1 en la migración; no se trata como eliminado
 *
 * No se usa `paranoid`: filtrar Course a nivel ORM escondería el historial de
 * alumnos, horarios, asistencias, exámenes y evaluaciones.
 */
const assertCourseIsActive = async (course_id) => {
	const course = await Course.findByPk(course_id);
	if (!course) {
		throw courseNotFoundError();
	}
	if (course.status === false || course.status === 0) {
		throw courseInactiveError(course);
	}
	return course;
};

/*
 * Eliminación / reactivación explícitas (Fase 2).
 *
 * `status` sigue siendo el predicado; `deleted_at` / `deleted_by` son auditoría.
 * Ambas operaciones son idempotentes: repetir la llamada no altera la auditoría
 * original ni falla. Nunca tocan tablas hijas (matrículas, horarios, asistencias,
 * exámenes, evaluaciones, grupos): el historial se conserva y se puede cerrar.
 */
const softDeleteCourse = async (course_id, deleted_by = null) => {
	const course = await Course.findByPk(course_id);
	if (!course) {
		throw courseNotFoundError();
	}
	if (course.status === false || course.status === 0) {
		return course;
	}
	await course.update({
		status: false,
		deleted_at: new Date(),
		deleted_by: deleted_by ?? null,
	});
	return course;
};

const restoreCourse = async (course_id) => {
	const course = await Course.findByPk(course_id);
	if (!course) {
		throw courseNotFoundError();
	}
	if (course.status !== false && course.status !== 0) {
		return course;
	}
	// Se limpia la auditoría: `deleted_at` / `deleted_by` describen la
	// eliminación vigente, no un historial acumulado.
	await course.update({
		status: true,
		deleted_at: null,
		deleted_by: null,
	});
	return course;
};

/*
 * Reordenamiento manual (`PUT /api/courses/order`).
 *
 * Recibe los ids en el orden final y reasigna `row_order` = 1..N en una sola
 * transacción. Reglas:
 *  - ids duplicados o no numéricos => 400;
 *  - ids inexistentes => 404;
 *  - los ids que falten (p. ej. porque el front tiene un filtro activo) NO se
 *    pierden: se agregan al final conservando su orden relativo actual.
 *
 * Los cursos eliminados participan del orden: `DELETE` y `POST /:id/restore` no
 * tocan `row_order`, así que al reactivar el curso vuelve a su posición.
 */
const reorderCourses = async (ids) => {
	if (!Array.isArray(ids) || ids.length === 0) {
		throw courseOrderInputError('Parámetro ids inválido');
	}

	const parsedIds = ids.map((id) => Number(id));
	if (parsedIds.some((id) => !Number.isInteger(id) || id <= 0)) {
		throw courseOrderInputError('Parámetro ids inválido');
	}
	if (new Set(parsedIds).size !== parsedIds.length) {
		throw courseOrderInputError('La lista de ids tiene duplicados');
	}

	return sequelize.transaction(async (transaction) => {
		const courses = await Course.findAll({
			order: [
				['row_order', 'ASC'],
				['id', 'ASC'],
			],
			transaction,
		});
		const byId = new Map(courses.map((course) => [course.id, course]));

		const unknownIds = parsedIds.filter((id) => !byId.has(id));
		if (unknownIds.length > 0) {
			const error = new Error(
				`Curso no encontrado: ${unknownIds.join(', ')}`,
			);
			error.status = 404;
			throw error;
		}

		const requested = parsedIds.map((id) => byId.get(id));
		const requestedIds = new Set(parsedIds);
		const remaining = courses.filter(
			(course) => !requestedIds.has(course.id),
		);
		const finalOrder = [...requested, ...remaining];

		for (let index = 0; index < finalOrder.length; index += 1) {
			const course = finalOrder[index];
			const nextRowOrder = index + 1;
			if (course.row_order !== nextRowOrder) {
				await course.update(
					{ row_order: nextRowOrder },
					{ transaction },
				);
			}
		}

		return finalOrder;
	});
};

/*
 * Un horario debe referenciar el `subject_days` REAL del programa del curso, activo,
 * y no puede repetirse para el mismo alumno. Esto evita:
 *  - horarios apuntando a días inactivos (quedan invisibles para la UI y permiten
 *    volver a agendar la misma actividad), y
 *  - doble registro de la misma actividad (doble submit, reintentos, etc.).
 */
const assertScheduleIsValid = async ({
	subject_id,
	subject_days_id,
	course_student_id,
}) => {
	const courseStudent = await CourseStudent.findByPk(course_student_id);
	if (!courseStudent) {
		throw scheduleInputError('CourseStudent not found');
	}

	await assertCourseIsActive(courseStudent.course_id);

	if (!subject_days_id) {
		throw scheduleInputError('subject_days_id es requerido');
	}

	const subjectDay = await SubjectDays.findByPk(subject_days_id);
	if (!subjectDay) {
		throw scheduleInputError('subject_days_id inválido');
	}

	if (
		subject_id !== undefined &&
		subject_id !== null &&
		Number(subjectDay.subject_id) !== Number(subject_id)
	) {
		throw scheduleInputError(
			'subject_id no corresponde al subject_days_id enviado',
		);
	}

	if (Number(subjectDay.course_id) !== Number(courseStudent.course_id)) {
		throw scheduleInputError(
			'El día de la actividad no pertenece al curso del alumno',
		);
	}

	if (!subjectDay.status) {
		throw scheduleConflictError(
			`La actividad ya no está activa en el día ${subjectDay.day} del programa. Actívala en la configuración del curso o agenda otro día.`,
		);
	}

	const existingSchedules = await Schedule.findAll({
		where: {
			course_student_id,
			subject_id: subjectDay.subject_id,
		},
		include: [{ model: SubjectDays, required: false }],
	});

	const sameSlot = existingSchedules.find(
		(schedule) =>
			Number(schedule.subject_days_id) === Number(subjectDay.id),
	);
	if (sameSlot) {
		throw scheduleConflictError(
			`Esta actividad ya está agendada para este alumno (horario #${sameSlot.id}).`,
		);
	}

	const staleSchedule = existingSchedules.find(
		(schedule) => !schedule.SubjectDays || !schedule.SubjectDays.status,
	);
	if (staleSchedule) {
		throw scheduleConflictError(
			`Este alumno ya tiene esta actividad agendada en un día inactivo (horario #${staleSchedule.id}). Elimina ese horario antes de volver a agendarla.`,
		);
	}
};

const createSchedule = async ({
	instructor_id,
	subject_days_id,
	student_id,
	subject_id,
	course_student_id,
	date,
	hour,
	classTime,
}) => {
	await assertScheduleIsValid({
		subject_id,
		subject_days_id,
		course_student_id,
	});

	const newSchedule = await Schedule.create({
		instructor_id,
		subject_days_id,
		student_id,
		subject_id,
		course_student_id,
		date,
		hour,
		classTime,
	});
	return newSchedule;
};
const updateSchedule = async (
	id,
	instructor_id,
	date,
	hour,
	classTime,
) => {
	const editSchedule = await Schedule.findByPk(id);
	if (!editSchedule) {
		throw new Error('Course not found');
	}
	await editSchedule.update({
		instructor_id,
		date,
		hour,
		classTime,
	});
	return editSchedule;
};

const buildSessionPairs = (schedules) => {
	const seen = new Set();
	const pairs = [];

	for (const schedule of schedules) {
		const ordinal = schedule.SubjectDays?.day ?? null;
		if (!schedule.date || ordinal === null) continue;

		const key = `${schedule.date}|${ordinal}`;
		if (seen.has(key)) continue;
		seen.add(key);

		pairs.push({ date: schedule.date, day: ordinal });
	}

	return pairs;
};

const deleteAttendanceForSchedulePairs = async (
	courseStudentId,
	pairs,
	transaction,
) => {
	if (pairs.length === 0) {
		return { deletedAttendanceCount: 0, deletedSignatureCount: 0 };
	}

	const attendances = await Attendance.findAll({
		attributes: ['id'],
		where: {
			course_student_id: courseStudentId,
			[Op.or]: pairs.map(({ date, day }) => ({ date, day })),
		},
		transaction,
	});

	const attendanceIds = attendances.map((a) => a.id);
	if (attendanceIds.length === 0) {
		return { deletedAttendanceCount: 0, deletedSignatureCount: 0 };
	}

	const deletedSignatureCount = await AttendanceSignature.destroy({
		where: { attendance_id: attendanceIds },
		transaction,
	});
	const deletedAttendanceCount = await Attendance.destroy({
		where: { id: attendanceIds },
		transaction,
	});

	return { deletedAttendanceCount, deletedSignatureCount };
};

const deleteScheduleById = async (id) => {
	const schedule = await Schedule.findByPk(id, {
		include: [{ model: SubjectDays }],
	});
	if (!schedule) {
		throw new Error('Schedule not found');
	}

	return sequelize.transaction(async (transaction) => {
		const { deletedAttendanceCount, deletedSignatureCount } =
			await deleteAttendanceForSchedulePairs(
				schedule.course_student_id,
				buildSessionPairs([schedule]),
				transaction,
			);

		await schedule.destroy({ transaction });

		return {
			deleted_count: 1,
			deleted_attendance_count: deletedAttendanceCount,
			deleted_signature_count: deletedSignatureCount,
		};
	});
};

const deleteSchedulesByCourseStudent = async (course_student_id) => {
	return sequelize.transaction(async (transaction) => {
		const courseStudent = await CourseStudent.findByPk(course_student_id, {
			transaction,
		});
		if (!courseStudent) {
			throw new Error('CourseStudent not found');
		}

		const schedules = await Schedule.findAll({
			where: { course_student_id },
			include: [{ model: SubjectDays }],
			transaction,
		});

		const { deletedAttendanceCount, deletedSignatureCount } =
			await deleteAttendanceForSchedulePairs(
				course_student_id,
				buildSessionPairs(schedules),
				transaction,
			);

		const deletedCount = await Schedule.destroy({
			where: { course_student_id },
			transaction,
		});

		return {
			deleted_count: deletedCount,
			deleted_attendance_count: deletedAttendanceCount,
			deleted_signature_count: deletedSignatureCount,
		};
	});
};

const updateCourseStudentMaxAttempts = async (id, max_attempts) => {
	const record = await CourseStudent.findByPk(id);
	if (!record) {
		throw new Error('CourseStudent not found');
	}
	record.max_attempts = max_attempts;
	await record.save();
	return record;
};

const getScheduleByInstructor = async (instructor_id) => {
	const data = await Schedule.findAll({
		where: { instructor_id },
		include: [
			{
				model: Student,
				include: [{ model: User }],
			},
			{
				model: Instructor,
				include: [{ model: User }],
			},
			{
				model: CourseStudent,
				required: true,
				where: { status: true },
			},
			{
				model: SubjectDays,
			},
			{
				model: Subject,
			},
		],
		order: [
			['date', 'ASC'],
			['hour', 'ASC'],
		],
	});
	return data;
};

export {
	getAllCourses,
	getAllCoursesStudent,
	getAllCoursesTypes,
	getAllCoursesLevel,
	getCourseById,
	getCourseTypeById,
	getCourseLevelById,
	getCourseProgramSizeByCourseStudent,
	getCourseStudentById,
	assertCourseIsActive,
	softDeleteCourse,
	restoreCourse,
	createCourse,
	cloneCourse,
	editCourse,
	reorderCourses,
	updateCourseHours,
	editCourseStudent,
	updateCourseStudentStatus,
	createCourseStudent,
	getAllSchedule,
	getScheduleById,
	createSchedule,
	updateSchedule,
	deleteScheduleById,
	deleteSchedulesByCourseStudent,
	updateCourseStudentMaxAttempts,
	getScheduleByInstructor,
};

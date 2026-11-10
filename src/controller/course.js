import {
	cloneCourseSchema,
	createCourseSchema,
	updateCourseSchema,
} from '../database/imput_validation/course.js';
import {
	assertCourseIsActive,
	cloneCourse,
	createCourse,
	createCourseStudent,
	createSchedule,
	deleteScheduleById,
	deleteSchedulesByCourseStudent,
	editCourse,
	editCourseStudent,
	getAllCourses,
	getAllCoursesLevel,
	getAllCoursesStudent,
	getAllCoursesTypes,
	getAllSchedule,
	getCourseById,
	getCourseStudentById,
	getScheduleById,
	reorderCourses,
	restoreCourse,
	softDeleteCourse,
	updateCourseHours,
	updateCourseStudentMaxAttempts,
	updateCourseStudentStatus,
	updateSchedule,
} from '../database/repositories/course.js';
import { getSubjectByCourseId } from '../database/repositories/subject.js';
import { updateInstructorStatus } from '../database/repositories/user.js';

export const ListCourses = async (req, res) => {
	try {
		const filters = req.query;
		const courses = await getAllCourses(filters);
		res.send(courses);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};
export const ListCoursesStudent = async (req, res) => {
	try {
		const filters = req.query;
		const dataCoursesStudent = await getAllCoursesStudent(filters);
		res.send(dataCoursesStudent);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};
export const ListCoursesTypes = async (req, res) => {
	try {
		const courses = await getAllCoursesTypes();
		res.send(courses);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};
export const ListCoursesLevel = async (req, res) => {
	try {
		const courses = await getAllCoursesLevel();
		res.send(courses);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const CourseDetails = async (req, res) => {
	const id = req.params.id;
	try {
		const course = await getCourseById(id);
		res.send(course);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const CourseStudentDetails = async (req, res) => {
	const id = req.params.id;
	try {
		const courseStudent = await getCourseStudentById(id);
		res.send(courseStudent);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const CreateCourse = async (req, res) => {
	const data = req.body;
	// Acepta el alias legacy (`type`/`level`) y también el objeto incluido que
	// devuelve `GET /` (`course_type.id`), útil cuando el front reenvía el curso
	// completo para recalcular `hours`.
	const course_type_id =
		data.type ?? data.course_type?.id ?? data.course_type_id;
	const course_level_id =
		data.level ?? data.course_level?.id ?? data.course_level_id;
	delete data.type;
	delete data.level;
	delete data.id;
	// El orden es responsabilidad del backend (se asigna al final). Joi rechaza
	// claves desconocidas, así que se descarta explícitamente.
	delete data.row_order;
	delete data.course_type;
	delete data.course_level;
	// `type`/`level` son alias legacy del front. Si no vienen, se respeta el
	// `course_type_id`/`course_level_id` que ya enviara el cliente (p. ej. al
	// reguardar un curso completo). No sobrescribir con `undefined`.
	if (course_type_id !== undefined) data.course_type_id = course_type_id;
	if (course_level_id !== undefined) data.course_level_id = course_level_id;
	if (data.color !== undefined && data.color !== null) {
		data.color = String(data.color);
	}

	try {
		const new_data = await createCourseSchema.validateAsync(data);
		const {
			name,
			description,
			code,
			// hours,
			plane_model,
			color,
			days,
			uses_sessions,
			sessions,
			course_type_id,
			course_level_id,
		} = new_data;

		const new_course = await createCourse({
			name,
			description,
			code,
			// hours,
			days,
			uses_sessions,
			sessions: sessions ?? days,
			plane_model,
			color,
			course_type_id,
			course_level_id,
			// Eliminar un curso es una acción aparte (status=false solo vía DELETE/PUT).
			status: true,
		});
		// `hours` es derivado: se calcula con las secciones/días del curso.
		await calculateCourseTotalHours(new_course.id);
		const course = await getCourseById(new_course.id);
		res.status(201).send(course);
	} catch (error) {
		console.error('Error en la validación:', error.message);
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

export const CloneCourse = async (req, res) => {
	const { course_id } = req.params;

	if (!course_id || isNaN(course_id)) {
		return res.status(400).json({ error: 'Parámetro course_id inválido' });
	}

	try {
		const data = await cloneCourseSchema.validateAsync(req.body ?? {});

		let result;
		try {
			result = await cloneCourse(parseInt(course_id), data);
		} catch (error) {
			if (error.message === 'Course not found') {
				return res.status(404).send('Curso no encontrado');
			}
			throw error;
		}

		const { course, counts } = result;
		// El clon copia las secciones/días: recalcular `hours` con la misma regla
		// del curso evita heredar un total viejo o incoherente del origen.
		await calculateCourseTotalHours(course.id);
		const courseDetails = await getCourseById(course.id);

		res.status(201).send({
			...(courseDetails ?? course).toJSON(),
			subjects_cloned: counts.subjects,
			subject_days_cloned: counts.subject_days,
			subject_lessons_cloned: counts.subject_lessons,
			subject_lesson_days_cloned: counts.subject_lesson_days,
		});
	} catch (error) {
		console.error('Error en el clonado:', error.message);
		if (error.isJoi) {
			return res
				.status(400)
				.send(`Input Validation Error ${error.message}`);
		}
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const CreateCourseStudent = async (req, res) => {
	const course_id = req.params.course_id;
	try {
		await assertCourseIsActive(course_id);
		const courseStudent = await createCourseStudent(course_id);
		res.send(courseStudent);
	} catch (error) {
		console.error('Error en la creacion:', error.message);
		console.log(error.message);
		if (error.status) {
			return res.status(error.status).json({ message: error.message });
		}
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

export const UpdateCourse = async (req, res) => {
	const data = req.body;
	// Mismo criterio que POST: acepta `type`/`level`, `course_type.id` o
	// `course_type_id` directo. Evita pisar el tipo con `undefined` cuando el
	// front reenvía el objeto completo.
	const course_type_id =
		data.type ?? data.course_type?.id ?? data.course_type_id;
	const course_level_id =
		data.level ?? data.course_level?.id ?? data.course_level_id;
	delete data.type;
	delete data.level;
	delete data.hours;
	// Un PUT normal NUNCA reordena: solo `PUT /api/courses/order` cambia el orden.
	delete data.row_order;
	delete data.course_type;
	delete data.course_level;
	// Igual que en POST: no pisar `course_type_id`/`course_level_id` con
	// `undefined` cuando el cliente envía el objeto completo sin los alias.
	if (course_type_id !== undefined) data.course_type_id = course_type_id;
	if (course_level_id !== undefined) data.course_level_id = course_level_id;
	if (data.color !== undefined && data.color !== null) {
		data.color = String(data.color);
	}
	try {
		const new_data = await updateCourseSchema.validateAsync(data, {
			// El front puede reenviar el curso completo (incluye `createdAt`,
			// `updatedAt`, auditoría del soft delete, etc.) solo para que el
			// backend recalcule `hours`. Esos campos no participan del update.
			stripUnknown: true,
		});
		const {
			id,
			name,
			description,
			code,
			// hours,
			plane_model,
			color,
			days,
			uses_sessions,
			sessions,
			course_type_id,
			course_level_id,
			status,
		} = new_data;
		await editCourse({
			id,
			name,
			description,
			code,
			// hours,
			plane_model,
			color,
			days,
			uses_sessions,
			// Si el cliente no manda `sessions`, editCourse conserva el actual.
			sessions,
			course_type_id,
			course_level_id,
			status,
			// Auditoría del soft delete; `status` sigue siendo el predicado.
			deleted_by: req.user?.id ?? null,
		});
		// `days`/`sessions` y el tipo pueden haber cambiado: recalcular siempre.
		await calculateCourseTotalHours(id);
		const course = await getCourseById(id);
		res.send(course);
	} catch (error) {
		console.error('Error en la validación:', error.message);
		if (error.status) {
			return res.status(error.status).json({ message: error.message });
		}
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

/*
 * DELETE /api/courses/:id
 * Soft delete reversible: `course.status = false` + auditoría. No borra hijos
 * ni filtra el historial; la eliminación se puede deshacer con /restore.
 */
export const DeleteCourse = async (req, res) => {
	const { id } = req.params;
	// Igual que CloneCourse: `:id` debe ser numérico. Sin esto, una ruta hermana
	// mal escrita (`DELETE /api/courses/schedule`) llegaría aquí con id='schedule'.
	if (!id || isNaN(id)) {
		return res.status(400).json({ message: 'Parámetro id inválido' });
	}
	try {
		await softDeleteCourse(id, req.user?.id ?? null);
		const course = await getCourseById(id);
		res.send(course);
	} catch (error) {
		console.error('Error al eliminar el curso:', error.message);
		if (error.status) {
			return res.status(error.status).json({ message: error.message });
		}
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

/*
 * POST /api/courses/:id/restore
 * Reactiva el curso y limpia `deleted_at` / `deleted_by`. Idempotente: un curso
 * activo se devuelve sin cambios. No toca `row_order`: el curso vuelve a su
 * posición original en la lista.
 */
export const RestoreCourse = async (req, res) => {
	const { id } = req.params;
	if (!id || isNaN(id)) {
		return res.status(400).json({ message: 'Parámetro id inválido' });
	}
	try {
		await restoreCourse(id);
		const course = await getCourseById(id);
		res.send(course);
	} catch (error) {
		console.error('Error al reactivar el curso:', error.message);
		if (error.status) {
			return res.status(error.status).json({ message: error.message });
		}
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

/*
 * PUT /api/courses/order
 * Body: `{ ids: number[] }` con los cursos en el orden final.
 *
 * Reasigna `row_order` = 1..N en una transacción y devuelve el listado completo
 * (incluye eliminados, igual que la pantalla de configuración) ya ordenado, para
 * que el front reemplace su `courseList` sin un segundo GET.
 */
export const ReorderCourses = async (req, res) => {
	const { ids } = req.body ?? {};
	try {
		await reorderCourses(ids);
		const courses = await getAllCourses({ include_inactive: true });
		res.send(courses);
	} catch (error) {
		console.error('Error al reordenar los cursos:', error.message);
		if (error.status) {
			return res.status(error.status).json({ message: error.message });
		}
		return res
			.status(400)
			.send(`Input Validation Error ${error.message}`);
	}
};

export const UpdateCourseStudent = async (req, res) => {
	const data = req.body;
	const { course_student_id } = data;

	if (!course_student_id) {
		return res.status(400).send('course_student_id is required');
	}

	try {
		const courseStudentEdited = await editCourseStudent(
			course_student_id,
			data,
		);
		res.send(courseStudentEdited);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const UpdateCourseStudentStatus = async (req, res) => {
	const course_student_id = req.params.course_student_id;
	const { status = false } = req.body;

	try {
		const courseStudentEdited = await updateCourseStudentStatus(
			course_student_id,
			status,
		);
		res.send(courseStudentEdited);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const UpdateInstructorStatus = async (req, res) => {
	const { user_id, status } = req.body;

	try {
		if (!user_id || status === undefined) {
			return res.status(400).send('user_id and status are required');
		}
		const instructor = await updateInstructorStatus(user_id, status);
		res.send(instructor);
	} catch (error) {
		console.log(error);
		if (error.message === 'Instructor not found') {
			return res
				.status(404)
				.send('Instructor not found for this user');
		}
		res.status(500).send(`Internal Server Error: ${error.message}`);
	}
};

export const ListSchedule = async (req, res) => {
	const id = req.params.id;
	try {
		const schedule = await getAllSchedule(id);
		res.send(schedule);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const CreateSchedule = async (req, res) => {
	const data = req.body;
	try {
		const newSchedule = await createSchedule(data);
		const SC = await getScheduleById(newSchedule.id);
		res.send(SC);
	} catch (error) {
		console.log(error);
		if (error.status) {
			return res.status(error.status).json({ message: error.message });
		}
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const UpdateSchedule = async (req, res) => {
	const data = req.body;
	console.log(data);

	const { id, instructor_id, date, hour, classTime } = data;
	try {
		const editSchedule = await updateSchedule(
			id,
			instructor_id,
			date,
			hour,
			classTime,
		);
		const SC = await getScheduleById(editSchedule.id);
		res.send(SC);
	} catch (error) {
		console.log(error);
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const DeleteSchedule = async (req, res) => {
	const { id } = req.params;
	try {
		if (!id || isNaN(id)) {
			return res.status(400).json({ error: 'Parámetro id inválido' });
		}

		const result = await deleteScheduleById(parseInt(id));

		res.status(200).json({
			message: `${result.deleted_count} schedule(s) deleted`,
			deleted_count: result.deleted_count,
			deleted_attendance_count: result.deleted_attendance_count,
			deleted_signature_count: result.deleted_signature_count,
		});
	} catch (error) {
		console.log(error);
		if (error.message === 'Schedule not found') {
			return res.status(404).send(error.message);
		}
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const DeleteSchedulesByCourseStudent = async (req, res) => {
	const { course_student_id } = req.params;
	try {
		if (!course_student_id || isNaN(course_student_id)) {
			return res
				.status(400)
				.json({ error: 'Parámetro course_student_id inválido' });
		}

		const result = await deleteSchedulesByCourseStudent(
			parseInt(course_student_id),
		);

		res.status(200).json({
			message: `${result.deleted_count} schedule(s) deleted`,
			deleted_count: result.deleted_count,
			deleted_attendance_count: result.deleted_attendance_count,
			deleted_signature_count: result.deleted_signature_count,
		});
	} catch (error) {
		console.log(error);
		if (error.message === 'CourseStudent not found') {
			return res.status(404).send(error.message);
		}
		res.status(500).send(`Internal Server Error ${error}`);
	}
};

export const UpdateCourseStudentMaxAttempts = async (req, res) => {
	try {
		const { course_student_id, max_attempts } = req.body;

		if (!course_student_id || isNaN(course_student_id)) {
			return res
				.status(400)
				.json({ error: 'Parámetro course_student_id inválido' });
		}

		if (
			max_attempts === undefined ||
			max_attempts === null ||
			isNaN(max_attempts)
		) {
			return res
				.status(400)
				.json({ error: 'Parámetro max_attempts inválido' });
		}

		const updated = await updateCourseStudentMaxAttempts(
			parseInt(course_student_id),
			parseInt(max_attempts),
		);

		res.status(200).json(updated);
	} catch (error) {
		console.error('Error al actualizar max_attempts:', error.message);
		res.status(400).json({ error: error.message });
	}
};

/*
 * Horas totales del curso: siempre es un valor derivado, nunca lo que envíe el
 * cliente (`POST /` y `PUT /` descartan `hours`).
 *
 * - `course_type_id = 2` ("Entrenamiento"): la carga es 8 horas por día/sesión
 *   del programa. Antes se multiplicaba 8 por cada `subject_days` activo; como
 *   un mismo día suele tener varias fases (Briefing, Vuelo, Debriefing, ...),
 *   el total se inflaba (curso 29: 25 actividades × 8 = 200 h para 3 días).
 * - Excepción "Experiencia Reciente" (nivel 4): cursos de Entrenamiento cortos
 *   (PIC/PI) cuya carga real la define el programa, no una jornada completa.
 *   Usan la suma de secciones: Σ(subject.hours × días activos). El curso 23
 *   (Briefing 1h + Vuelo 1h + Debriefing 1h) da 3 h, no 8 × 1 día.
 * - Resto de tipos: suma de `subject.hours` × días activos de cada sección.
 */
const TRAINING_COURSE_TYPE_ID = 2;
const TRAINING_HOURS_PER_DAY = 8;
const EXPERIENCE_RECENT_COURSE_LEVEL_ID = 4;

export const calculateCourseTotalHours = async (course_id) => {
	const course = await getCourseById(course_id);
	if (!course) return null;

	// Entrenamiento de jornada completa (Inicial/Periódico/Especial): 8 h por
	// día/sesión. La "Experiencia Reciente" es la excepción: experiencias cortas
	// cuyo total sale de sumar las fases programadas.
	const isTrainingFullDay =
		Number(course.course_type_id) === TRAINING_COURSE_TYPE_ID &&
		Number(course.course_level_id) !== EXPERIENCE_RECENT_COURSE_LEVEL_ID;

	let totalHours = 0;

	if (isTrainingFullDay) {
		const programSize = course.uses_sessions
			? (course.sessions ?? course.days)
			: course.days;
		totalHours = TRAINING_HOURS_PER_DAY * (Number(programSize) || 0);
	} else {
		const subjects = await getSubjectByCourseId(course_id);
		for (const subject of subjects) {
			// `getSubjectByCourseId` solo incluye `subject_days` activos.
			const activeDays = subject.subject_days.length;
			totalHours += (Number(subject.hours) || 0) * activeDays;
		}
	}

	await updateCourseHours(course_id, totalHours);
	return totalHours;
};

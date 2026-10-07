import { Op, Sequelize } from 'sequelize';
import { models } from '../index.js';

const {
	Schedule,
	CourseStudent,
	Attendance,
	Student,
	User,
	Course,
	CourseType,
	CourseLevel,
	SubjectDays,
	Instructor,
	Test,
	AttendanceStatus,
	AttendanceSignature,
	Subject,
	CourseGroup,
	CourseGroupSignature,
} = models;

const getCourseStudentIdsByInstructor = async (instructor_id) => {
	const rows = await Schedule.findAll({
		attributes: [
			[
				Sequelize.fn('DISTINCT', Sequelize.col('course_student_id')),
				'course_student_id',
			],
		],
		where: { instructor_id },
		raw: true,
	});
	return rows.map((r) => r.course_student_id).filter(Boolean);
};

const getCourseIdsByInstructor = async (instructor_id) => {
	const rows = await Schedule.findAll({
		attributes: [
			[
				Sequelize.fn(
					'DISTINCT',
					Sequelize.col('course_student.course_id'),
				),
				'course_id',
			],
		],
		where: { instructor_id },
		include: [
			{
				model: CourseStudent,
				attributes: [],
				required: true,
				where: { status: true },
			},
		],
		raw: true,
	});
	return rows.map((r) => r.course_id).filter(Boolean);
};

const getSchedulesByInstructorGroupedByCourseStudent = async (
	instructor_id,
) => {
	const data = await Schedule.findAll({
		where: { instructor_id },
		include: [
			{
				model: CourseStudent,
				required: true,
				where: { status: true },
				include: [
					{
						model: Student,
						include: [{ model: User }],
					},
					{
						model: Course,
						include: [{ model: CourseType }, { model: CourseLevel }],
					},
				],
			},
			{
				model: SubjectDays,
			},
			{ model: Subject },
			{ model: Instructor, include: [{ model: User }] },
		],
		order: [
			[SubjectDays, 'day', 'ASC'],
			['date', 'ASC'],
		],
		raw: false,
	});

	const grouped = {};
	data.forEach((item) => {
		const courseStudent = item.course_student;
		const user = courseStudent?.student?.user ?? null;
		const csId = item.course_student_id;
		if (!grouped[csId]) {
			const pilotName = user
				? `${user.name || ''} ${user.last_name || ''}`.trim()
				: null;
			grouped[csId] = {
				course_student_id: csId,
				student_id: courseStudent?.student_id,
				student: courseStudent?.student,
				user: user,
				pilot_name: pilotName,
				course: courseStudent?.course,
				course_id: courseStudent?.course?.id,
				course_name: courseStudent?.course?.name,
				course_code: courseStudent?.course?.code,
				schedules: [],
			};
		}
		grouped[csId].schedules.push({
			id: item.id,
			date: item.date,
			hour: item.hour,
			classTime: item.classTime,
			subject_day: item.subject_day,
			subject_id: item.subject_id,
			subject: item.subject,
			subject_name: item.subject?.name,
			subject_lesson: item.subject_lesson,
			subject_lesson_days: item.subject_lesson_days,
		});
	});

	console.log(
		'[getSchedulesByInstructorGroupedByCourseStudent] instructor_id:',
		instructor_id,
		'schedules found:',
		data.length,
		'groups:',
		Object.keys(grouped).length,
	);

	return Object.values(grouped);
};

const getTestsByInstructorWithParticipation = async (
	instructor_id,
) => {
	const courseStudentIds =
		await getCourseStudentIdsByInstructor(instructor_id);

	if (courseStudentIds.length === 0) {
		return {
			data: [],
			totalItems: 0,
			currentPage: 1,
			pageSize: 10,
			totalPages: 0,
		};
	}

	const { CourseStudentTest } = models;

	const whereClause = {
		course_student_id: courseStudentIds,
	};

	const data = await CourseStudentTest.findAll({
		where: whereClause,
		include: [
			{ model: Test, include: [{ model: Course }] },
			{
				model: CourseStudent,
				required: true,
				where: { status: true },
				include: [
					{ model: Student, include: [{ model: User }] },
					{ model: Course },
				],
			},
		],
		order: [['created_at', 'DESC']],
		raw: false,
	});

	const totalItems = data.length;

	console.log(
		'[getTestsByInstructorWithParticipation] instructor_id:',
		instructor_id,
		'courseStudentIds:',
		courseStudentIds.length,
		'tests:',
		data.length,
	);

	return {
		data: data.map((t) => {
			const json = t.toJSON ? t.toJSON() : t;
			const courseStudent = t.course_student;
			const user = courseStudent?.student?.user;
			console.log(
				'[DEBUG-TESTS] cs:',
				courseStudent ? 'exists' : 'null',
				'user:',
				user?.name,
			);
			return {
				...json,
				pilot_name: user
					? `${user.name || ''} ${user.last_name || ''}`.trim()
					: null,
				student_name: user?.name,
				student_last_name: user?.last_name,
				student_email: user?.email,
				course_name: courseStudent?.course?.name || t.course?.name,
				course_code: courseStudent?.course?.code || t.course?.code,
				test_name: t.test?.name,
				test_code: t.test?.code,
			};
		}),
		totalItems,
		currentPage: 1,
		pageSize: courseStudentIds.length,
		totalPages: 1,
	};
};

const getAttendanceByInstructorGroupedByCourseStudent = async (
	instructor_id,
) => {
	console.log(
		'[getAttendanceByInstructorGroupedByCourseStudent] instructor_id:',
		instructor_id,
	);
	const data = await Schedule.findAll({
		where: { instructor_id },
		include: [
			{
				model: CourseStudent,
				required: true,
				where: { status: true },
				include: [
					{
						model: Student,
						include: [{ model: User }],
					},
					{
						model: Course,
						include: [{ model: CourseType }, { model: CourseLevel }],
					},
				],
			},
			{
				model: SubjectDays,
			},
			{ model: Subject },
		],
		order: [
			['date', 'DESC'],
			[SubjectDays, 'day', 'ASC'],
		],
		raw: false,
	});

	console.log(
		'[getAttendanceByInstructorGroupedByCourseStudent] schedules found:',
		data.length,
	);

	const courseStudentIds = [
		...new Set(
			data.map((item) => item.course_student_id).filter(Boolean),
		),
	];

	const attendances = courseStudentIds.length
		? await Attendance.findAll({
				where: { course_student_id: { [Op.in]: courseStudentIds } },
				include: [
					{ model: AttendanceStatus },
					{ model: AttendanceSignature },
				],
				raw: false,
			})
		: [];

	console.log(
		'[DEBUG-ATTEND] First item course_student_id:',
		data[0]?.course_student_id,
	);
	console.log(
		'[DEBUG-ATTEND] First item.course_student:',
		data[0]?.course_student ? 'exists' : 'null',
	);
	console.log(
		'[DEBUG-ATTEND] First item.course_student.student:',
		data[0]?.course_student?.student ? 'exists' : 'null',
	);
	console.log(
		'[DEBUG-ATTEND] First item.course_student.student.user:',
		data[0]?.course_student?.student?.user?.name,
	);
	console.log(
		'[DEBUG-ATTEND] attendances loaded:',
		attendances.length,
	);

	const attendanceByKey = new Map();
	for (const attendance of attendances) {
		const key = [
			attendance.course_student_id,
			attendance.date,
			attendance.day,
		].join('|');
		if (!attendanceByKey.has(key)) {
			attendanceByKey.set(key, attendance);
		}
	}

	const grouped = {};
	data.forEach((item) => {
		const courseStudent = item.course_student;
		const user = courseStudent?.student?.user ?? null;
		const csId = item.course_student_id;
		const day = item.subject_day?.day ?? null;
		const attendance =
			attendanceByKey.get([csId, item.date, day].join('|')) ?? null;

		if (!grouped[csId]) {
			const pilotName = user
				? `${user.name || ''} ${user.last_name || ''}`.trim()
				: null;
			grouped[csId] = {
				course_student_id: csId,
				student_id: courseStudent?.student_id,
				student: courseStudent?.student,
				user: user,
				pilot_name: pilotName,
				course: courseStudent?.course,
				course_id: courseStudent?.course?.id,
				course_name: courseStudent?.course?.name,
				course_code: courseStudent?.course?.code,
				schedulesDates: new Set(),
				attendances: [],
			};
		}
		grouped[csId].schedulesDates.add(item.date);

		const lastAttendance =
			grouped[csId].attendances[grouped[csId].attendances.length - 1];
		if (
			!lastAttendance ||
			lastAttendance.date !== item.date ||
			lastAttendance.day !== day
		) {
			grouped[csId].attendances.push({
				id: attendance?.id ?? null,
				attendance_id: attendance?.id ?? null,
				date: item.date,
				day: day,
				attendance_status: attendance?.attendance_status ?? null,
				attendance_signature:
					attendance?.attendance_signature ?? null,
				subject_id: item.subject_id,
				subject: item.subject,
				subject_name: item.subject?.name,
				subject_day: item.subject_day?.day ?? null,
				hour: item.hour,
				classTime: item.classTime,
			});
		}
	});

	return Object.values(grouped).map((group) => ({
		...group,
		schedulesDates: Array.from(group.schedulesDates),
	}));
};

const getEvaluationsByInstructorGroupedByCourseStudent = async (
	instructor_id,
) => {
	const courseStudentIds =
		await getCourseStudentIdsByInstructor(instructor_id);

	if (courseStudentIds.length === 0) {
		return {
			data: [],
			totalItems: 0,
			currentPage: 1,
			pageSize: 10,
			totalPages: 0,
		};
	}

	const { CourseStudentAssessment, Course } = models;

	const whereClause = {
		course_student_id: courseStudentIds,
	};

	const data = await CourseStudentAssessment.findAll({
		where: whereClause,
		include: [
			{
				model: Course,
				include: [{ model: CourseType }, { model: CourseLevel }],
			},
			{
				model: Student,
				include: [{ model: User }],
			},
			{
				model: CourseStudent,
				required: true,
				where: { status: true },
			},
		],
		order: [['date', 'DESC']],
		raw: false,
	});

	const totalItems = data.length;

	console.log(
		'[getEvaluationsByInstructorGroupedByCourseStudent] instructor_id:',
		instructor_id,
		'courseStudentIds:',
		courseStudentIds.length,
		'evaluations:',
		data.length,
	);

	return {
		data: data.map((a) => {
			const json = a.toJSON ? a.toJSON() : a;
			const user = a.student?.user;
			console.log(
				'[DEBUG-EVAL] student:',
				a.student ? 'exists' : 'null',
				'user:',
				user?.name,
			);
			return {
				...json,
				pilot_name: user
					? `${user.name || ''} ${user.last_name || ''}`.trim()
					: null,
				student_name: user?.name,
				student_last_name: user?.last_name,
				course_name: a.course?.name,
				course_code: a.course?.code,
			};
		}),
		totalItems,
		currentPage: 1,
		pageSize: courseStudentIds.length,
		totalPages: 1,
	};
};

const isWithinProgram = (course, day) => {
	const uses_sessions = !!course.uses_sessions;
	if (uses_sessions) {
		return day >= 1 && day <= course.sessions;
	}
	return day >= 1 && day <= course.days;
};

const listSignatureGroupsByInstructor = async (instructor_id) => {
	const courseIds = await getCourseIdsByInstructor(instructor_id);
	if (!courseIds.length) return [];

	const groups = await CourseGroup.findAll({
		where: { course_id: { [Op.in]: courseIds }, status: true },
		include: [
			{ model: Course, required: true, where: { course_type_id: 1 }, include: [CourseType, CourseLevel] },
			{ model: CourseStudent, required: false, where: { status: true }, include: [{ model: Student, include: [User] }] },
			{ model: CourseGroupSignature, required: false, order: [['day_number', 'ASC'], ['signature_number', 'ASC']] }
		],
		order: [['id', 'ASC']]
	});

	const studentIds = groups.flatMap(g => {
		const csList = g.CourseStudents || g.course_students || g.courseStudents || [];
		return csList.map(cs => cs.id);
	});
	
	const schedules = studentIds.length
		? await Schedule.findAll({
				where: { instructor_id, course_student_id: { [Op.in]: studentIds } },
				include: [
					{ model: SubjectDays, required: true, attributes: ['day'], where: { status: true } },
					{ model: Subject, required: true, attributes: ['status'] }
				]
			})
		: [];

	const csToDays = new Map();
	schedules.forEach(s => {
		const day = s.SubjectDays?.day;
		if (day !== undefined && day !== null) {
			if (!csToDays.has(s.course_student_id)) csToDays.set(s.course_student_id, new Set());
			csToDays.get(s.course_student_id).add(day);
		}
	});

	const result = groups.map(g => {
		const course = g.Course || g.course;
		const csList = g.CourseStudents || g.course_students || g.courseStudents || [];
		const sigs = g.CourseGroupSignatures || g.course_group_signatures || g.courseGroupSignatures || g.CourseGroupSignatures || [];
		const days = [...new Set(
			csList
				.filter(cs => csToDays.has(cs.id))
				.flatMap(cs => [...csToDays.get(cs.id)])
				.filter(day => isWithinProgram(course, day))
		)].sort((a,b) => a - b);
		
		return {
			course_group_id: g.id,
			title: g.title,
			code: g.code,
			course: {
				id: course.id,
				name: course.name,
				code: course.code,
				uses_sessions: course.uses_sessions,
				days: course.days,
				sessions: course.sessions,
				course_type: { id: course.course_type_id, name: course.CourseType?.name },
				course_level: course.CourseLevel?.name
			},
			course_students: csList.map(cs => {
				const student = cs.Student || cs.student;
				const user = student?.User || student?.user;
				return {
					id: cs.id,
					code: cs.code,
					student: { name: user?.name, last_name: user?.last_name }
				};
			}),
			days: days,
			signatures: sigs.map(sig => ({
				id: sig.id,
				day_number: sig.day_number,
				signature_number: sig.signature_number,
				signature_url: sig.signature_url
			}))
		};
	});
	return result;
};



export {
	getCourseStudentIdsByInstructor,
	getCourseIdsByInstructor,
	getSchedulesByInstructorGroupedByCourseStudent,
	getTestsByInstructorWithParticipation,
	getAttendanceByInstructorGroupedByCourseStudent,
	getEvaluationsByInstructorGroupedByCourseStudent,
	listSignatureGroupsByInstructor,
};

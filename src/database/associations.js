/**
 * Set up all model associations
 * @param {Object} models - All initialized models
 */
export function setupAssociations(models) {
	const {
		Answer,
		Attendance,
		AttendanceStatus,
		Course,
		CourseGroup,
		CourseLevel,
		CourseType,
		CourseStudent,
		CourseStudentAssessment,
		CourseStudentAssessmentDay,
		CourseStudentAssessmentLessonDetail,
		CourseStudentTest,
		CourseStudentTestAnswer,
		CourseStudentTestQuestion,
		Group,
		GroupPermission,
		Instructor,
		Module,
		Permission,
		Question,
		QuestionType,
		Schedule,
		Student,
		Subject,
		SubjectDays,
		SubjectLesson,
		SubjectLessonDays,
		Test,
		TestQuestionType,
		User,
		UserDocType,
		UserGroup,
		UserPermission,
		UserSuggestion,
		EmailHistory,
		CourseGroupSignature,
	} = models;

	// ========== ATTENDANCE ASSOCIATIONS ==========
	Attendance.belongsTo(CourseStudent, {
		foreignKey: 'course_student_id',
	});
	Attendance.belongsTo(AttendanceStatus, {
		foreignKey: 'attendance_status_id',
	});
	CourseStudent.hasMany(Attendance, {
		foreignKey: 'course_student_id',
	});
	AttendanceStatus.hasMany(Attendance, {
		foreignKey: 'attendance_status_id',
	});

	// ========== ANSWER ASSOCIATIONS ==========
	Answer.belongsTo(Test, { foreignKey: 'test_id' });
	Answer.belongsTo(Course, { foreignKey: 'course_id' });
	Answer.belongsTo(Question, { foreignKey: 'question_id' });

	// ========== COURSE ASSOCIATIONS ==========
	Course.belongsTo(CourseLevel, { foreignKey: 'course_level_id' });
	Course.belongsTo(CourseType, { foreignKey: 'course_type_id' });
	Course.hasMany(Subject, { foreignKey: 'course_id' });
	Course.hasMany(SubjectDays, { foreignKey: 'course_id' });
	Course.hasMany(SubjectLesson, { foreignKey: 'course_id' });
	Course.hasMany(SubjectLessonDays, { foreignKey: 'course_id' });
	Course.hasMany(CourseStudent, { foreignKey: 'course_id' });
	Course.hasMany(Test, { foreignKey: 'course_id' });
	Course.hasMany(CourseStudentTest, { foreignKey: 'course_id' });
	Course.hasMany(CourseStudentTestQuestion, {
		foreignKey: 'course_id',
	});
	Course.hasMany(CourseStudentTestAnswer, {
		foreignKey: 'course_id',
	});
	Course.hasMany(CourseStudentAssessment, {
		foreignKey: 'course_id',
	});
	Course.hasMany(CourseStudentAssessmentDay, {
		foreignKey: 'course_id',
	});
	Course.hasMany(CourseStudentAssessmentLessonDetail, {
		foreignKey: 'course_id',
	});
	Course.hasMany(Question, { foreignKey: 'course_id' });
	Course.hasMany(TestQuestionType, { foreignKey: 'course_id' });
	Course.hasMany(Answer, { foreignKey: 'course_id' });

	// ========== COURSE LEVEL ASSOCIATIONS ==========
	CourseLevel.hasMany(Course, { foreignKey: 'course_level_id' });

	// ========== COURSE TYPE ASSOCIATIONS ==========
	CourseType.hasMany(Course, { foreignKey: 'course_type_id' });

	// ========== COURSE GROUP ASSOCIATIONS ==========
	CourseGroup.belongsTo(Course, { foreignKey: 'course_id' });
	Course.hasMany(CourseGroup, { foreignKey: 'course_id' });
	CourseGroup.hasMany(CourseStudent, { foreignKey: 'course_group_id' });
	CourseStudent.belongsTo(CourseGroup, { foreignKey: 'course_group_id' });
	CourseGroup.hasMany(CourseGroupSignature, { foreignKey: 'course_group_id' });
	CourseGroupSignature.belongsTo(CourseGroup, { foreignKey: 'course_group_id' });

	// ========== COURSE STUDENT ASSOCIATIONS ==========
	CourseStudent.belongsTo(Course, { foreignKey: 'course_id' });
	CourseStudent.belongsTo(Student, { foreignKey: 'student_id' });
	CourseStudent.hasMany(Schedule, {
		foreignKey: 'course_student_id',
	});
	CourseStudent.hasMany(CourseStudentTest, {
		foreignKey: 'course_student_id',
	});
	CourseStudent.hasMany(CourseStudentTestQuestion, {
		foreignKey: 'course_student_id',
	});
	CourseStudent.hasMany(CourseStudentTestAnswer, {
		foreignKey: 'course_student_id',
	});
	CourseStudent.hasOne(CourseStudentAssessment, {
		foreignKey: 'course_student_id',
	});
	CourseStudent.hasMany(CourseStudentAssessmentDay, {
		foreignKey: 'course_student_id',
	});
	CourseStudent.hasMany(CourseStudentAssessmentLessonDetail, {
		foreignKey: 'course_student_id',
	});

	// ========== COURSE STUDENT ASSESSMENT ASSOCIATIONS ==========
	CourseStudentAssessment.belongsTo(Course, {
		foreignKey: 'course_id',
	});
	CourseStudentAssessment.belongsTo(Student, {
		foreignKey: 'student_id',
	});
	CourseStudentAssessment.belongsTo(CourseStudent, {
		foreignKey: 'course_student_id',
	});
	CourseStudentAssessment.hasMany(CourseStudentAssessmentDay, {
		foreignKey: 'course_student_assessment_id',
	});
	CourseStudentAssessment.hasMany(
		CourseStudentAssessmentLessonDetail,
		{ foreignKey: 'course_student_assessment_id' },
	);

	// ========== COURSE STUDENT ASSESSMENT DAY ASSOCIATIONS ==========
	CourseStudentAssessmentDay.belongsTo(Course, {
		foreignKey: 'course_id',
	});
	CourseStudentAssessmentDay.belongsTo(Student, {
		foreignKey: 'student_id',
	});
	CourseStudentAssessmentDay.belongsTo(CourseStudent, {
		foreignKey: 'course_student_id',
	});
	CourseStudentAssessmentDay.belongsTo(CourseStudentAssessment, {
		foreignKey: 'course_student_assessment_id',
	});
	CourseStudentAssessmentDay.hasMany(
		CourseStudentAssessmentLessonDetail,
		{
			foreignKey: 'course_student_assessment_day_id',
		},
	);

	// ========== COURSE STUDENT ASSESSMENT LESSON DETAIL ASSOCIATIONS ==========
	CourseStudentAssessmentLessonDetail.belongsTo(Course, {
		foreignKey: 'course_id',
	});
	CourseStudentAssessmentLessonDetail.belongsTo(Student, {
		foreignKey: 'student_id',
	});
	CourseStudentAssessmentLessonDetail.belongsTo(CourseStudent, {
		foreignKey: 'course_student_id',
	});
	CourseStudentAssessmentLessonDetail.belongsTo(
		CourseStudentAssessment,
		{
			foreignKey: 'course_student_assessment_id',
		},
	);
	CourseStudentAssessmentLessonDetail.belongsTo(
		CourseStudentAssessmentDay,
		{
			foreignKey: 'course_student_assessment_day_id',
		},
	);
	CourseStudentAssessmentLessonDetail.belongsTo(Subject, {
		foreignKey: 'subject_id',
	});
	CourseStudentAssessmentLessonDetail.belongsTo(SubjectLesson, {
		foreignKey: 'subject_lesson_id',
	});
	CourseStudentAssessmentLessonDetail.belongsTo(SubjectDays, {
		foreignKey: 'subject_days_id',
	});

	// ========== COURSE STUDENT TEST ASSOCIATIONS ==========
	CourseStudentTest.belongsTo(Course, { foreignKey: 'course_id' });
	CourseStudentTest.belongsTo(Student, { foreignKey: 'student_id' });
	CourseStudentTest.belongsTo(CourseStudent, {
		foreignKey: 'course_student_id',
	});
	CourseStudentTest.belongsTo(Test, { foreignKey: 'test_id' });
	CourseStudentTest.hasMany(CourseStudentTestQuestion, {
		foreignKey: 'course_student_test_id',
	});
	CourseStudentTest.hasMany(CourseStudentTestAnswer, {
		foreignKey: 'course_student_test_id',
	});

	// ========== COURSE STUDENT TEST ANSWER ASSOCIATIONS ==========
	CourseStudentTestAnswer.belongsTo(Course, {
		foreignKey: 'course_id',
	});
	CourseStudentTestAnswer.belongsTo(Student, {
		foreignKey: 'student_id',
	});
	CourseStudentTestAnswer.belongsTo(CourseStudent, {
		foreignKey: 'course_student_id',
	});
	CourseStudentTestAnswer.belongsTo(CourseStudentTest, {
		foreignKey: 'course_student_test_id',
	});
	CourseStudentTestAnswer.belongsTo(CourseStudentTestQuestion, {
		foreignKey: 'course_student_test_question_id',
	});
	CourseStudentTestAnswer.belongsTo(Test, { foreignKey: 'test_id' });
	CourseStudentTestAnswer.belongsTo(Question, {
		foreignKey: 'question_id',
	});

	// ========== COURSE STUDENT TEST QUESTION ASSOCIATIONS ==========
	CourseStudentTestQuestion.hasOne(CourseStudentTestAnswer, {
		foreignKey: 'course_student_test_question_id',
	});
	CourseStudentTestQuestion.belongsTo(Course, {
		foreignKey: 'course_id',
	});
	CourseStudentTestQuestion.belongsTo(Student, {
		foreignKey: 'student_id',
	});
	CourseStudentTestQuestion.belongsTo(CourseStudent, {
		foreignKey: 'course_student_id',
	});
	CourseStudentTestQuestion.belongsTo(CourseStudentTest, {
		foreignKey: 'course_student_test_id',
	});
	CourseStudentTestQuestion.belongsTo(Test, {
		foreignKey: 'test_id',
	});
	CourseStudentTestQuestion.belongsTo(Question, {
		foreignKey: 'question_id',
	});

	// ========== INSTRUCTOR ASSOCIATIONS ==========
	Instructor.belongsTo(User, { foreignKey: 'user_id' });
	Instructor.hasMany(Schedule, { foreignKey: 'instructor_id' });

	// ========== GROUP ASSOCIATIONS ==========
	Group.belongsToMany(User, {
		through: UserGroup,
		foreignKey: 'group_id',
		otherKey: 'user_id',
	});
	Group.hasMany(UserGroup, { foreignKey: 'group_id' });
	Group.hasMany(GroupPermission, { foreignKey: 'group_id' });

	// ========== GROUP PERMISSION ASSOCIATIONS ==========
	GroupPermission.belongsTo(Group, { foreignKey: 'group_id' });
	GroupPermission.belongsTo(Permission, {
		foreignKey: 'permission_id',
	});

	// ========== MODULE ASSOCIATIONS ==========
	Module.hasMany(Permission, { foreignKey: 'module_id' });

	// ========== PERMISSION ASSOCIATIONS ==========
	Permission.belongsTo(Module, { foreignKey: 'module_id' });
	Permission.hasMany(GroupPermission, {
		foreignKey: 'permission_id',
	});
	Permission.hasMany(UserPermission, { foreignKey: 'permission_id' });

	// ========== QUESTION ASSOCIATIONS ==========
	Question.belongsTo(Course, { foreignKey: 'course_id' });
	Question.belongsTo(Test, { foreignKey: 'test_id' });
	Question.belongsTo(QuestionType, {
		foreignKey: 'question_type_id',
	});
	Question.belongsTo(TestQuestionType, {
		foreignKey: 'test_question_type_id',
	});
	Question.hasMany(Answer, { foreignKey: 'question_id' });
	Question.hasMany(CourseStudentTestQuestion, {
		foreignKey: 'question_id',
	});
	Question.hasMany(CourseStudentTestAnswer, {
		foreignKey: 'question_id',
	});

	// ========== QUESTION TYPE ASSOCIATIONS ==========
	QuestionType.hasMany(Question, { foreignKey: 'question_type_id' });
	QuestionType.hasMany(TestQuestionType, {
		foreignKey: 'question_type_id',
	});

	// ========== SCHEDULE ASSOCIATIONS ==========
	Schedule.belongsTo(Student, { foreignKey: 'student_id' });
	Schedule.belongsTo(Instructor, { foreignKey: 'instructor_id' });
	Schedule.belongsTo(CourseStudent, {
		foreignKey: 'course_student_id',
	});
	Schedule.belongsTo(Subject, { foreignKey: 'subject_id' });
	Schedule.belongsTo(SubjectDays, { foreignKey: 'subject_days_id' });

	// ========== STUDENT ASSOCIATIONS ==========
	Student.belongsTo(User, { foreignKey: 'user_id' });
	Student.hasMany(Schedule, { foreignKey: 'student_id' });
	Student.hasMany(CourseStudent, { foreignKey: 'student_id' });
	Student.hasMany(CourseStudentTest, { foreignKey: 'student_id' });
	Student.hasMany(CourseStudentTestQuestion, {
		foreignKey: 'student_id',
	});
	Student.hasMany(CourseStudentTestAnswer, {
		foreignKey: 'student_id',
	});
	Student.hasMany(CourseStudentAssessment, {
		foreignKey: 'student_id',
	});
	Student.hasMany(CourseStudentAssessmentDay, {
		foreignKey: 'student_id',
	});
	Student.hasMany(CourseStudentAssessmentLessonDetail, {
		foreignKey: 'student_id',
	});

	// ========== SUBJECT ASSOCIATIONS ==========
	Subject.belongsTo(Course, { foreignKey: 'course_id' });
	Subject.hasMany(SubjectDays, { foreignKey: 'subject_id' });
	Subject.hasMany(SubjectLesson, { foreignKey: 'subject_id' });
	Subject.hasMany(SubjectLessonDays, { foreignKey: 'subject_id' });
	Subject.hasMany(CourseStudentAssessmentLessonDetail, {
		foreignKey: 'subject_id',
	});

	// ========== SUBJECT DAYS ASSOCIATIONS ==========
	SubjectDays.belongsTo(Subject, { foreignKey: 'subject_id' });
	SubjectDays.belongsTo(Course, { foreignKey: 'course_id' });
	SubjectDays.hasMany(Schedule, { foreignKey: 'subject_days_id' });
	SubjectDays.hasMany(SubjectLessonDays, {
		foreignKey: 'subject_days_id',
	});
	SubjectDays.hasMany(CourseStudentAssessmentLessonDetail, {
		foreignKey: 'subject_days_id',
	});

	// ========== SUBJECT LESSON ASSOCIATIONS ==========
	SubjectLesson.belongsTo(Course, { foreignKey: 'course_id' });
	SubjectLesson.belongsTo(Subject, { foreignKey: 'subject_id' });
	SubjectLesson.hasMany(SubjectLessonDays, {
		foreignKey: 'subject_lesson_id',
	});
	SubjectLesson.hasMany(CourseStudentAssessmentLessonDetail, {
		foreignKey: 'subject_lesson_id',
	});

	// ========== SUBJECT LESSON DAYS ASSOCIATIONS ==========
	SubjectLessonDays.belongsTo(Course, { foreignKey: 'course_id' });
	SubjectLessonDays.belongsTo(Subject, { foreignKey: 'subject_id' });
	SubjectLessonDays.belongsTo(SubjectLesson, {
		foreignKey: 'subject_lesson_id',
	});
	SubjectLessonDays.belongsTo(SubjectDays, {
		foreignKey: 'subject_days_id',
	});
	SubjectLessonDays.hasMany(CourseStudentAssessmentLessonDetail, {
		foreignKey: 'subject_lesson_days_id',
	});

	// ========== TEST ASSOCIATIONS ==========
	Test.belongsTo(Course, { foreignKey: 'course_id' });
	Test.hasMany(Question, { foreignKey: 'test_id' });
	Test.hasMany(TestQuestionType, { foreignKey: 'test_id' });
	Test.hasMany(Answer, { foreignKey: 'test_id' });
	Test.hasMany(CourseStudentTest, { foreignKey: 'test_id' });
	Test.hasMany(CourseStudentTestQuestion, { foreignKey: 'test_id' });
	Test.hasMany(CourseStudentTestAnswer, { foreignKey: 'test_id' });

	// ========== TEST QUESTION TYPE ASSOCIATIONS ==========
	TestQuestionType.belongsTo(Course, { foreignKey: 'course_id' });
	TestQuestionType.belongsTo(Test, { foreignKey: 'test_id' });
	TestQuestionType.belongsTo(QuestionType, {
		foreignKey: 'question_type_id',
	});
	TestQuestionType.hasMany(Question, {
		foreignKey: 'test_question_type_id',
	});

	// ========== USER ASSOCIATIONS ==========
	User.belongsTo(UserDocType, { foreignKey: 'user_doc_type_id' });
	User.belongsToMany(Group, {
		through: UserGroup,
		foreignKey: 'user_id',
		otherKey: 'group_id',
	});
	User.hasOne(Student, { foreignKey: 'user_id' });
	User.hasOne(Instructor, { foreignKey: 'user_id' });
	User.hasMany(UserGroup, {
		foreignKey: 'user_id',
		as: 'userGroups',
	});
	User.hasMany(UserPermission, {
		foreignKey: 'user_id',
		as: 'userPermissions',
	});
	User.hasMany(UserSuggestion, {
		foreignKey: 'user_id',
		as: 'suggestions',
	});
	User.hasMany(EmailHistory, {
		foreignKey: 'user_id',
		as: 'emailHistories',
	});

	// ========== USER GROUP ASSOCIATIONS ==========
	UserGroup.belongsTo(Group, { foreignKey: 'group_id' });
	UserGroup.belongsTo(User, {
		foreignKey: 'user_id',
		as: 'groupUser',
	});

	// ========== USER PERMISSION ASSOCIATIONS ==========
	UserPermission.belongsTo(Permission, {
		foreignKey: 'permission_id',
	});
	UserPermission.belongsTo(User, {
		foreignKey: 'user_id',
		as: 'permissionUser',
	});

	// ========== USER DOC TYPE ASSOCIATIONS ==========
	UserDocType.hasMany(User, { foreignKey: 'user_doc_type_id' });

	// ========== USER SUGGESTION ASSOCIATIONS ==========
	UserSuggestion.belongsTo(User, {
		foreignKey: 'user_id',
		as: 'user',
	});

	// ========== EMAIL HISTORY ASSOCIATIONS ==========
	EmailHistory.belongsTo(User, {
		foreignKey: 'user_id',
		as: 'user',
	});
}

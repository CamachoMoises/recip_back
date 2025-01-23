import { Sequelize, DataTypes } from 'sequelize';
// import loadUser from './models/user.js';
import loadParticipant from './models/participant.js';
import loadGroup, {
	group_permission as loadGroupPermission,
} from './models/group.js';
import loadUser, {
	user_group as loadUserGroup,
	user_permission as loadUserPermission,
	user_doc_type as loadUserDocType,
	student as loadStudent,
	instructor as loadInstructor,
} from './models/user.js';
import loadModule from './models/module.js';
import loadCourse, {
	course_type as loadCourseType,
	course_level as loadCourseLevel,
	course_student as loadCourseStudent,
	course_student_test as loadCourseStudentTest,
	course_student_test_question as loadCourseStudentTestQuestion,
	course_student_test_answer as loadCourseStudentTestAnswer,
} from './models/course.js';
import loadCourseStudentAssessment, {
	course_student_assessment_day as loadCourseStudentAssessmentDay,
	course_student_assessment_lesson_day as loadCourseStudentAssessmentLessonDetail,
} from './models/assessment.js';
import loadSubject, {
	subject_days as loadSubjectDays,
	subject_lesson as loadSubjectLesson,
	subject_lesson_days as loadSubjectLessonDays,
} from './models/subject.js';
import loadPermission from './models/permission.js';

import loadTest, {
	question_type as loadQuestionType,
	test_question_type as loadTestQuestionType,
	question as loadQuestion,
	answer as loadAnswer,
} from './models/test.js';
import loadRating from './models/rating.js';
import loadSchedule from './models/schedule.js';
// const DB_NAME_CLEVER = 'b0dl2ortjhzfr9coi0x5';
// const DB_USER_CLEVER = 'uyfly4jduhoqkepm';
// const DB_HOST_CLEVER =
// 	'b0dl2ortjhzfr9coi0x5-mysql.services.clever-cloud.com';
// const DB_PASSWORD_CLEVER = 'tWuFaiI5puvpVBMuqLPo';
// const DB_PORT_CLEVER = 3306;

const DB_NAME = 'recip_db';
const DB_USER = 'moises';
const DB_HOST = 'localhost';
const DB_PASSWORD = '0000';
const DB_PORT = 3306;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	dialect: 'mysql',
	port: DB_PORT,
	define: {
		underscored: true, // Esto hará que Sequelize use snake_case por defecto
	},
});

const Participant = loadParticipant(sequelize, DataTypes);
const Group = loadGroup(sequelize, DataTypes);
const User = loadUser(sequelize, DataTypes);
const Module = loadModule(sequelize, DataTypes);
const Course = loadCourse(sequelize, DataTypes);
const Subject = loadSubject(sequelize, DataTypes);
const Permission = loadPermission(sequelize, DataTypes);
const Test = loadTest(sequelize, DataTypes);
const QuestionType = loadQuestionType(sequelize, DataTypes);
const Question = loadQuestion(sequelize, DataTypes);
const TestQuestionType = loadTestQuestionType(sequelize, DataTypes);
const Answer = loadAnswer(sequelize, DataTypes);
const Rating = loadRating(sequelize, DataTypes);
const Schedule = loadSchedule(sequelize, DataTypes);
const UserGroup = loadUserGroup(sequelize, DataTypes);
const UserPermission = loadUserPermission(sequelize, DataTypes);
const GroupPermission = loadGroupPermission(sequelize, DataTypes);
const Student = loadStudent(sequelize, DataTypes);
const Instructor = loadInstructor(sequelize, DataTypes);
const CourseType = loadCourseType(sequelize, DataTypes);
const UserDocType = loadUserDocType(sequelize, DataTypes);
const CourseLevel = loadCourseLevel(sequelize, DataTypes);
const CourseStudent = loadCourseStudent(sequelize, DataTypes);
const CourseStudentTest = loadCourseStudentTest(sequelize, DataTypes);
const CourseStudentTestQuestion = loadCourseStudentTestQuestion(
	sequelize,
	DataTypes
);
const CourseStudentTestAnswer = loadCourseStudentTestAnswer(
	sequelize,
	DataTypes
);
const CourseStudentAssessment = loadCourseStudentAssessment(
	sequelize,
	DataTypes
);

const CourseStudentAssessmentDay = loadCourseStudentAssessmentDay(
	sequelize,
	DataTypes
);
const CourseStudentAssessmentLessonDetail =
	loadCourseStudentAssessmentLessonDetail(sequelize, DataTypes);
const SubjectDays = loadSubjectDays(sequelize, DataTypes);
const SubjectLesson = loadSubjectLesson(sequelize, DataTypes);
const SubjectLessonDays = loadSubjectLessonDays(sequelize, DataTypes);

//Associations table!
Answer.belongsTo(Test, { foreignKey: 'test_id' });
Answer.belongsTo(Course, { foreignKey: 'course_id' });
Answer.belongsTo(Question, { foreignKey: 'question_id' });

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
Course.hasMany(CourseStudentTestAnswer, { foreignKey: 'course_id' });
Course.hasMany(CourseStudentAssessment, { foreignKey: 'course_id' });
Course.hasMany(CourseStudentAssessmentDay, {
	foreignKey: 'course_id',
});
Course.hasMany(CourseStudentAssessmentLessonDetail, {
	foreignKey: 'course_id',
});

Course.hasMany(Question, { foreignKey: 'course_id' });
Course.hasMany(TestQuestionType, { foreignKey: 'course_id' });
Course.hasMany(Answer, { foreignKey: 'course_id' });

CourseLevel.hasMany(Course, { foreignKey: 'course_level_id' });
CourseType.hasMany(Course, { foreignKey: 'course_type_id' });

CourseStudent.belongsTo(Course, { foreignKey: 'course_id' });
CourseStudent.belongsTo(Student, { foreignKey: 'student_id' });
CourseStudent.hasMany(Schedule, { foreignKey: 'course_student_id' });
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
CourseStudent.hasMany(Rating, { foreignKey: 'course_student_id' });

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
CourseStudentAssessment.hasMany(CourseStudentAssessmentLessonDetail, {
	foreignKey: 'course_student_assessment_id',
});

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
	}
);

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
	}
);
CourseStudentAssessmentLessonDetail.belongsTo(
	CourseStudentAssessmentDay,
	{
		foreignKey: 'course_student_assessment_day_id',
	}
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
CourseStudentTestQuestion.belongsTo(Test, { foreignKey: 'test_id' });
CourseStudentTestQuestion.belongsTo(Question, {
	foreignKey: 'question_id',
});

Instructor.belongsTo(User, { foreignKey: 'user_id' });
Instructor.hasMany(Schedule, { foreignKey: 'instructor_id' });
Instructor.hasMany(Rating, { foreignKey: 'instructor_id' });

Group.belongsToMany(User, {
	through: UserGroup,
	foreignKey: 'group_id',
	otherKey: 'user_id',
});
Group.hasMany(UserGroup, { foreignKey: 'group_id' });
Group.hasMany(GroupPermission, { foreignKey: 'group_id' });

GroupPermission.belongsTo(Group, { foreignKey: 'group_id' });
GroupPermission.belongsTo(Permission, {
	foreignKey: 'permission_id',
});

Module.hasMany(Permission, { foreignKey: 'module_id' });

Permission.belongsTo(Module, { foreignKey: 'module_id' });
Permission.hasMany(GroupPermission, { foreignKey: 'permission_id' });
Permission.hasMany(UserPermission, { foreignKey: 'permission_id' });

Question.belongsTo(Course, { foreignKey: 'course_id' });
Question.belongsTo(Test, { foreignKey: 'test_id' });
Question.belongsTo(QuestionType, { foreignKey: 'question_type_id' });
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

QuestionType.hasMany(Question, { foreignKey: 'question_type_id' });
QuestionType.hasMany(TestQuestionType, {
	foreignKey: 'question_type_id',
});

Rating.belongsTo(Student, { foreignKey: 'student_id' });
Rating.belongsTo(Instructor, { foreignKey: 'instructor_id' });
Rating.belongsTo(CourseStudent, { foreignKey: 'course_student_id' });
Rating.belongsTo(SubjectDays, { foreignKey: 'subject_days_id' });
Rating.belongsTo(Subject, {
	foreignKey: 'subject_id',
});

Schedule.belongsTo(Student, { foreignKey: 'student_id' });
Schedule.belongsTo(Instructor, { foreignKey: 'instructor_id' });
Schedule.belongsTo(CourseStudent, {
	foreignKey: 'course_student_id',
});
Schedule.belongsTo(Subject, { foreignKey: 'subject_id' });
Schedule.belongsTo(SubjectDays, { foreignKey: 'subject_days_id' });

Student.belongsTo(User, { foreignKey: 'user_id' });
Student.hasMany(Rating, { foreignKey: 'student_id' });
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

Subject.belongsTo(Course, { foreignKey: 'course_id' });
Subject.hasMany(SubjectDays, { foreignKey: 'subject_id' });
Subject.hasMany(SubjectLesson, { foreignKey: 'subject_id' });
Subject.hasMany(SubjectLessonDays, { foreignKey: 'subject_id' });
Subject.hasMany(CourseStudentAssessmentLessonDetail, {
	foreignKey: 'subject_id',
});

SubjectDays.belongsTo(Subject, { foreignKey: 'subject_id' });
SubjectDays.belongsTo(Course, { foreignKey: 'course_id' });
SubjectDays.hasMany(Rating, { foreignKey: 'subject_days_id' });
SubjectDays.hasMany(Schedule, { foreignKey: 'subject_days_id' });
SubjectDays.hasMany(Rating, {
	foreignKey: 'subject_days_id',
});
SubjectDays.hasMany(Schedule, {
	foreignKey: 'subject_days_id',
});
SubjectDays.hasMany(SubjectLessonDays, {
	foreignKey: 'subject_days_id',
});
SubjectDays.hasMany(CourseStudentAssessmentLessonDetail, {
	foreignKey: 'subject_days_id',
});

SubjectLesson.belongsTo(Course, { foreignKey: 'course_id' });
SubjectLesson.belongsTo(Subject, { foreignKey: 'subject_id' });
SubjectLesson.hasMany(SubjectLessonDays, {
	foreignKey: 'subject_lesson_id',
});
SubjectLesson.hasMany(CourseStudentAssessmentLessonDetail, {
	foreignKey: 'subject_lesson_id',
});

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

Test.belongsTo(Course, { foreignKey: 'course_id' });
Test.hasMany(Question, { foreignKey: 'test_id' });
Test.hasMany(TestQuestionType, { foreignKey: 'test_id' });
Test.hasMany(Answer, { foreignKey: 'test_id' });
Test.hasMany(CourseStudentTest, { foreignKey: 'test_id' });
Test.hasMany(CourseStudentTestQuestion, { foreignKey: 'test_id' });
Test.hasMany(CourseStudentTestAnswer, { foreignKey: 'test_id' });

TestQuestionType.belongsTo(Course, { foreignKey: 'course_id' });
TestQuestionType.belongsTo(Test, { foreignKey: 'test_id' });
TestQuestionType.belongsTo(QuestionType, {
	foreignKey: 'question_type_id',
});
TestQuestionType.hasMany(Question, {
	foreignKey: 'test_question_type_id',
});

User.belongsTo(UserDocType, { foreignKey: 'user_doc_type_id' });
User.belongsToMany(Group, {
	through: UserGroup,
	foreignKey: 'user_id',
	otherKey: 'group_id',
});
User.hasOne(Student, { foreignKey: 'user_id' });
User.hasOne(Instructor, { foreignKey: 'user_id' });
User.hasMany(UserGroup, { foreignKey: 'user_id' });
User.hasMany(UserPermission, { foreignKey: 'user_id' });

UserGroup.belongsTo(Group, { foreignKey: 'group_id' });
UserGroup.belongsTo(User, { foreignKey: 'user_id' });

UserPermission.belongsTo(Permission, { foreignKey: 'permission_id' });
UserPermission.belongsTo(User, { foreignKey: 'user_id' });

UserDocType.hasMany(User, { foreignKey: 'user_doc_type_id' });

const models = {
	Participant,
	Course,
	Test,
	QuestionType,
	Question,
	Answer,
	CourseType,
	CourseLevel,
	CourseStudent,
	CourseStudentTest,
	CourseStudentTestQuestion,
	CourseStudentTestAnswer,
	CourseStudentAssessment,
	CourseStudentAssessmentDay,
	CourseStudentAssessmentLessonDetail,
	TestQuestionType,
	Group,
	GroupPermission,
	Instructor,
	Module,
	Permission,
	Rating,
	Schedule,
	Student,
	Subject,
	SubjectDays,
	SubjectLesson,
	SubjectLessonDays,
	User,
	UserGroup,
	UserPermission,
	UserDocType,
};

export { sequelize, models };

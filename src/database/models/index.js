import { DataTypes } from 'sequelize';
import sequelize from '../connection.js';

// Import all model loaders
import loadParticipant from './participant.js';
import loadGroup, {
	group_permission as loadGroupPermission,
} from './group.js';
import loadUser, {
	user_group as loadUserGroup,
	user_permission as loadUserPermission,
	user_doc_type as loadUserDocType,
	student as loadStudent,
	instructor as loadInstructor,
	user_suggestion as loadUserSuggestion,
} from './user.js';
import loadModule from './module.js';
import loadCourse, {
	course_type as loadCourseType,
	course_level as loadCourseLevel,
	course_student as loadCourseStudent,
	course_student_test as loadCourseStudentTest,
	course_student_test_question as loadCourseStudentTestQuestion,
	course_student_test_answer as loadCourseStudentTestAnswer,
	course_group as loadCourseGroup,
} from './course.js';
import loadCourseStudentAssessment, {
	course_student_assessment_day as loadCourseStudentAssessmentDay,
	course_student_assessment_lesson_day as loadCourseStudentAssessmentLessonDetail,
} from './assessment.js';
import loadSubject, {
	subject_days as loadSubjectDays,
	subject_lesson as loadSubjectLesson,
	subject_lesson_days as loadSubjectLessonDays,
} from './subject.js';
import loadPermission from './permission.js';
import loadTest, {
	question_type as loadQuestionType,
	test_question_type as loadTestQuestionType,
	question as loadQuestion,
	answer as loadAnswer,
} from './test.js';
import loadSchedule from './schedule.js';
import loadAttendance, {
	attendance_status as loadAttendanceStatus,
} from './attendance.js';

// Initialize all models
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
const Schedule = loadSchedule(sequelize, DataTypes);

// Additional models from related loaders
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
	DataTypes,
);
const CourseStudentTestAnswer = loadCourseStudentTestAnswer(
	sequelize,
	DataTypes,
);
const CourseStudentAssessment = loadCourseStudentAssessment(
	sequelize,
	DataTypes,
);
const CourseStudentAssessmentDay = loadCourseStudentAssessmentDay(
	sequelize,
	DataTypes,
);
const CourseStudentAssessmentLessonDetail =
	loadCourseStudentAssessmentLessonDetail(sequelize, DataTypes);
const SubjectDays = loadSubjectDays(sequelize, DataTypes);
const SubjectLesson = loadSubjectLesson(sequelize, DataTypes);
const SubjectLessonDays = loadSubjectLessonDays(sequelize, DataTypes);
const UserSuggestion = loadUserSuggestion(sequelize, DataTypes);
const Attendance = loadAttendance(sequelize, DataTypes);
const AttendanceStatus = loadAttendanceStatus(sequelize, DataTypes);
const CourseGroup = loadCourseGroup(sequelize, DataTypes);

// Collect all models into an object
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
	UserSuggestion,
	Attendance,
	AttendanceStatus,
	CourseGroup,
};

export default models;

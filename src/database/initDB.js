import { Sequelize, DataTypes } from 'sequelize';
// import loadUser from './models/user.js';
import loadParticipant from './models/participant.js';
import loadGroup, {
	group_permission as loadGroupPermission,
} from './models/group.js';
import loadUser, {
	user_group as loadUserGroup,
	user_permission as loadUserPermission,
	student as loadStudent,
	instructor as loadInstructor,
} from './models/user.js';
import loadModule from './models/module.js';
import loadCourse, {
	course_type as loadCourseType,
	course_student as loadCourseStudent,
} from './models/course.js';
import loadSubject, {
	subject_days as loadSubjectDays,
} from './models/subject.js';
import loadPermission from './models/permission.js';
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
const Rating = loadRating(sequelize, DataTypes);
const Schedule = loadSchedule(sequelize, DataTypes);
const UserGroup = loadUserGroup(sequelize, DataTypes);
const UserPermission = loadUserPermission(sequelize, DataTypes);
const GroupPermission = loadGroupPermission(sequelize, DataTypes);
const Student = loadStudent(sequelize, DataTypes);
const Instructor = loadInstructor(sequelize, DataTypes);
const CourseType = loadCourseType(sequelize, DataTypes);
const CourseStudent = loadCourseStudent(sequelize, DataTypes);
const SubjectDays = loadSubjectDays(sequelize, DataTypes);

// Table associations!
Group.belongsToMany(User, {
	through: UserGroup,
	foreignKey: 'group_id',
	otherKey: 'user_id',
});

User.belongsToMany(Group, {
	through: UserGroup,
	foreignKey: 'user_id',
	otherKey: 'group_id',
});

UserGroup.belongsTo(Group, {
	foreignKey: 'group_id',
});
Group.hasMany(UserGroup, {
	foreignKey: 'group_id',
});
Module.hasMany(Permission, {
	foreignKey: 'module_id',
});

UserGroup.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(UserGroup, {
	foreignKey: 'user_id',
});

UserPermission.belongsTo(Permission, {
	foreignKey: 'permission_id',
});
Permission.hasMany(UserPermission, {
	foreignKey: 'permission_id',
});

UserPermission.belongsTo(User, {
	foreignKey: 'user_id',
});
User.hasMany(UserPermission, {
	foreignKey: 'user_id',
});

GroupPermission.belongsTo(Group, {
	foreignKey: 'group_id',
});
Group.hasMany(GroupPermission, {
	foreignKey: 'group_id',
});

GroupPermission.belongsTo(Permission, {
	foreignKey: 'permission_id',
});
Permission.hasMany(GroupPermission, {
	foreignKey: 'permission_id',
});

Permission.belongsTo(Module, {
	foreignKey: 'module_id',
});
User.hasOne(Student, { foreignKey: 'user_id' });
Student.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Instructor, { foreignKey: 'user_id' });
Instructor.belongsTo(User, { foreignKey: 'user_id' });
Course.belongsTo(CourseType, { foreignKey: 'course_type_id' });
CourseType.hasMany(Course, { foreignKey: 'course_type_id' });

Subject.belongsTo(Course, {
	foreignKey: 'course_id',
});
Course.hasMany(Subject, { foreignKey: 'course_id' });

Course.hasMany(SubjectDays, {
	foreignKey: 'course_id',
});
CourseStudent.belongsTo(Course, {
	foreignKey: 'course_id',
});
Course.hasMany(CourseStudent, {
	foreignKey: 'course_id',
});

Rating.belongsTo(Instructor, {
	foreignKey: 'instructor_id',
});
Instructor.hasMany(Rating, {
	foreignKey: 'instructor_id',
});

Schedule.belongsTo(Instructor, {
	foreignKey: 'instructor_id',
});
Instructor.hasMany(Schedule, {
	foreignKey: 'instructor_id',
});

Rating.belongsTo(Student, {
	foreignKey: 'student_id',
});
Student.hasMany(Rating, {
	foreignKey: 'student_id',
});

Schedule.belongsTo(Student, {
	foreignKey: 'student_id',
});
Student.hasMany(Schedule, {
	foreignKey: 'student_id',
});

CourseStudent.belongsTo(Student, {
	foreignKey: 'student_id',
});
Student.hasMany(CourseStudent, {
	foreignKey: 'student_id',
});

Rating.belongsTo(CourseStudent, {
	foreignKey: 'course_student_id',
});
CourseStudent.hasMany(Rating, {
	foreignKey: 'course_student_id',
});

Schedule.belongsTo(CourseStudent, {
	foreignKey: 'course_student_id',
});
CourseStudent.hasMany(Schedule, {
	foreignKey: 'course_student_id',
});

SubjectDays.belongsTo(Subject, {
	foreignKey: 'subject_id',
});
Subject.hasMany(SubjectDays, {
	foreignKey: 'subject_id',
});

SubjectDays.belongsTo(Course, {
	foreignKey: 'course_id',
});
Rating.belongsTo(SubjectDays, {
	foreignKey: 'subject_days_id',
});
SubjectDays.hasMany(Rating, {
	foreignKey: 'subject_days_id',
});
Schedule.belongsTo(SubjectDays, {
	foreignKey: 'subject_days_id',
});
SubjectDays.hasMany(Schedule, {
	foreignKey: 'subject_days_id',
});
Rating.belongsTo(SubjectDays, {
	foreignKey: 'subject_days_subject_id',
});
SubjectDays.hasMany(Rating, {
	foreignKey: 'subject_days_subject_id',
});
Schedule.belongsTo(SubjectDays, {
	foreignKey: 'subject_days_subject_id',
});
SubjectDays.hasMany(Schedule, {
	foreignKey: 'subject_days_subject_id',
});

const models = {
	Participant,
	Course,
	CourseType,
	CourseStudent,
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
	User,
	UserGroup,
	UserPermission,
};

export { sequelize, models };

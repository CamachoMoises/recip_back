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
	course_days as loadCourseDays,
} from './models/course.js';
import loadSubject, {
	subject_days as loadSubjectDays,
} from './models/subject.js';
import loadPermission from './models/permission.js';
import loadRating from './models/rating.js';
const DB_NAME_CLEVER = 'b0dl2ortjhzfr9coi0x5';
const DB_USER_CLEVER = 'uyfly4jduhoqkepm';
const DB_HOST_CLEVER =
	'b0dl2ortjhzfr9coi0x5-mysql.services.clever-cloud.com';
const DB_PASSWORD_CLEVER = 'tWuFaiI5puvpVBMuqLPo';
const DB_PORT_CLEVER = 3306;

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
const UserGroup = loadUserGroup(sequelize, DataTypes);
const UserPermission = loadUserPermission(sequelize, DataTypes);
const GroupPermission = loadGroupPermission(sequelize, DataTypes);
const Student = loadStudent(sequelize, DataTypes);
const Instructor = loadInstructor(sequelize, DataTypes);
const CourseDays = loadCourseDays(sequelize, DataTypes);
const SubjectDays = loadSubjectDays(sequelize, DataTypes);

// Table associations!
Group.belongsToMany(User, {
	as: 'user_id_users',
	through: UserGroup,
	foreignKey: 'group_id',
	otherKey: 'user_id',
});

User.belongsToMany(Group, {
	as: 'group_id_groups',
	through: UserGroup,
	foreignKey: 'user_id',
	otherKey: 'group_id',
});

UserGroup.belongsTo(Group, {
	as: 'group',
	foreignKey: 'group_id',
});
Group.hasMany(UserGroup, {
	as: 'user_groups',
	foreignKey: 'group_id',
});
Module.hasMany(Permission, {
	as: 'permisions',
	foreignKey: 'module_id',
});

UserGroup.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
User.hasMany(UserGroup, {
	as: 'user_groups',
	foreignKey: 'user_id',
});

UserPermission.belongsTo(Permission, {
	as: 'permission',
	foreignKey: 'permission_id',
});
Permission.hasMany(UserPermission, {
	as: 'user_permission',
	foreignKey: 'permission_id',
});

UserPermission.belongsTo(User, {
	as: 'user',
	foreignKey: 'user_id',
});
User.hasMany(UserPermission, {
	as: 'user_permission',
	foreignKey: 'user_id',
});

GroupPermission.belongsTo(Group, {
	as: 'group',
	foreignKey: 'group_id',
});
Group.hasMany(GroupPermission, {
	as: 'group_permission',
	foreignKey: 'group_id',
});

GroupPermission.belongsTo(Permission, {
	as: 'permission',
	foreignKey: 'permission_id',
});
Permission.hasMany(GroupPermission, {
	as: 'group_permission',
	foreignKey: 'permission_id',
});

Permission.belongsTo(Module, {
	as: 'module',
	foreignKey: 'module_id',
});
User.hasOne(Student, { as: 'student', foreignKey: 'user_id' });
Student.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
User.hasOne(Instructor, { as: 'instructor', foreignKey: 'user_id' });
Instructor.belongsTo(User, { as: 'user', foreignKey: 'user_id' });

CourseDays.belongsTo(Course, {
	as: 'course',
	foreignKey: 'course_id',
});
Course.hasMany(CourseDays, {
	as: 'course_days',
	foreignKey: 'course_id',
});
Subject.belongsTo(Course, {
	as: 'course',
	foreignKey: 'course_id',
});
Course.hasMany(Subject, { as: 'subject', foreignKey: 'course_id' });
SubjectDays.belongsTo(CourseDays, {
	as: 'course_day',
	foreignKey: 'course_days_id',
});
CourseDays.hasMany(SubjectDays, {
	as: 'subject_days',
	foreignKey: 'course_days_id',
});
SubjectDays.belongsTo(CourseDays, {
	as: 'course_days_course',
	foreignKey: 'course_days_course_id',
});
CourseDays.hasMany(SubjectDays, {
	as: 'course_days_course_subject_days',
	foreignKey: 'course_days_course_id',
});

Rating.belongsTo(Instructor, {
	as: 'instructor',
	foreignKey: 'instructor_id',
});
Instructor.hasMany(Rating, {
	as: 'ratings',
	foreignKey: 'instructor_id',
});

Rating.belongsTo(Student, {
	as: 'student',
	foreignKey: 'student_id',
});
Student.hasMany(Rating, {
	as: 'ratings',
	foreignKey: 'student_id',
});
SubjectDays.belongsTo(Subject, {
	as: 'subject',
	foreignKey: 'subject_id',
});
Subject.hasMany(SubjectDays, {
	as: 'subject_days',
	foreignKey: 'subject_id',
});
Rating.belongsTo(SubjectDays, {
	as: 'subject_day',
	foreignKey: 'subject_days_id',
});
SubjectDays.hasMany(Rating, {
	as: 'ratings',
	foreignKey: 'subject_days_id',
});
Rating.belongsTo(SubjectDays, {
	as: 'subject_days_subject',
	foreignKey: 'subject_days_subject_id',
});
SubjectDays.hasMany(Rating, {
	as: 'subject_days_subject_ratings',
	foreignKey: 'subject_days_subject_id',
});
Rating.belongsTo(SubjectDays, {
	as: 'subject_days_course_day',
	foreignKey: 'subject_days_course_days_id',
});
SubjectDays.hasMany(Rating, {
	as: 'subject_days_course_days_ratings',
	foreignKey: 'subject_days_course_days_id',
});
Rating.belongsTo(SubjectDays, {
	as: 'subject_days_course_days_course',
	foreignKey: 'subject_days_course_days_course_id',
});
SubjectDays.hasMany(Rating, {
	as: 'subject_days_course_days_course_ratings',
	foreignKey: 'subject_days_course_days_course_id',
});

const models = {
	Participant,
	Course,
	CourseDays,
	Group,
	GroupPermission,
	Instructor,
	Module,
	Permission,
	Rating,
	Student,
	Subject,
	SubjectDays,
	Subject,
	SubjectDays,
	User,
	UserGroup,
	UserPermission,
};

export { sequelize, models };

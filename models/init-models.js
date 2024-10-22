var DataTypes = require('sequelize').DataTypes;
var _course = require('./course');
var _course_days = require('./course_days');
var _group = require('./group');
var _group_permision = require('./group_permision');
var _instructor = require('./instructor');
var _module = require('./module');
var _participants = require('./participants');
var _permisions = require('./permisions');
var _rating = require('./rating');
var _student = require('./student');
var _subject = require('./subject');
var _subject_days = require('./subject_days');
var _user = require('./user');
var _user_group = require('./user_group');
var _user_permision = require('./user_permision');

function initModels(sequelize) {
	var course = _course(sequelize, DataTypes);
	var course_days = _course_days(sequelize, DataTypes);
	var group = _group(sequelize, DataTypes);
	var group_permision = _group_permision(sequelize, DataTypes);
	var instructor = _instructor(sequelize, DataTypes);
	var module = _module(sequelize, DataTypes);
	var participants = _participants(sequelize, DataTypes);
	var permisions = _permisions(sequelize, DataTypes);
	var rating = _rating(sequelize, DataTypes);
	var student = _student(sequelize, DataTypes);
	var subject = _subject(sequelize, DataTypes);
	var subject_days = _subject_days(sequelize, DataTypes);
	var user = _user(sequelize, DataTypes);
	var user_group = _user_group(sequelize, DataTypes);
	var user_permision = _user_permision(sequelize, DataTypes);

	// group.belongsToMany(user, { as: 'user_id_users', through: user_group, foreignKey: "group_id", otherKey: "user_id" });
	// user.belongsToMany(group, { as: 'group_id_groups', through: user_group, foreignKey: "user_id", otherKey: "group_id" });
	course_days.belongsTo(course, {
		as: 'course',
		foreignKey: 'course_id',
	});
	course.hasMany(course_days, {
		as: 'course_days',
		foreignKey: 'course_id',
	});
	subject.belongsTo(course, {
		as: 'course',
		foreignKey: 'course_id',
	});
	course.hasMany(subject, { as: 'subject', foreignKey: 'course_id' });
	subject_days.belongsTo(course_days, {
		as: 'course_day',
		foreignKey: 'course_days_id',
	});
	course_days.hasMany(subject_days, {
		as: 'subject_days',
		foreignKey: 'course_days_id',
	});
	subject_days.belongsTo(course_days, {
		as: 'course_days_course',
		foreignKey: 'course_days_course_id',
	});
	course_days.hasMany(subject_days, {
		as: 'course_days_course_subject_days',
		foreignKey: 'course_days_course_id',
	});
	// group_permision.belongsTo(group, { as: "group", foreignKey: "group_id"});
	// group.hasMany(group_permision, { as: "group_permission", foreignKey: "group_id"});
	// user_group.belongsTo(group, { as: "group", foreignKey: "group_id"});
	// group.hasMany(user_group, { as: "user_groups", foreignKey: "group_id"});
	rating.belongsTo(instructor, {
		as: 'instructor',
		foreignKey: 'instructor_id',
	});
	instructor.hasMany(rating, {
		as: 'ratings',
		foreignKey: 'instructor_id',
	});
	// permisions.belongsTo(module, { as: "module", foreignKey: "module_id"});
	module.hasMany(permisions, {
		as: 'permisions',
		foreignKey: 'module_id',
	});
	// group_permision.belongsTo(permisions, { as: "permision", foreignKey: "permission_id"});
	// permisions.hasMany(group_permision, { as: "group_permisions", foreignKey: "permission_id"});
	// user_permision.belongsTo(permisions, { as: "permision", foreignKey: "permisions_id"});
	// permisions.hasMany(user_permision, { as: "user_permisions", foreignKey: "permisions_id"});
	rating.belongsTo(student, {
		as: 'student',
		foreignKey: 'student_id',
	});
	student.hasMany(rating, {
		as: 'ratings',
		foreignKey: 'student_id',
	});
	subject_days.belongsTo(subject, {
		as: 'subject',
		foreignKey: 'subject_id',
	});
	subject.hasMany(subject_days, {
		as: 'subject_days',
		foreignKey: 'subject_id',
	});
	rating.belongsTo(subject_days, {
		as: 'subject_day',
		foreignKey: 'subject_days_id',
	});
	subject_days.hasMany(rating, {
		as: 'ratings',
		foreignKey: 'subject_days_id',
	});
	rating.belongsTo(subject_days, {
		as: 'subject_days_subject',
		foreignKey: 'subject_days_subject_id',
	});
	subject_days.hasMany(rating, {
		as: 'subject_days_subject_ratings',
		foreignKey: 'subject_days_subject_id',
	});
	rating.belongsTo(subject_days, {
		as: 'subject_days_course_day',
		foreignKey: 'subject_days_course_days_id',
	});
	subject_days.hasMany(rating, {
		as: 'subject_days_course_days_ratings',
		foreignKey: 'subject_days_course_days_id',
	});
	rating.belongsTo(subject_days, {
		as: 'subject_days_course_days_course',
		foreignKey: 'subject_days_course_days_course_id',
	});
	subject_days.hasMany(rating, {
		as: 'subject_days_course_days_course_ratings',
		foreignKey: 'subject_days_course_days_course_id',
	});
	// instructor.belongsTo(user, { as: "user", foreignKey: "user_id"});
	// user.hasMany(instructor, { as: "instructors", foreignKey: "user_id"});
	// student.belongsTo(user, { as: "user", foreignKey: "user_id"});
	// user.hasMany(student, { as: "students", foreignKey: "user_id"});
	// user_group.belongsTo(user, { as: "user", foreignKey: "user_id"});
	// user.hasMany(user_group, { as: "user_groups", foreignKey: "user_id"});
	// user_permision.belongsTo(user, { as: "user", foreignKey: "user_id"});
	// user.hasMany(user_permision, { as: "user_permisions", foreignKey: "user_id"});

	return {
		course,
		course_days,
		group,
		group_permision,
		instructor,
		module,
		participants,
		permisions,
		rating,
		student,
		subject,
		subject_days,
		user,
		user_group,
		user_permision,
	};
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

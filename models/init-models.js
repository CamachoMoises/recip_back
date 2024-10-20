var DataTypes = require("sequelize").DataTypes;
var _course = require("./course");
var _course_days = require("./course_days");
var _group = require("./group");
var _group_permision = require("./group_permision");
var _instructor = require("./instructor");
var _module = require("./module");
var _permisions = require("./permisions");
var _rating = require("./rating");
var _student = require("./student");
var _subjects = require("./subjects");
var _subjects_days = require("./subjects_days");
var _user = require("./user");
var _user_permision = require("./user_permision");

function initModels(sequelize) {
  var course = _course(sequelize, DataTypes);
  var course_days = _course_days(sequelize, DataTypes);
  var group = _group(sequelize, DataTypes);
  var group_permision = _group_permision(sequelize, DataTypes);
  var instructor = _instructor(sequelize, DataTypes);
  var module = _module(sequelize, DataTypes);
  var permisions = _permisions(sequelize, DataTypes);
  var rating = _rating(sequelize, DataTypes);
  var student = _student(sequelize, DataTypes);
  var subjects = _subjects(sequelize, DataTypes);
  var subjects_days = _subjects_days(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);
  var user_permision = _user_permision(sequelize, DataTypes);

  course_days.belongsTo(course, { as: "course", foreignKey: "course_id"});
  course.hasMany(course_days, { as: "course_days", foreignKey: "course_id"});
  subjects.belongsTo(course, { as: "course", foreignKey: "course_id"});
  course.hasMany(subjects, { as: "subjects", foreignKey: "course_id"});
  subjects_days.belongsTo(course_days, { as: "course_day", foreignKey: "course_days_id"});
  course_days.hasMany(subjects_days, { as: "subjects_days", foreignKey: "course_days_id"});
  subjects_days.belongsTo(course_days, { as: "course_days_course", foreignKey: "course_days_course_id"});
  course_days.hasMany(subjects_days, { as: "course_days_course_subjects_days", foreignKey: "course_days_course_id"});
  group_permision.belongsTo(group, { as: "group", foreignKey: "group_id"});
  group.hasMany(group_permision, { as: "group_permisions", foreignKey: "group_id"});
  user.belongsTo(group, { as: "group", foreignKey: "group_id"});
  group.hasMany(user, { as: "users", foreignKey: "group_id"});
  rating.belongsTo(instructor, { as: "instructor", foreignKey: "instructor_id"});
  instructor.hasMany(rating, { as: "ratings", foreignKey: "instructor_id"});
  permisions.belongsTo(module, { as: "module", foreignKey: "module_id"});
  module.hasMany(permisions, { as: "permisions", foreignKey: "module_id"});
  group_permision.belongsTo(permisions, { as: "permision", foreignKey: "permisions_id"});
  permisions.hasMany(group_permision, { as: "group_permisions", foreignKey: "permisions_id"});
  user_permision.belongsTo(permisions, { as: "permision", foreignKey: "permisions_id"});
  permisions.hasMany(user_permision, { as: "user_permisions", foreignKey: "permisions_id"});
  rating.belongsTo(student, { as: "student", foreignKey: "student_id"});
  student.hasMany(rating, { as: "ratings", foreignKey: "student_id"});
  subjects_days.belongsTo(subjects, { as: "subject", foreignKey: "subjects_id"});
  subjects.hasMany(subjects_days, { as: "subjects_days", foreignKey: "subjects_id"});
  rating.belongsTo(subjects_days, { as: "subjects_day", foreignKey: "subjects_days_id"});
  subjects_days.hasMany(rating, { as: "ratings", foreignKey: "subjects_days_id"});
  rating.belongsTo(subjects_days, { as: "subjects_days_subject", foreignKey: "subjects_days_subjects_id"});
  subjects_days.hasMany(rating, { as: "subjects_days_subjects_ratings", foreignKey: "subjects_days_subjects_id"});
  rating.belongsTo(subjects_days, { as: "subjects_days_course_day", foreignKey: "subjects_days_course_days_id"});
  subjects_days.hasMany(rating, { as: "subjects_days_course_days_ratings", foreignKey: "subjects_days_course_days_id"});
  rating.belongsTo(subjects_days, { as: "subjects_days_course_days_course", foreignKey: "subjects_days_course_days_course_id"});
  subjects_days.hasMany(rating, { as: "subjects_days_course_days_course_ratings", foreignKey: "subjects_days_course_days_course_id"});
  instructor.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(instructor, { as: "instructors", foreignKey: "user_id"});
  student.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(student, { as: "students", foreignKey: "user_id"});
  user_permision.belongsTo(user, { as: "user", foreignKey: "user_id"});
  user.hasMany(user_permision, { as: "user_permisions", foreignKey: "user_id"});

  return {
    course,
    course_days,
    group,
    group_permision,
    instructor,
    module,
    permisions,
    rating,
    student,
    subjects,
    subjects_days,
    user,
    user_permision,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

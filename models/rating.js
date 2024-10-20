const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rating', {
    instructor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'instructor',
        key: 'id'
      }
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'student',
        key: 'id'
      }
    },
    subjects_days_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'subjects_days',
        key: 'id'
      }
    },
    subjects_days_subjects_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'subjects_days',
        key: 'subjects_id'
      }
    },
    subjects_days_course_days_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'subjects_days',
        key: 'course_days_id'
      }
    },
    subjects_days_course_days_course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'subjects_days',
        key: 'course_days_course_id'
      }
    },
    value: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'rating',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "instructor_id" },
          { name: "student_id" },
          { name: "subjects_days_id" },
          { name: "subjects_days_subjects_id" },
          { name: "subjects_days_course_days_id" },
          { name: "subjects_days_course_days_course_id" },
        ]
      },
      {
        name: "fk_rating_student1_idx",
        using: "BTREE",
        fields: [
          { name: "student_id" },
        ]
      },
      {
        name: "fk_rating_subjects_days1_idx",
        using: "BTREE",
        fields: [
          { name: "subjects_days_id" },
          { name: "subjects_days_subjects_id" },
          { name: "subjects_days_course_days_id" },
          { name: "subjects_days_course_days_course_id" },
        ]
      },
    ]
  });
};

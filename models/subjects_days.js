const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('subjects_days', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    subjects_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'subjects',
        key: 'id'
      }
    },
    course_days_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'course_days',
        key: 'id'
      }
    },
    course_days_course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'course_days',
        key: 'course_id'
      }
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1
    }
  }, {
    sequelize,
    tableName: 'subjects_days',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
          { name: "subjects_id" },
          { name: "course_days_id" },
          { name: "course_days_course_id" },
        ]
      },
      {
        name: "fk_subjects_days_subjects1_idx",
        using: "BTREE",
        fields: [
          { name: "subjects_id" },
        ]
      },
      {
        name: "fk_subjects_days_course_days1_idx",
        using: "BTREE",
        fields: [
          { name: "course_days_id" },
          { name: "course_days_course_id" },
        ]
      },
    ]
  });
};

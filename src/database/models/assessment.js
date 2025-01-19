export default (sequelize, DataTypes) => {
	return sequelize.define(
		'course_student_assessment',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			course_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course',
					key: 'id',
				},
			},
			student_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'student',
					key: 'id',
				},
			},
			course_student_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course_student',
					key: 'id',
				},
			},
			score: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			approve: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
			},

			date: {
				type: DataTypes.DATE,
				allowNull: true,
			},

			code: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			status: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 1,
			},
			finished: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 0,
			},
			comments: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'course_student_assessment',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_course_student_assessment_course_idx',
					using: 'BTREE',
					fields: [{ name: 'course_id' }],
				},

				{
					name: 'fk_course_student_assessment_course_student_idx',
					using: 'BTREE',
					fields: [{ name: 'course_student_id' }],
				},
				{
					name: 'fk_course_student_assessment_student1_idx',
					using: 'BTREE',
					fields: [{ name: 'student_id' }],
				},
			],
		}
	);
};

export const course_student_assessment_day = (
	sequelize,
	DataTypes
) => {
	return sequelize.define(
		'course_student_assessment_day',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			course_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course',
					key: 'id',
				},
			},

			student_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'student',
					key: 'id',
				},
			},
			course_student_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course_student',
					key: 'id',
				},
			},
			course_student_assessment_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course_student_assessment',
					key: 'id',
				},
			},
			day: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			airport: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			airstrip: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			elevation: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			meteorology: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			temperature: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			qnh: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			wind: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			weight: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},

			flaps: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			power: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			comments: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'course_student_assessment_day',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_course_student_assessment_day_course_idx',
					using: 'BTREE',
					fields: [{ name: 'course_id' }],
				},
				{
					name: 'fk_course_student_assessment_day_student1_idx',
					using: 'BTREE',
					fields: [{ name: 'student_id' }],
				},
				{
					name: 'fk_course_student_assessment_day_course_student_idx',
					using: 'BTREE',
					fields: [{ name: 'course_student_id' }],
				},
				{
					name: 'fk_course_student_assessment_day_course_student_assessment_idx',
					using: 'BTREE',
					fields: [{ name: 'course_student_assessment_id' }],
				},
			],
		}
	);
};

export const course_student_assessment_lesson_day = (
	sequelize,
	DataTypes
) => {
	return sequelize.define(
		'course_student_assessment_lesson_day',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			course_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course',
					key: 'id',
				},
			},
			student_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'student',
					key: 'id',
				},
			},
			course_student_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course_student',
					key: 'id',
				},
			},
			course_student_assessment_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course_student_assessment',
					key: 'id',
				},
			},
			course_student_assessment_day_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course_student_assessment_day',
					key: 'id',
				},
			},
			subject_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'subject',
					key: 'id',
				},
			},
			subject_lesson_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'subject_lesson',
					key: 'id',
				},
			},
			subject_days_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'subject_days',
					key: 'id',
				},
			},
			subject_lesson_days_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'subject_lesson_days',
					key: 'id',
				},
			},

			item: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			value: {
				type: DataTypes.INTEGER,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'course_student_assessment_lesson_day',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_course_student_assessment_lesson_day_course_idx',
					using: 'BTREE',
					fields: [{ name: 'course_id' }],
				},
				{
					name: 'fk_course_student_assessment_lesson_day_student1_idx',
					using: 'BTREE',
					fields: [{ name: 'student_id' }],
				},
				{
					name: 'fk_course_student_assessment_lesson_day_course_student_idx',
					using: 'BTREE',
					fields: [{ name: 'course_student_id' }],
				},
				{
					name: 'fk_c_s_a_d_d_course_student_assessment_idx',
					using: 'BTREE',
					fields: [{ name: 'course_student_assessment_id' }],
				},
				{
					name: 'fk_c_s_a_d_d_course_student_assessment_day_idx',
					using: 'BTREE',
					fields: [{ name: 'course_student_assessment_day_id' }],
				},
				{
					name: 'fk_course_student_assessment_lesson_day_subject_idx',
					using: 'BTREE',
					fields: [{ name: 'subject_id' }],
				},
				{
					name: 'fk_course_student_assessment_lesson_day_subject_lesson_idx',
					using: 'BTREE',
					fields: [{ name: 'subject_lesson_id' }],
				},
				{
					name: 'fk_course_student_assessment_lesson_day_subject_days_idx',
					using: 'BTREE',
					fields: [{ name: 'subject_days_id' }],
				},
				{
					name: 'fk_c_s_a_l_d_subject_lesson_days_idx',
					using: 'BTREE',
					fields: [{ name: 'subject_lesson_days_id' }],
				},
			],
		}
	);
};

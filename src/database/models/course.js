export default (sequelize, DataTypes) => {
	return sequelize.define(
		'course',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},
			hours: {
				type: DataTypes.FLOAT,
				allowNull: true,
				defaultValue: 0,
			},
			plane_model: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			days: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 0,
			},
			status: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 1,
			},
			course_type_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course_type',
					key: 'id',
				},
			},
			course_level_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course_level',
					key: 'id',
				},
			},
		},
		{
			sequelize,
			tableName: 'course',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
			],
		}
	);
};

export const course_type = (sequelize, DataTypes) => {
	return sequelize.define(
		'course_type',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'course_type',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
			],
		}
	);
};

export const course_level = (sequelize, DataTypes) => {
	return sequelize.define(
		'course_level',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'course_level',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
			],
		}
	);
};

export const course_student = (sequelize, DataTypes) => {
	return sequelize.define(
		'course_student',
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
			date: {
				type: DataTypes.DATEONLY,
				allowNull: true,
			},
			score: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			approve: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
			},
			student_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'student',
					key: 'id',
				},
			},
			code: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			type_trip: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 1,
			},
			license: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 1,
			},
			regulation: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 1,
			},
			status: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			tableName: 'course_student',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_course_student_course_idx',
					using: 'BTREE',
					fields: [{ name: 'course_id' }],
				},
				{
					name: 'fk_course_student_student1_idx',
					using: 'BTREE',
					fields: [{ name: 'student_id' }],
				},
			],
		}
	);
};

export const course_student_test = (sequelize, DataTypes) => {
	return sequelize.define(
		'course_student_test',
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
			score: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			approve: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
			},
			test_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'test',
					key: 'id',
				},
			},
			attempts: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 1,
			},
			course_student_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course_student',
					key: 'id',
				},
			},
			date: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			student_id: {
				type: DataTypes.INTEGER,
				allowNull: true,
				references: {
					model: 'student',
					key: 'id',
				},
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
		},
		{
			sequelize,
			tableName: 'course_student_test',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_course_student_test_course_idx',
					using: 'BTREE',
					fields: [{ name: 'course_id' }],
				},
				{
					name: 'fk_course_student_test_test_idx',
					using: 'BTREE',
					fields: [{ name: 'test_id' }],
				},
				{
					name: 'fk_course_student_test_course_student_idx',
					using: 'BTREE',
					fields: [{ name: 'course_student_id' }],
				},
				{
					name: 'fk_course_student_test_student1_idx',
					using: 'BTREE',
					fields: [{ name: 'student_id' }],
				},
			],
		}
	);
};

export const course_student_test_question = (
	sequelize,
	DataTypes
) => {
	return sequelize.define(
		'course_student_test_question',
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
			test_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'test',
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
			course_student_test_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course_student_test',
					key: 'id',
				},
			},
			question_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'question',
					key: 'id',
				},
			},
			Answered: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 0,
			},
			status: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			tableName: 'course_student_test_question',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_course_student_test_question_course_idx',
					using: 'BTREE',
					fields: [{ name: 'course_id' }],
				},
				{
					name: 'fk_course_student_test_question_test_idx',
					using: 'BTREE',
					fields: [{ name: 'test_id' }],
				},
				{
					name: 'fk_course_student_test_question_course_student_idx',
					using: 'BTREE',
					fields: [{ name: 'course_student_id' }],
				},
				{
					name: 'fk_course_student_test_question_course_student_test_idx',
					using: 'BTREE',
					fields: [{ name: 'course_student_test_id' }],
				},
				{
					name: 'fk_course_student_test_question_question_idx',
					using: 'BTREE',
					fields: [{ name: 'question_id' }],
				},
				{
					name: 'fk_course_student_test_question_student1_idx',
					using: 'BTREE',
					fields: [{ name: 'student_id' }],
				},
			],
		}
	);
};

export const course_student_test_answer = (sequelize, DataTypes) => {
	return sequelize.define(
		'course_student_test_answer',
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
			test_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'test',
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
			resp: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			course_student_test_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course_student_test',
					key: 'id',
				},
			},
			course_student_test_question_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course_student_test_question',
					key: 'id',
				},
			},
			question_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'question',
					key: 'id',
				},
			},
			score: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			status: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			tableName: 'course_student_test_answer',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_course_student_test_answer_course_idx',
					using: 'BTREE',
					fields: [{ name: 'course_id' }],
				},
				{
					name: 'fk_course_student_test_answer_test_idx',
					using: 'BTREE',
					fields: [{ name: 'test_id' }],
				},
				{
					name: 'fk_course_student_test_answer_course_student_idx',
					using: 'BTREE',
					fields: [{ name: 'course_student_id' }],
				},
				{
					name: 'fk_course_student_test_answer_course_student_test_idx',
					using: 'BTREE',
					fields: [{ name: 'course_student_test_id' }],
				},
				{
					name: 'fk_course_student_test_answer_course_student_test_question_idx',
					using: 'BTREE',
					fields: [{ name: 'course_student_test_question_id' }],
				},
				{
					name: 'fk_course_student_test_answer_question_idx',
					using: 'BTREE',
					fields: [{ name: 'question_id' }],
				},

				{
					name: 'fk_course_student_test_answer_student1_idx',
					using: 'BTREE',
					fields: [{ name: 'student_id' }],
				},
			],
		}
	);
};

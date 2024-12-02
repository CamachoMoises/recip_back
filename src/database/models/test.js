export default (sequelize, DataTypes) => {
	return sequelize.define(
		'test',
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
			code: {
				type: DataTypes.STRING(50),
				allowNull: false,
			},
			status: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			tableName: 'test',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_test_course_idx',
					using: 'BTREE',
					fields: [{ name: 'course_id' }],
				},
			],
		}
	);
};

export const question_type = (sequelize, DataTypes) => {
	return sequelize.define(
		'question_type',
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
			tableName: 'question_type',
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

export const question = (sequelize, DataTypes) => {
	return sequelize.define(
		'question',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			header: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},

			course_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course',
					key: 'id',
				},
			},
			question_type_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'question_type',
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
			status: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			tableName: 'question',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_question_course_idx',
					using: 'BTREE',
					fields: [{ name: 'course_id' }],
				},
				{
					name: 'fk_question_question_type_idx',
					using: 'BTREE',
					fields: [{ name: 'question_type_id' }],
				},
				{
					name: 'fk_question_test_idx',
					using: 'BTREE',
					fields: [{ name: 'test_id' }],
				},
			],
		}
	);
};

export const answer = (sequelize, DataTypes) => {
	return sequelize.define(
		'answer',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			value: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},

			course_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course',
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
			test_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'test',
					key: 'id',
				},
			},
			is_correct: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 0,
			},
			status: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			tableName: 'answer',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_answer_course_idx',
					using: 'BTREE',
					fields: [{ name: 'course_id' }],
				},
				{
					name: 'fk_answer_question_idx',
					using: 'BTREE',
					fields: [{ name: 'question_id' }],
				},
				{
					name: 'fk_answer_test_idx',
					using: 'BTREE',
					fields: [{ name: 'test_id' }],
				},
			],
		}
	);
};

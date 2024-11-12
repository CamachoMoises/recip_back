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

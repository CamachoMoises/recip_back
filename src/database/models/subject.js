export default (sequelize, DataTypes) => {
	return sequelize.define(
		'subject',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			order: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},
			status: {
				type: DataTypes.TINYINT,
				allowNull: true,
				defaultValue: 1,
			},
			course_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course',
					key: 'id',
				},
			},
		},
		{
			sequelize,
			tableName: 'subject',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_subject_course1_idx',
					using: 'BTREE',
					fields: [{ name: 'course_id' }],
				},
			],
		}
	);
};
export const subject_days = (sequelize, DataTypes) => {
	return sequelize.define(
		'subject_days',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			subject_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'subject',
					key: 'id',
				},
			},
			course_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course',
					key: 'id',
				},
			},
			day: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			classTime: {
				type: DataTypes.INTEGER,
				allowNull: true,
				defaultValue: 1,
			},
			status: {
				type: DataTypes.TINYINT,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			tableName: 'subject_days',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_subject_days_subject1_idx',
					using: 'BTREE',
					fields: [{ name: 'subject_id' }],
				},
				{
					name: 'fk_subject_days_course1_idx',
					using: 'BTREE',
					fields: [{ name: 'course_id' }],
				},
			],
		}
	);
};

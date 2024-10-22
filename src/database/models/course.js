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
			hours: {
				type: DataTypes.FLOAT,
				allowNull: true,
				defaultValue: 0,
			},
			type: {
				type: DataTypes.INTEGER,
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

export const course_days = (sequelize, DataTypes) => {
	return sequelize.define(
		'course_days',
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
				primaryKey: true,
				references: {
					model: 'course',
					key: 'id',
				},
			},
			cant: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			status: {
				type: DataTypes.TINYINT,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			tableName: 'course_days',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }, { name: 'course_id' }],
				},
				{
					name: 'fk_course_days_course1_idx',
					using: 'BTREE',
					fields: [{ name: 'course_id' }],
				},
			],
		}
	);
};

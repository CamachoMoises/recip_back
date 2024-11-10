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

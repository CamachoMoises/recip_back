export default (sequelize, DataTypes) => {
	return sequelize.define('evaluation', {
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
	});
};

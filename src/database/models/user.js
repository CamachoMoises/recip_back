export default (sequelize, DataTypes) => {
	const user = sequelize.define('User', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			allowNull: false,
			unique: true,
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		email: {
			type: DataTypes.TEXT,
			// allowNull: false,
			unique: true,
		},
		firstName: {
			type: DataTypes.TEXT,
			// allowNull: false
		},
		lastName: {
			type: DataTypes.STRING,
			// allowNull: false
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: sequelize.NOW,
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: sequelize.NOW,
		},
	});

	return user;
};

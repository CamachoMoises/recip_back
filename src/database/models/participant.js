export default (sequelize, DataTypes) => {
	const participant = sequelize.define('participant', {
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
		firstName: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING(255),
			// allowNull: false
		},
		docNumber: {
			type: DataTypes.INTEGER,
			allowNull: false,
			unique: true,
		},
		email: {
			type: DataTypes.STRING(255),
			// allowNull: false,
			unique: true,
		},
		phone: {
			type: DataTypes.STRING(255),
			// allowNull: false,
			unique: true,
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
	return participant;
};

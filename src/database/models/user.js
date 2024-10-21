export default (sequelize, DataTypes) => {
	const user = sequelize.define(
		'user',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			uuid: {
				type: DataTypes.CHAR(36),
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},
			doc_number: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			phone: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			last_name: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING(200),
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING(500),
				allowNull: true,
			},
			is_superuser: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 0,
			},
			is_staff: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 0,
			},
			is_active: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			tableName: 'user',
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

	return user;
};

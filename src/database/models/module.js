export default (sequelize, DataTypes) => {
	return sequelize.define(
		'module',
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
			tableName: 'module',
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

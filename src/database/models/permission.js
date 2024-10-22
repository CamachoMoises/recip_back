export default (sequelize, DataTypes) => {
	return sequelize.define(
		'permission',
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
			module_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'module',
					key: 'id',
				},
			},
			status: {
				type: DataTypes.TINYINT,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			tableName: 'permission',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_permission_module1_idx',
					using: 'BTREE',
					fields: [{ name: 'module_id' }],
				},
			],
		}
	);
};

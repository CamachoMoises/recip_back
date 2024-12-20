export default (sequelize, DataTypes) => {
	return sequelize.define(
		'group',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(45),
				allowNull: true,
			},
			is_active: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			tableName: 'group',
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

export const group_permission = (sequelize, DataTypes) => {
	return sequelize.define(
		'group_permission',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(45),
				allowNull: false,
			},
			group_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'group',
					key: 'id',
				},
			},
			permission_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'permission',
					key: 'id',
				},
			},
		},
		{
			sequelize,
			tableName: 'group_permission',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_group_permission_group1_idx',
					using: 'BTREE',
					fields: [{ name: 'group_id' }],
				},
				{
					name: 'fk_group_permission_permission1_idx',
					using: 'BTREE',
					fields: [{ name: 'permission_id' }],
				},
			],
		}
	);
};

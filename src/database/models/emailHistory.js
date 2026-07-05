export default (sequelize, DataTypes) => {
	return sequelize.define(
		'email_history',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			email: {
				type: DataTypes.STRING(255),
				allowNull: false,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'user',
					key: 'id',
				},
			},
			nombre_archivo: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},
			fecha: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			tipo: {
				type: DataTypes.STRING(100),
				allowNull: false,
				defaultValue: 'correo',
			},
			descripcion: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			modulo: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'email_history',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
			],
		},
	);
};

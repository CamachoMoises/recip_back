export default (sequelize, DataTypes) => {
	return sequelize.define(
		'attendance_signature',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			attendance_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				unique: true,
				references: {
					model: 'attendance',
					key: 'id',
				},
			},
			signature_url: {
				type: DataTypes.STRING(500),
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'attendance_signature',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'uq_attendance_signature_attendance',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'attendance_id' }],
				},
			],
		},
	);
};

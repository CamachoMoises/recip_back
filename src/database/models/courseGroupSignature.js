export default (sequelize, DataTypes) => {
	return sequelize.define(
		'course_group_signature',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			course_group_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course_group',
					key: 'id',
				},
			},
			day_number: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			signature_number: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 1,
			},
			signature_url: {
				type: DataTypes.STRING(500),
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'course_group_signature',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'uq_course_group_signature_group_day_number',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'course_group_id' }, { name: 'day_number' }, { name: 'signature_number' }],
				},
				{
					name: 'fk_course_group_signature_course_group_idx',
					using: 'BTREE',
					fields: [{ name: 'course_group_id' }],
				},
			],
		},
	);
};

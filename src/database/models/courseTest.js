export default (sequelize, DataTypes) => {
	return sequelize.define(
		'course_test',
		{
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
			test_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'test',
					key: 'id',
				},
			},
		},
		{
			sequelize,
			tableName: 'course_test',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'uq_course_test_course_id_test_id',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'course_id' }, { name: 'test_id' }],
				},
				{
					name: 'fk_course_test_course_idx',
					using: 'BTREE',
					fields: [{ name: 'course_id' }],
				},
				{
					name: 'fk_course_test_test_idx',
					using: 'BTREE',
					fields: [{ name: 'test_id' }],
				},
			],
		}
	);
};

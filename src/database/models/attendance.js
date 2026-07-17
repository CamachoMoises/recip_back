export default (sequelize, DataTypes) => {
	return sequelize.define(
		'attendance',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			course_student_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course_student',
					key: 'id',
				},
			},
			date: {
				type: DataTypes.DATEONLY,
				allowNull: false,
			},
			attendance_status_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'attendance_status',
					key: 'id',
				},
			},
		comments: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		},
		{
			sequelize,
			tableName: 'attendance',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_attendance_course_student_idx',
					using: 'BTREE',
					fields: [{ name: 'course_student_id' }],
				},
				{
					name: 'fk_attendance_status_idx',
					using: 'BTREE',
					fields: [{ name: 'attendance_status_id' }],
				},
				{
					name: 'uq_attendance_course_student_date',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'course_student_id' }, { name: 'date' }],
				},
			],
		}
	);
};

export const attendance_status = (sequelize, DataTypes) => {
	return sequelize.define(
		'attendance_status',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(100),
				allowNull: false,
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'attendance_status',
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

export default (sequelize, DataTypes) => {
	return sequelize.define(
		'schedule',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			instructor_id: {
				type: DataTypes.INTEGER,
				references: {
					model: 'instructor',
					key: 'id',
				},
			},
			student_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'student',
					key: 'id',
				},
			},
			subject_days_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'subject_days',
					key: 'id',
				},
			},
			subject_days_subject_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'subject_days',
					key: 'subject_id',
				},
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
				allowNull: true,
			},
			hour: {
				type: DataTypes.TIME,
				allowNull: true,
			},
			classTime: {
				type: DataTypes.FLOAT,
				allowNull: true,
				defaultValue: 0,
			},
		},
		{
			sequelize,
			tableName: 'schedule',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'subject_days_subject_id',
					using: 'BTREE',
					fields: [{ name: 'subject_days_subject_id' }],
				},
				{
					name: 'fk_schedule_student1_idx',
					using: 'BTREE',
					fields: [{ name: 'student_id' }],
				},
				{
					name: 'fk_schedule_subject_days1_idx',
					using: 'BTREE',
					fields: [
						{ name: 'subject_days_id' },
						{ name: 'subject_days_subject_id' },
					],
				},
				{
					name: 'fk_schedule_course_student1_idx',
					using: 'BTREE',
					fields: [{ name: 'course_student_id' }],
				},
				{
					name: 'schedule_ibfk_1',
					using: 'BTREE',
					fields: [{ name: 'instructor_id' }],
				},
			],
		}
	);
};

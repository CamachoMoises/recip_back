export default (sequelize, DataTypes) => {
	return sequelize.define(
		'rating',
		{
			instructor_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: {
					model: 'instructor',
					key: 'id',
				},
			},
			student_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: {
					model: 'student',
					key: 'id',
				},
			},
			subject_days_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: {
					model: 'subject_days',
					key: 'id',
				},
			},
			subject_days_subject_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: {
					model: 'subject_days',
					key: 'subject_id',
				},
			},
			subject_days_course_days_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: {
					model: 'subject_days',
					key: 'course_days_id',
				},
			},
			subject_days_course_days_course_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: {
					model: 'subject_days',
					key: 'course_days_course_id',
				},
			},
			value: {
				type: DataTypes.STRING(10),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: 'rating',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [
						{ name: 'instructor_id' },
						{ name: 'student_id' },
						{ name: 'subject_days_id' },
						{ name: 'subject_days_subject_id' },
						{ name: 'subject_days_course_days_id' },
						{ name: 'subject_days_course_days_course_id' },
					],
				},
				{
					name: 'fk_rating_student1_idx',
					using: 'BTREE',
					fields: [{ name: 'student_id' }],
				},
				{
					name: 'fk_rating_subject_days1_idx',
					using: 'BTREE',
					fields: [
						{ name: 'subject_days_id' },
						{ name: 'subject_days_subject_id' },
						{ name: 'subject_days_course_days_id' },
						{ name: 'subject_days_course_days_course_id' },
					],
				},
			],
		}
	);
};

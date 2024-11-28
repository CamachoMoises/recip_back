export default (sequelize, DataTypes) => {
	return sequelize.define(
		'rating',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			instructor_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
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
			subject_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'subject_days',
					key: 'id',
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
			value: {
				type: DataTypes.DOUBLE,
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
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_rating_subject_id',
					using: 'BTREE',
					fields: [{ name: 'subject_id' }],
				},
				{
					name: 'fk_rating_subject_days_id',
					using: 'BTREE',
					fields: [{ name: 'subject_days_id' }],
				},
				{
					name: 'fk_rating_student1_idx',
					using: 'BTREE',
					fields: [{ name: 'student_id' }],
				},
				{
					name: 'fk_rating_course_student1_idx',
					using: 'BTREE',
					fields: [{ name: 'course_student_id' }],
				},
				{
					name: 'fk_rating_instructor_idx',
					using: 'BTREE',
					fields: [{ name: 'instructor_id' }],
				},
			],
		}
	);
};

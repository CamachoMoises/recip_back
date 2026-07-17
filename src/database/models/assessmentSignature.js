export default (sequelize, DataTypes) => {
	return sequelize.define(
		'assessment_signature',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			csad_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'course_student_assessment_day',
					key: 'id',
				},
			},
			signature_type: {
				type: DataTypes.TINYINT,
				allowNull: false,
			},
			signature_url: {
				type: DataTypes.STRING(500),
				allowNull: true,
			},
		},
		{
			sequelize,
			tableName: 'assessment_signature',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'uq_assessment_signature_csad_type',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'csad_id' }, { name: 'signature_type' }],
				},
				{
					name: 'fk_assessment_signature_csad_idx',
					using: 'BTREE',
					fields: [{ name: 'csad_id' }],
				},
			],
		},
	);
};

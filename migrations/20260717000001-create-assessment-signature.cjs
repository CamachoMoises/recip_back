'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('assessment_signature', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			csad_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'course_student_assessment_day',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			signature_type: {
				type: Sequelize.TINYINT,
				allowNull: false,
			},
			signature_url: {
				type: Sequelize.STRING(500),
				allowNull: true,
			},
			created_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
			updated_at: {
				type: Sequelize.DATE,
				allowNull: false,
				defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
			},
		});

		await queryInterface.addIndex(
			'assessment_signature',
			['csad_id', 'signature_type'],
			{
				name: 'uq_assessment_signature_csad_type',
				unique: true,
				using: 'BTREE',
			},
		);

		await queryInterface.addIndex('assessment_signature', ['csad_id'], {
			name: 'fk_assessment_signature_csad_idx',
			using: 'BTREE',
		});
	},

	async down(queryInterface) {
		await queryInterface.dropTable('assessment_signature');
	},
};

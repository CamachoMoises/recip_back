'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('course_group_signature', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			course_group_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: 'course_group',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
			},
			day_number: {
				type: Sequelize.INTEGER,
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
			'course_group_signature',
			['course_group_id', 'day_number'],
			{
				name: 'uq_course_group_signature_group_day',
				unique: true,
				using: 'BTREE',
			},
		);

		await queryInterface.addIndex(
			'course_group_signature',
			['course_group_id'],
			{
				name: 'fk_course_group_signature_course_group_idx',
				using: 'BTREE',
			},
		);

		await queryInterface.removeColumn('course_group', 'signature_url');
	},

	async down(queryInterface) {
		await queryInterface.addColumn('course_group', 'signature_url', {
			type: Sequelize.STRING(500),
			allowNull: true,
		});

		await queryInterface.dropTable('course_group_signature');
	},
};

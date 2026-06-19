'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('course_group', {
			id: {
				type: Sequelize.INTEGER,
				autoIncrement: true,
				primaryKey: true,
				allowNull: false,
			},
			title: {
				type: Sequelize.STRING(500),
				allowNull: false,
			},
			code: {
				type: Sequelize.STRING(50),
				allowNull: false,
				unique: true,
			},
			user_code: {
				type: Sequelize.STRING(50),
				allowNull: true,
			},
			date: {
				type: Sequelize.DATEONLY,
				allowNull: true,
			},
			signature_url: {
				type: Sequelize.STRING(500),
				allowNull: true,
			},
			course_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: 'course',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
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

		await queryInterface.addIndex('course_group', ['course_id'], {
			name: 'fk_course_group_course_idx',
			using: 'BTREE',
		});

		await queryInterface.addColumn(
			'course_student',
			'course_group_id',
			{
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: 'course_group',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'SET NULL',
			},
		);

		await queryInterface.addIndex(
			'course_student',
			['course_group_id'],
			{
				name: 'fk_course_student_course_group_idx',
				using: 'BTREE',
			},
		);
	},

	async down(queryInterface) {
		await queryInterface.removeColumn(
			'course_student',
			'course_group_id',
		);
		await queryInterface.dropTable('course_group');
	},
};

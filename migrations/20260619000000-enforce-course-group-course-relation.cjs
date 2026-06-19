'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		// Change course_id from NULL to NOT NULL
		await queryInterface.changeColumn('course_group', 'course_id', {
			type: Sequelize.INTEGER,
			allowNull: false,
			references: {
				model: 'course',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'RESTRICT',
		});
	},

	async down(queryInterface, Sequelize) {
		// Revert course_id back to NULL
		await queryInterface.changeColumn('course_group', 'course_id', {
			type: Sequelize.INTEGER,
			allowNull: true,
			references: {
				model: 'course',
				key: 'id',
			},
			onUpdate: 'CASCADE',
			onDelete: 'SET NULL',
		});
	},
};

'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('course_group', 'status', {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: true,
		});

		await queryInterface.addIndex('course_group', ['status'], {
			name: 'idx_course_group_status',
			using: 'BTREE',
		});
	},

	async down(queryInterface) {
		await queryInterface.removeIndex('course_group', 'idx_course_group_status');
		await queryInterface.removeColumn('course_group', 'status');
	},
};

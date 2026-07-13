'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('course_group_signature', 'signature_number', {
			type: Sequelize.INTEGER,
			allowNull: false,
			defaultValue: 1,
		});

		await queryInterface.removeIndex(
			'course_group_signature',
			'uq_course_group_signature_group_day',
		);

		await queryInterface.addIndex(
			'course_group_signature',
			['course_group_id', 'day_number', 'signature_number'],
			{
				name: 'uq_course_group_signature_group_day_number',
				unique: true,
				using: 'BTREE',
			},
		);
	},

	async down(queryInterface) {
		await queryInterface.removeIndex(
			'course_group_signature',
			'uq_course_group_signature_group_day_number',
		);

		await queryInterface.addIndex(
			'course_group_signature',
			['course_group_id', 'day_number'],
			{
				name: 'uq_course_group_signature_group_day',
				unique: true,
				using: 'BTREE',
			},
		);

		await queryInterface.removeColumn('course_group_signature', 'signature_number');
	},
};

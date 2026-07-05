'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn('email_history', 'email', {
			type: Sequelize.STRING(255),
			allowNull: false,
			after: 'user_id',
		});
	},

	async down(queryInterface) {
		await queryInterface.removeColumn('email_history', 'email');
	},
};

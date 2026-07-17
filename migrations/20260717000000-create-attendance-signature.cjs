'use strict';

module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('attendance_signature', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false,
			},
			attendance_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				unique: true,
				references: {
					model: 'attendance',
					key: 'id',
				},
				onUpdate: 'CASCADE',
				onDelete: 'CASCADE',
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

		await queryInterface.addIndex('attendance_signature', ['attendance_id'], {
			name: 'uq_attendance_signature_attendance',
			unique: true,
			using: 'BTREE',
		});

		const [[{ count }]] = await queryInterface.sequelize.query(
			'SELECT COUNT(*) as count FROM attendance WHERE signature_url IS NOT NULL',
		);

		if (count > 0) {
			await queryInterface.sequelize.query(
				`INSERT INTO attendance_signature (attendance_id, signature_url, created_at, updated_at)
				 SELECT id, signature_url, NOW(), NOW() FROM attendance WHERE signature_url IS NOT NULL`,
			);
		}

		await queryInterface.removeColumn('attendance', 'signature_url');
	},

	async down(queryInterface) {
		await queryInterface.addColumn('attendance', 'signature_url', {
			type: Sequelize.STRING(500),
			allowNull: true,
		});

		const [[{ count }]] = await queryInterface.sequelize.query(
			'SELECT COUNT(*) as count FROM attendance_signature WHERE signature_url IS NOT NULL',
		);

		if (count > 0) {
			await queryInterface.sequelize.query(
				`UPDATE attendance a
				 INNER JOIN attendance_signature s ON a.id = s.attendance_id
				 SET a.signature_url = s.signature_url`,
			);
		}

		await queryInterface.dropTable('attendance_signature');
	},
};

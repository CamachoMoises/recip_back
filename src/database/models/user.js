export default (sequelize, DataTypes) => {
	return sequelize.define(
		'user',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				allowNull: false,
				unique: true,
			},
			name: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},
			doc_number: {
				type: DataTypes.INTEGER,
				allowNull: false, // No permite valores nulos
			},
			user_doc_type_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'user_doc_type',
					key: 'id',
				},
			},
			phone: {
				type: DataTypes.STRING(255),
				allowNull: true,
			},
			last_name: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},
			password: {
				type: DataTypes.STRING(200),
				allowNull: true,
			},
			email: {
				type: DataTypes.STRING(500),
				allowNull: false, // No permite valores nulos
				unique: true, // Define el campo como único
				validate: {
					isEmail: true, // Validación para asegurarse de que el formato sea un correo electrónico válido
				},
			},
			is_superuser: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 0,
			},
			is_staff: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 0,
			},
			is_active: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			tableName: 'user',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
			],
		}
	);
};

export const user_group = (sequelize, DataTypes) => {
	return sequelize.define(
		'user_group',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'user',
					key: 'id',
				},
			},
			group_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'group',
					key: 'id',
				},
			},
		},
		{
			sequelize,
			tableName: 'user_group',
			timestamps: false,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'user_group_user_id_group_id_unique',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'user_id' }, { name: 'group_id' }],
				},
				{
					name: 'fk_user_group_user1_idx',
					using: 'BTREE',
					fields: [{ name: 'user_id' }],
				},
				{
					name: 'fk_user_group_group1_idx',
					using: 'BTREE',
					fields: [{ name: 'group_id' }],
				},
			],
		}
	);
};

export const user_permission = (sequelize, DataTypes) => {
	return sequelize.define(
		'user_permission',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'user',
					key: 'id',
				},
			},
			permission_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'permission',
					key: 'id',
				},
			},
		},
		{
			sequelize,
			tableName: 'user_permission',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_user_permission_user1_idx',
					using: 'BTREE',
					fields: [{ name: 'user_id' }],
				},
				{
					name: 'fk_user_permission_permission1_idx',
					using: 'BTREE',
					fields: [{ name: 'permission_id' }],
				},
			],
		}
	);
};

export const student = (sequelize, DataTypes) => {
	return sequelize.define(
		'student',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'user',
					key: 'id',
				},
			},
			status: {
				type: DataTypes.TINYINT,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			tableName: 'student',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_student_user1_idx',
					using: 'BTREE',
					fields: [{ name: 'user_id' }],
				},
			],
		}
	);
};

export const instructor = (sequelize, DataTypes) => {
	return sequelize.define(
		'instructor',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {
					model: 'user',
					key: 'id',
				},
			},
			status: {
				type: DataTypes.TINYINT,
				allowNull: true,
				defaultValue: 1,
			},
		},
		{
			sequelize,
			tableName: 'instructor',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
				{
					name: 'fk_instructor_user1_idx',
					using: 'BTREE',
					fields: [{ name: 'user_id' }],
				},
			],
		}
	);
};

export const user_doc_type = (sequelize, DataTypes) => {
	return sequelize.define(
		'user_doc_type',
		{
			id: {
				autoIncrement: true,
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING(500),
				allowNull: false,
			},
			symbol: {
				type: DataTypes.STRING(500),
				allowNull: false,
				unique: true,
			},
		},
		{
			sequelize,
			tableName: 'user_doc_type',
			timestamps: true,
			indexes: [
				{
					name: 'PRIMARY',
					unique: true,
					using: 'BTREE',
					fields: [{ name: 'id' }],
				},
			],
		}
	);
};

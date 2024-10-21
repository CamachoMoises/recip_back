import { Sequelize, DataTypes } from 'sequelize';
// import loadUser from './models/user.js';
import loadParticipant from './models/participant.js';
import loadGroup from './models/group.js';
import loadUser from './models/user.js';
import loadModule from './models/module.js';

const sequelize = new Sequelize('recip_db', 'moises', '0000', {
	host: 'localhost',
	dialect: 'mysql',
	port: 3306,
	define: {
		underscored: true, // Esto hará que Sequelize use snake_case por defecto
	},
});

const Participant = loadParticipant(sequelize, DataTypes);
const Group = loadGroup(sequelize, DataTypes);
const User = loadUser(sequelize, DataTypes);
const Module = loadModule(sequelize, DataTypes);

const models = { Participant, Group, User, Module };

export { sequelize, models };

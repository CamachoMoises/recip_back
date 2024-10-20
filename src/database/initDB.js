import { Sequelize, DataTypes } from 'sequelize';
// import loadUser from './models/user.js';
import loadParticipant from './models/participant.js';
import loadGroup from './models/group.js';

const sequelize = new Sequelize('recip_db', 'moises', '0000', {
	host: 'localhost',
	dialect: 'mysql',
	port: 3306,
});

// const User = loadUser(sequelize, DataTypes);

const Participant = loadParticipant(sequelize, DataTypes);

const Group = loadGroup(sequelize, DataTypes);

const models = { Participant, Group };

export { sequelize, models };

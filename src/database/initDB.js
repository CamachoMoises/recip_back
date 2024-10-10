import { Sequelize, DataTypes } from 'sequelize';
// import loadUser from './models/user.js';
import loadParticipant from './models/participant.js';

const sequelize = new Sequelize(
	'bgoescmoyuocwga4lecd',
	'uy0mqaudoaohlgll',
	'9wED4qXlLDQZ3NWMwgKZ',
	{
		host: 'bgoescmoyuocwga4lecd-mysql.services.clever-cloud.com',
		dialect: 'mysql',
		port: 3306,
	}
);

// const User = loadUser(sequelize, DataTypes);
const Participant = loadParticipant(sequelize, DataTypes);

const models = { Participant };

export { sequelize, models };

import { Sequelize, DataTypes } from 'sequelize';
import loadUser from './models/user.js';

const sequelize = new Sequelize('luna_db', 'moises', '00000', {
	host: '127.0.0.1',
	dialect: 'mysql',
	port: 3307,
});

const User = loadUser(sequelize, DataTypes);

const models = { User };

export { sequelize, models };

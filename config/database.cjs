// @ts-check
/// <reference types="node" />
'use strict';

require('dotenv').config();

module.exports = {
	development: {
		username: process.env.DB_USER_CLEVER,
		password: process.env.DB_PASSWORD_CLEVER,
		database: process.env.DB_NAME_CLEVER,
		host: process.env.DB_HOST_CLEVER,
		port: parseInt(process.env.DB_PORT_CLEVER),
		dialect: 'mysql',
		define: {
			underscored: true,
		},
	},
	production: {
		username: process.env.DB_USER_CLEVER,
		password: process.env.DB_PASSWORD_CLEVER,
		database: process.env.DB_NAME_CLEVER,
		host: process.env.DB_HOST_CLEVER,
		port: parseInt(process.env.DB_PORT_CLEVER),
		dialect: 'mysql',
		define: {
			underscored: true,
		},
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	},
};

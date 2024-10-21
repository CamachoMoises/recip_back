import { models } from '../initDB.js';

const { User } = models;

const getAllUsers = async () => User.findAll();

export { getAllUsers };

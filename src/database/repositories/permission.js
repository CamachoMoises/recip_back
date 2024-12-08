import { models } from '../initDB.js';

const { Permission } = models;

const getAllPermissions = async () => await Permission.findAll();

export { getAllPermissions };

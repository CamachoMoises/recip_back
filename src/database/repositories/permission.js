import { models } from '../initDB.js';

const { Permission } = models;

const getAllPermissions = async () => Permission.findAll();

export { getAllPermissions };

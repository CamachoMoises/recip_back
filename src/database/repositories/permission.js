import { models } from '../index.js';

const { Permission } = models;

const getAllPermissions = async () => await Permission.findAll();

export { getAllPermissions };

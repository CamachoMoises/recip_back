import { models } from '../initDB.js';

const { Group } = models;

// const publicAttributes = { exclude: ['id'] };
const getAllGroups = async () => Group.findAll();

export { getAllGroups };

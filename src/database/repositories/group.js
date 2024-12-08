import { models } from '../initDB.js';

const { Group } = models;

// const publicAttributes = { exclude: ['id'] };
const getAllGroups = async () => await Group.findAll();

export { getAllGroups };

import { models } from '../initDB.js';

const { Module } = models;

const getAllModules = async () => await Module.findAll();

export { getAllModules };

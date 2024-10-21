import { models } from '../initDB.js';

const { Module } = models;

const getAllModules = async () => Module.findAll();

export { getAllModules };

import { models } from '../index.js';

const { Module } = models;

const getAllModules = async () => await Module.findAll();

export { getAllModules };

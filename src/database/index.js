import sequelize, {
	setDbConnected,
	onDbConnectedChange,
} from './connection.js';
import models from './models/index.js';
import { setupAssociations } from './associations.js';

// Set up all associations
setupAssociations(models);

// Export everything
export { sequelize, models, setDbConnected, onDbConnectedChange };

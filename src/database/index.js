import Sequelize from 'sequelize';

import postgresConfig from '../config/pg-database';
import User from '../app/models/User';

const models = [User];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(postgresConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();

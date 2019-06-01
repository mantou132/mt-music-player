import Sequelize from 'sequelize';
import config from 'config';

const sequelize = new Sequelize(
  config.get('postgres.database'),
  config.get('postgres.username'),
  config.get('postgres.password'),
  {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

export default sequelize;

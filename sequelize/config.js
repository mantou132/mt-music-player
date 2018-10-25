module.exports = {
  development: {
    dialect: 'postgres',
    host: 'localhost',
    database: 'mt-music-player',
    username: 'mt',
    password: '123123',
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOSTNAME,
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL',
  },
};

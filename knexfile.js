module.exports = {
  local: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      port: 3306,
      user: 'root',
      password: null,
      database: 'test',
    },
  },
  development: {
    client: 'mysql',
    connection: process.env.DATABASE_URL,
  },
  production: {
    client: 'mysql',
    connection: process.env.DATABASE_URL,
  },
};

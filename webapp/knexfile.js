const { config } = require('./dist/config/config');

module.exports = {
  ...config.db,
  migrations: {
    directory: './migrations',
    table_name: 'migrations',
  }
}

module.exports = {
  client: 'postgres',
  connection: 'postgres://test:test@localhost:5432/pixelpal',
  migrations: {
    directory: './migrations',
    table_name: 'migrations',
  }
}

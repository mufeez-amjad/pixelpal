// Update with your config settings.

module.exports = {
	client: 'sqlite3',
	connection: {
		filename: '.db/pixelpal.db'
	},
	migrations: {
		tableName: 'migrations'
	}
};

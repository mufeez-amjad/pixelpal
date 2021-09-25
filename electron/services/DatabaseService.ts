import type { Database } from 'sqlite3';
const sqlite3 = require('sqlite3').verbose();

class DatabaseService {
	connection: Database;

	constructor() {
		// connect to DB
		this.connection = new sqlite3.Database(
			`${__dirname}/pixelpal.db`,
			(err: { message: any }) => {
				if (err) {
					console.error(err.message);
				} else {
					console.log('Connected to the pixelpal database.');
				}
			}
		);
	}

	query(query: string): object {
		console.log('RUNNING QUERY ' + query);
		return {};
		// return this.connection.get(query);
	}
}

export default DatabaseService;

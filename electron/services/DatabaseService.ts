import type { Database } from 'sqlite3';
const sqlite3 = require('sqlite3').verbose();

class DatabaseService {
	connection: Database;

	constructor(file: string) {
		// connect to DB
		this.connection = new sqlite3.Database(
			file,
			(err: { message: any }) => {
				if (err) {
					console.error(err.message);
				} else {
					console.log('Connected to the pixelpal database.');
					console.log(`db file: ${file}`);
				}
			}
		);

		this.init();
	}

	// TODO: use ORM or sql builder library :)?
	private init() {
		const sql = `
            CREATE TABLE IF NOT EXISTS habits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT)`;
		return this.connection.run(sql);
	}

	findAllHabits(): Promise<Array<object>> {
		return new Promise((res, rej) => {
			this.connection.all('SELECT * FROM habits;', (err, rows) => {
				if (err) {
					rej(err);
				} else {
					res(rows);
				}
			});
		});
	}

	insertHabit(habit: object): Promise<boolean> {
		console.log(habit);
		return new Promise((res, rej) => {
			this.connection.run('SELECT 1;', err => {
				if (err) rej(err);
				res(true);
			});
		});
	}

	query(query: string): object {
		console.log('RUNNING QUERY ' + query);
		return {};
		// return this.connection.get(query);
	}
}

export default DatabaseService;

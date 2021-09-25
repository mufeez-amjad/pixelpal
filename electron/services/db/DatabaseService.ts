import type { Database } from 'sqlite3';
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

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
					console.log(`	db file: ${file}`);
				}
			}
		);

		// set up db (create tables if they don't exist, etc)
		this.init();
	}

	private init() {
		const initQuery = fs
			.readFileSync('electron/services/db/sql/init.sql')
			.toString();
		this.connection.exec(initQuery);
	}

	findAllHabits(): Promise<Array<object>> {
		return new Promise((res, rej) => {
			this.connection.all('SELECT * FROM habits;', (err, rows) => {
				if (err) rej(err);
				res(rows);
			});
		});
	}

	// TODO: use ORM or sql builder library :)?
	insertHabit(habit: {
		name: string;
		frequency: number;
		startTime: number;
		endTime: number;
		days: string;
	}): Promise<boolean> {
		console.log(habit);
		return new Promise((res, rej) => {
			const query = `
            INSERT INTO habits(name, frequency, days, start_time, end_time, last_completed_at) 
                VALUES(
                    '${habit.name}',
					${habit.frequency},
					'${habit.days}',
					'${habit.startTime}',
					'${habit.endTime}',
                    null
                );
			`;

			this.connection.exec(query, err => {
				if (err) rej(err);
				res(true);
			});
		});
	}
}

export default DatabaseService;

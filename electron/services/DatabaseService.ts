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
		// TODO: make better schema system (migrations?)

		// habits:
		//      id: unique id
		//      name: habit name
		//      last_completed_at: timestamp (text, sqlite does not have date/time types)
		//                         that habit was most recently completed at

		// habit_triggers:
		//      id: unique id
		//      habit_id: FK to habit
		//      interval: how often the reminders appear (in minutes)
		//      days: string representing days to trigger on (TODO: find better solution)
		//            eg: MWRSU = trigger on mondays, wednesdays, thursdays, saturdays, and sundays

		// M = Monday
		// T = Tuesday
		// W = Wednesday
		// R = Thursday
		// F = Friday
		// S = Saturday
		// U = Sunday

		const sql = `
            CREATE TABLE IF NOT EXISTS habits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE,
                last_completed_at TEXT
            );
            
            CREATE TABLE IF NOT EXISTS habit_triggers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                habit_id INTEGER,
                interval INTEGER,
                days TEXT,
                FOREIGN KEY(habit_id) REFERENCES habits(id)
            );
            `;
		return this.connection.exec(sql);
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

	findAllHabitTriggers(): Promise<Array<object>> {
		return new Promise((res, rej) => {
			this.connection.all(
				'SELECT * FROM habit_triggers;',
				(err, rows) => {
					if (err) {
						rej(err);
					} else {
						res(rows);
					}
				}
			);
		});
	}

	insertHabit(habit: {
		name: string;
		interval: number;
		days: string;
	}): Promise<boolean> {
		console.log(habit);
		return new Promise((res, rej) => {
			const query = `
            INSERT INTO habits(name, last_completed_at) 
                VALUES(
                    '${habit.name}',
                    null
                );
                
            INSERT INTO habit_triggers(habit_id, interval, days) 
                VALUES(
                    (SELECT id FROM habits WHERE name = '${habit.name}'),
                    ${habit.interval},
                    '${habit.days}'
                )`;
			console.log(query);

			this.connection.exec(query, err => {
				if (err) rej(err);
				res(true);
			});
		});
	}
}

export default DatabaseService;

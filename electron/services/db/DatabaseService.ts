import { Knex } from 'knex';
import { app } from 'electron';
import { calculateNextReminderAt } from '../../helpers';
import { CreateHabitRequest, Habit, HabitEventCounts } from '../../types';
import path from 'path';
import fs from 'fs';
import knex from 'knex';

const dbFile = app.isPackaged
	? path.join(app.getPath('userData'), 'pixelpal.db')
	: '.db/pixelpal.db';

export class DatabaseService {
	knex: Knex;

	constructor() {
		this.knex = knex({
			client: 'sqlite3',
			connection: {
				filename: dbFile
			},
			migrations: {
				tableName: 'migrations',
				directory: path.join(__dirname, '../migrations/')
			}
		});
	}

	getAllHabits(day?: string): Promise<Array<Habit>> {
		let query = this.knex.select().table('habits');
		if (day) {
			query = query.where('days', 'like', `%${day}%`);
		}
		return query;
	}

	getTodayEventCountsForHabit(habit: Habit): Promise<any> {
		const targetDate = `date(${
			Date.now() / 1000
		}, 'unixepoch', 'start of day')`;

		return this.knex
			.select(
				'habit_id',
				'type',
				this.knex.raw('count() as `num_events`')
			)
			.table('habit_events')
			.where(
				this.knex.raw('date(timestamp/1000, \'unixepoch\')'),
				'=',
				this.knex.raw(targetDate)
			)
			.where('habit_id', '=', habit.id)
			.groupBy('type');
	}

	getHabitEventCountsForDay(
		targetDateMillis: number = Date.now()
	): Promise<Array<HabitEventCounts>> {
		const targetDate = `date(${
			targetDateMillis / 1000
		}, 'unixepoch', 'start of day')`;

		return this.knex
			.select(
				'habit_id',
				'type',
				this.knex.raw('count() as `num_events`')
			)
			.table('habit_events')
			.where(
				this.knex.raw('date(timestamp/1000, \'unixepoch\')'),
				'=',
				this.knex.raw(targetDate)
			)
			.groupBy('habit_id', 'type');
	}

	// TODO: use ORM :)?
	insertHabit(createHabitRequest: CreateHabitRequest): Promise<boolean> {
		const reminderAt = calculateNextReminderAt(createHabitRequest);
		return this.knex('habits').insert({
			...createHabitRequest,
			reminder_at: reminderAt
		});
	}

	deleteHabit(id: number) {
		return this.knex('habits').where('id', id).delete();
	}

	async getNextPendingNotification(): Promise<Habit | undefined> {
		const rows = await this.knex('habits')
			.where('reminder_at', '<=', Date.now())
			.limit(1);
		return rows.length > 0 ? rows[0] : undefined;
	}

	async updateReminderAt(id: number, reminder_at: number): Promise<number> {
		return this.knex('habits')
			.where('id', id)
			.update('reminder_at', reminder_at);
	}

	createHabitEvent(type: string, habitId: number): Promise<Array<object>> {
		return this.knex('habit_events').insert({
			habit_id: habitId,
			type: type,
			timestamp: Date.now()
		});
	}
}

let db: DatabaseService;

export function startDatabaseService() {
	db = new DatabaseService();
}

export function getDatabaseConnection() {
	return db;
}

export async function migrate() {
	const dbDir = path.dirname(dbFile);
	if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);
	await getDatabaseConnection().knex.migrate.latest();
}

import {
	Connection,
	ConnectionOptions,
	createConnection,
	LessThanOrEqual
} from 'typeorm';
import { Habit } from '../../entity/habit';
import { HabitEvent } from '../../entity/habitEvent';
import { app } from 'electron';
import { calculateNextReminderAt } from '../../helpers';
import { CreateHabitRequest } from '../../types';
import path from 'path';

const dbFile = app.isPackaged
	? path.join(app.getPath('userData'), 'pixelpal.db')
	: '.db/pixelpal.db';

export class DatabaseService {
	db!: Connection;
	options: ConnectionOptions;

	constructor() {
		this.options = {
			type: 'sqlite',
			database: dbFile,
			entities: [Habit, HabitEvent],
			logging: false,
			synchronize: true
		};
	}

	async initConnection() {
		this.db = await createConnection(this.options);
	}

	// getAllHabits(day?: string): Promise<Array<Habit>> {
	// 	// return this.db
	// 	// 	.getRepository(Habit)
	// 	// 	.createQueryBuilder('habit')
	// 	// 	.where('days LIKE :day', { day: `%${day}%` })
	// 	// 	.getMany();
	// }

	getTodayEventCountsForHabit(habitId: number): Promise<any> {
		const targetDate = `date(${
			Date.now() / 1000
		}, 'unixepoch', 'start of day')`;

		// raw query because typeorm did not like my date magic
		return this.db.manager.query(`
      SELECT 
        habit_id, type, count() as num_events 
      FROM 
        habit_events
      WHERE
        date(timestamp/1000, 'unixepoch') = ${targetDate} AND habit_id = ${habitId}
      GROUP BY type
    `);
	}

	insertHabit(createHabitRequest: CreateHabitRequest): Promise<Habit> {
		const reminderAt = calculateNextReminderAt(createHabitRequest);
		const habitRepo = this.db.getRepository(Habit);

		const habit = habitRepo.create(createHabitRequest);
		habit.reminder_at = reminderAt;

		return habitRepo.save(habit);
	}

	insertHabitEvent(type: string, habitId: number): Promise<HabitEvent> {
		const habitEventRepo = this.db.getRepository(HabitEvent);
		const habitEvent = habitEventRepo.create({
			type,
			habit_id: habitId,
			timestamp: Date.now()
		});

		return habitEventRepo.save(habitEvent);
	}

	async deleteHabit(habitId: number): Promise<Habit> {
		const habit = await Habit.findOne(habitId);
		// todo: catch err

		return habit!.remove();
	}

	async updateReminderAt(id: number, reminder_at: number): Promise<Habit> {
		const habit = await Habit.findOne(id);
		habit!.reminder_at = reminder_at;
		return habit!.save();
	}

	async getNextPendingNotification(): Promise<Habit | undefined> {
		const habitRepo = this.db.getRepository(Habit);
		return habitRepo.findOne({ reminder_at: LessThanOrEqual(Date.now()) });
	}
}

let db: DatabaseService;

export function startDatabaseService() {
	db = new DatabaseService();
	db.initConnection();
}

export function getDatabaseConnection() {
	return db;
}

export function migrate() {
	// noop for now
}

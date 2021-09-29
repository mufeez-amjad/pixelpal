import { Knex } from 'knex';
import { calculateNextReminderAt } from '../../helpers';
import { CreateHabitRequest, Habit } from '../../types';

class DatabaseService {
	knex: Knex;

	constructor(knex: Knex) {
		this.knex = knex;
	}

	getAllHabits(day?: string): Promise<Array<Habit>> {
		let query = this.knex.select().table('habits');
		if (day) {
			query = query.where('days', 'like', `%${day}%`);
		}
		return query;
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
}

export default DatabaseService;

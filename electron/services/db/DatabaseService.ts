const snake = require('snakecase-keys');

class DatabaseService {
	knex: any;

	constructor(knex: any) {
		this.knex = knex;
	}

	getAllHabits(): Promise<Array<object>> {
		return this.knex.select().table('habits');
	}

	// TODO: use ORM :)?
	insertHabit(habit: {
		name: string;
		frequency: number;
		startTime: number;
		endTime: number;
		days: string;
	}): Promise<boolean> {
		return this.knex('habits').insert(snake(habit));
	}
}

export default DatabaseService;

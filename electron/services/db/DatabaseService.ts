const snake = require('snakecase-keys');

class DatabaseService {
	knex: any;

	constructor(knex: any) {
		this.knex = knex;
	}

	getAllHabits(day?: string): Promise<Array<object>> {
		let query = this.knex.select().table('habits');
		if (day) {
			query = query.where('days', 'like', `%${day}%`);
		}
		return query;
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

	deleteHabit(id: number) {
		return this.knex('habits').delete(id);
	}

	getSurvey(surveyId: string): Promise<Array<object>> {
		// if id doesn't exist, create it
		return this.knex.select().table('surveys').where('survey_id', surveyId);
	}

	insertSurvey(surveyId: string): Promise<Array<object>> {
		return this.knex('surveys').insert({
			survey_id: surveyId,
			completed: false
		});
	}

	completeSurvey(surveyId: string): Promise<Array<object>> {
		return this.knex('surveys')
			.where('survey_id', surveyId)
			.update({ completed: true });
	}
}

export default DatabaseService;

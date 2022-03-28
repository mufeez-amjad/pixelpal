import { Knex } from 'knex';

export class ApiHandler {
	constructor(protected db: Knex) {}
}

exports.up = function (knex) {
	return knex.schema.createTable('habits', table => {
		table.increments('id');
		table.string('name', 255).unique().notNullable();
		table.int('frequency').notNullable();
		table.string('days', 7).notNullable();
		table.int('start_time').notNullable();
		table.int('end_time').notNullable();
		table.string('last_completed_at', 255);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('habits');
};

exports.up = function (knex) {
	return knex.schema.createTable('completed_habits', table => {
		table.increments('id');
		table.int('habit_id').references('id').inTable('habits');
		table.string('completed_at', 255);
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('completed_habits');
};

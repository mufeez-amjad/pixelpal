exports.up = function (knex) {
	return knex.schema.createTable('habit_events', table => {
		table
			.int('habit_id')
			.notNullable()
			.references('id')
			.inTable('habits')
			.onDelete('cascade');
		table.string('timestamp', 255);
		table.enu('type', ['completed', 'triggered', 'missed']);
		table.primary(['habit_id', 'timestamp']);
		table.index(['timestamp'], 'ix_timestamp');
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('habit_events');
};

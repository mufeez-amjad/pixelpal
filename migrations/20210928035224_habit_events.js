exports.up = function (knex) {
	return knex.schema.createTable('habit_events', table => {
		table
			.int('habit_id')
			.notNullable()
			.references('id')
			.inTable('habits')
			.onDelete('cascade');
		table.string('completed_at', 255);
		table.enu('type', ['completed', 'triggered', 'missed']);
		table.primary(['habit_id', 'completed_at']);
		table.index(['completed_at'], 'ix_completed_at');
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('habit_events');
};

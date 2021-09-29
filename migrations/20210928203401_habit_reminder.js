exports.up = function (knex) {
	return knex.schema.table('habits', table => {
		table.int('reminder_at').notNullable();
	});
};

exports.down = function (knex) {
	return knex.schema.table('habits', table => {
		table.dropColumn('reminder_at');
	});
};

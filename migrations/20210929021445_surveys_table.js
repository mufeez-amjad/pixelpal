exports.up = function (knex) {
	return knex.schema.createTable('surveys', table => {
		table.string('survey_id', 255).primary().notNullable();
		table.boolean('completed').notNullable();
	});
};

exports.down = function () {};

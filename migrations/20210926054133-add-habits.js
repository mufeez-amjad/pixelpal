'use strict';

exports.up = function (db) {
	return db.createTable('habits', {
		id: { type: 'int', primaryKey: true },
		name: 'string',
		frequency: 'int',
		days: 'string',
		start_time: 'int',
		end_time: 'int',
		last_completed_at: 'string'
	});
};

exports.down = function (db) {
	return db.dropTable('habits');
};

exports._meta = {
	version: 1
};

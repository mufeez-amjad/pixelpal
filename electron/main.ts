import { ipcMain, app } from 'electron';

import AppTray from './tray';
import AppWindow from './window';
import DatabaseService from './services/db/DatabaseService';

const fs = require('fs');

const knex = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: '.db/pixelpal.db'
	},
	migrations: {
		tableName: 'migrations'
	}
});

require('@electron/remote/main').initialize();

/* eslint-disable no-unused-vars */
let window: AppWindow;
let tray: AppTray;
let db: DatabaseService;
/* eslint-disable no-unused-vars */

async function init() {
	tray = new AppTray();
	window = new AppWindow({ tray });
	db = new DatabaseService(knex);
	if (!fs.existsSync('.db')) fs.mkdirSync('.db');
	await knex.migrate.latest();
}

ipcMain.handle('getHabits', async event => {
	const habits = await db.getAllHabits();
	return habits;
});

ipcMain.handle('insertHabit', async (event, habit) => {
	await db.insertHabit(habit);
	console.log('inserted habit ' + habit);
});

app.whenReady().then(() => {
	init();
	if (app.dock) {
		app.dock.hide();
	}
});

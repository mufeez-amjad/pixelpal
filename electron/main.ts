import { app, screen, ipcMain } from 'electron';
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
let notificationWindow: AppWindow;
/* eslint-disable no-unused-vars */

async function init() {
	tray = new AppTray();
	window = new AppWindow({ tray, autoHide: true });

	const screenBounds = screen.getPrimaryDisplay().size;

	let width = 300;
	notificationWindow = new AppWindow({
		position: { x: screenBounds.width + width, y: 0 },
		transparent: true,
		dimensions: { width, height: 150 },
		path: 'notification'
	});

	notificationWindow.show();
	db = new DatabaseService(knex);
	if (!fs.existsSync('.db')) fs.mkdirSync('.db');
	await knex.migrate.latest();
}

ipcMain.handle('getHabits', async event => {
	const habits = await db.getAllHabits();
	return habits;
});

ipcMain.handle('getHabitsForDay', async (event, day) => {
	const habits = await db.getAllHabits(day);
	console.log(habits);
	return habits;
});

ipcMain.handle('insertHabit', async (event, habit) => {
	await db.insertHabit(habit);
	console.log('inserted habit ' + habit);
});

ipcMain.handle('deleteHabit', async (event, habitId) => {
	await db.deleteHabit(habitId);
});

ipcMain.handle('close-window', (event, arg) => {
	if (arg == 'notification') {
		notificationWindow.close();
	}
});

app.whenReady().then(() => {
	init();
	if (app.dock) {
		app.dock.hide();
	}
});

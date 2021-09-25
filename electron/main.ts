import { ipcMain, app } from 'electron';

import AppTray from './tray';
import AppWindow from './window';
import DatabaseService from './services/db/DatabaseService';

require('@electron/remote/main').initialize();

/* eslint-disable no-unused-vars */
let window: AppWindow;
let tray: AppTray;
let db: DatabaseService;
/* eslint-disable no-unused-vars */

function init() {
	tray = new AppTray();
	window = new AppWindow({ tray });
	db = new DatabaseService('.db/pixelpal.db');
}

ipcMain.handle('getHabits', async event => {
	const habits = await db.findAllHabits();
	console.log(habits);
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

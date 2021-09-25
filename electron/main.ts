import { ipcMain, app } from 'electron';

import AppTray from './tray';
import AppWindow from './window';
import DatabaseService from './services/DatabaseService';

require('@electron/remote/main').initialize();

/* eslint-disable no-unused-vars */
let window: AppWindow;
let tray: AppTray;
let db: DatabaseService;
/* eslint-disable no-unused-vars */

function init() {
	tray = new AppTray();
	window = new AppWindow({ tray });
	db = new DatabaseService();
}

ipcMain.handle('t', (event, a1) => {
	db.query('hello');
	return 'test';
});

app.whenReady().then(() => {
	init();
	if (app.dock) {
		app.dock.hide();
	}
});

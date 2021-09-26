import { app, screen, ipcMain } from 'electron';

import AppTray from './tray';
import AppWindow from './window';

require('@electron/remote/main').initialize();

/* eslint-disable no-unused-vars */
let window: AppWindow;
let tray: AppTray;

let notificationWindow: AppWindow;
/* eslint-disable no-unused-vars */

function init() {
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

	ipcMain.on('close-window', (event, arg) => {
		if (arg == 'notification') {
			notificationWindow.close();
		}
	});

	notificationWindow.show();
}

app.whenReady().then(() => {
	init();
	if (app.dock) {
		app.dock.hide();
	}
});

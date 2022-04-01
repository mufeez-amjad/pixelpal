import { app, autoUpdater } from 'electron';
import { createAppWindow } from './window/AppWindow';
import { createNotificationWindow } from './window/NotificationWindow';
import { migrate, startDatabaseService } from './services/db/DatabaseService';
// import { startSchedulerService } from './services/scheduler/SchedulerService';
import { initHandlers } from './ipcHandlers';
import 'reflect-metadata';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('@electron/remote/main').initialize();

async function init() {
	// order matters unfortunately, there may be a cleaner approach
	createAppWindow();
	createNotificationWindow();

	startDatabaseService();
	// startSchedulerService();

	initHandlers();

	await migrate();
}

const server = 'https://electron-release-server-hazel.vercel.app/';
autoUpdater.setFeedURL({ url: `${server}/update/${process.platform}/${app.getVersion()}`});

if (process.env.NODE_ENV === 'production') {
	setInterval(() => {
		autoUpdater.checkForUpdates();
	}, 60 * 1000); // every hour
}

app.whenReady().then(async () => {
	try {
		await init();
	} catch (err) {
		console.error(err);
	}

	if (app.dock) {
		app.dock.hide();
	}
});

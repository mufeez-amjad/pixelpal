import { app } from 'electron';
import schedule from 'node-schedule';
import { createAppWindow } from './window/AppWindow';
import { createNotificationWindow } from './window/NotificationWindow';
import { migrate, startDatabaseService } from './services/db/DatabaseService';
import { startSchedulerService } from './services/scheduler/SchedulerService';
import { initHandlers } from './ipcHandlers';
import { verify } from './scripts/OwnershipVerifier';
import 'reflect-metadata';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('@electron/remote/main').initialize();

async function init() {
	// order matters unfortunately, there may be a cleaner approach
	createAppWindow();
	createNotificationWindow();

	startDatabaseService();
	startSchedulerService();

	initHandlers();

	await migrate();

	// verify NFT ownership at the start
	const valid = verify();
	if (!valid) {
		// TODO redirect to authorization page
		console.log('invalid user on app startup');
	}

	// schedule jobs
	await scheduleJobs();
}

async function scheduleJobs() {
	// Verify ownership every 4 hours
	schedule.scheduleJob('0 0/4 * * *', () => {
		verify();
	});
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

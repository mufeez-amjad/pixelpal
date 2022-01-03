import { app } from 'electron';
import { createAppWindow } from './window/AppWindow';
import { createNotificationWindow } from './window/NotificationWindow';
import { migrate, startDatabaseService } from './services/db/DatabaseService';
import { startSchedulerService } from './services/scheduler/SchedulerService';
import { initHandlers } from './ipcHandlers';

require('@electron/remote/main').initialize();

async function init() {
	// order matters unfortunately, there may be a cleaner approach
	createAppWindow();
	createNotificationWindow();

	startDatabaseService();
	startSchedulerService();

	initHandlers();

	await migrate();
}

app.whenReady().then(async () => {
	await init();

	if (app.dock) {
		app.dock.hide();
	}
});

import { clearInterval, setInterval } from 'timers';
import { calculateNextReminderAt } from '../../helpers';
import { AppWindow } from '../../window/AppWindow';
import { getNotificationWindow } from '../../window/NotificationWindow';
import { getDatabaseConnection, DatabaseService } from '../db/DatabaseService';

const REMINDER_INTERVAL_MS = 5000;

export class SchedulerService {
	db: DatabaseService;
	notifWindow: AppWindow;
	// eslint-disable-next-line no-undef
	timer?: NodeJS.Timer;

	constructor(notifWindow: AppWindow) {
		this.db = getDatabaseConnection();
		this.notifWindow = notifWindow;
	}

	start() {
		this.timer = setInterval(
			this.showPendingReminder,
			REMINDER_INTERVAL_MS,
			this.db,
			this.notifWindow
		);
	}

	stop() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = undefined;
		}
	}

	async showPendingReminder(db: DatabaseService, notifWindow: AppWindow) {
		let habit = await db.getNextPendingNotification();
		if (!habit) return;

		const original_reminder_at = habit.reminder_at;
		habit.reminder_at = calculateNextReminderAt(habit, habit.reminder_at);

		const rowsUpdated = await db.updateReminderAt(
			habit.id,
			habit.reminder_at
		);
		if (rowsUpdated == 0) return;

		console.log(
			`Habit ${habit.name} reminder, ${new Date(
				original_reminder_at
			).toISOString()} -> ${new Date(habit.reminder_at).toISOString()}!`
		);

		notifWindow.webContents.send('notification', habit);
		await db.createHabitEvent('triggered', habit.id);
		notifWindow.showInactive();
	}
}

let schedulerSrv: SchedulerService;

export function startSchedulerService() {
	schedulerSrv = new SchedulerService(getNotificationWindow());
	schedulerSrv.start();
}

export function getSchedulerService() {
	return schedulerSrv;
}

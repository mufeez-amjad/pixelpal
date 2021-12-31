import { ipcMain } from 'electron';
import {
	DatabaseService,
	getDatabaseConnection
} from './services/db/DatabaseService';
import { getMixpanelInstance } from './services/mixpanel/MixpanelService';
import { AppWindow, getAppWindow } from './window/AppWindow';
import { getNotificationWindow } from './window/NotificationWindow';
import { getCountsForHabit } from './helpers';
import { GoogleCalendar } from './services/calendar/google';

let db: DatabaseService;
let appWindow: AppWindow;
let notificationWindow: AppWindow;
let mixpanel: any;
const username = require('os').userInfo().username;

export function initHandlers() {
	db = getDatabaseConnection();
	appWindow = getAppWindow();
	notificationWindow = getNotificationWindow();
	mixpanel = getMixpanelInstance();

	// eslint-disable-next-line no-unused-vars
	ipcMain.handle('getEvents', async event => {
		const gcal = new GoogleCalendar();
		return await gcal.getEventsForDay(new Date());
	});

	ipcMain.handle('getHabits', async () => {
		return await db.getAllHabits();
	});

	ipcMain.handle('getHabitsForDay', async (_event, day) => {
		return await db.getAllHabits(day);
	});

	ipcMain.handle('getHabitEventCountsForDay', async (_event, day) => {
		const habits = await db.getAllHabits(day);

		const counts = habits.map(async habit => {
			const minutes = (habit.end_time - habit.start_time) * 60;
			const total = minutes / habit.frequency;

			const dailyEventCounts = await getCountsForHabit(habit);

			return {
				habit_id: habit.id,
				total: total,
				completed: dailyEventCounts['completed'] || 0,
				missed: dailyEventCounts['missed'] || 0,
				triggered: dailyEventCounts['triggered'] || 0
			};
		});

		const results = await Promise.all(counts);
		return results;
	});

	ipcMain.handle('insertHabit', async (_event, habit) => {
		mixpanel.track('Added habit', {
			source: 'Tray window',
			habit,
			distinct_id: username
		});
		await db.insertHabit(habit);
	});

	ipcMain.handle('deleteHabit', async (_event, habitId) => {
		await db.deleteHabit(habitId);
	});

	ipcMain.handle('notification', async (_event, action) => {
		mixpanel.track('Reminder action', {
			source: 'Notification window',
			action,
			distinct_id: username
		});
		notificationWindow.hide();
		await db.createHabitEvent(action.status, action.habit_id);
		await appWindow.webContents.send('overview:update-habit-counts');
	});
}

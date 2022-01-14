import os from 'os';

import Store from 'electron-store';
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
import { ACCOUNTS_INFO_KEY, BaseCalendar, IAccounts } from './services/calendar/base';
import { Provider } from './services/calendar/oauth';
import { OutlookCalendar } from './services/calendar/outlook';

let db: DatabaseService;
let appWindow: AppWindow;
let notificationWindow: AppWindow;
let mixpanel: any;
const username = os.userInfo().username;
const store = new Store();

export function initHandlers() {
	db = getDatabaseConnection();
	appWindow = getAppWindow();
	notificationWindow = getNotificationWindow();
	mixpanel = getMixpanelInstance();

	// eslint-disable-next-line no-unused-vars
	ipcMain.handle('triggerOAuth', async (event, provider: Provider) => {
		let platform: BaseCalendar;

		switch (provider) {
		case Provider.google:
			platform = new GoogleCalendar();
			break;
		case Provider.microsoft:
			platform = new OutlookCalendar();
			break;
		default:
			return null;
		}

		await platform.auth(true);

		return (store.get(ACCOUNTS_INFO_KEY) as IAccounts) || {};
	});

	ipcMain.handle('getConnectedAccounts', async event => {
		const accounts = (store.get(ACCOUNTS_INFO_KEY) as IAccounts) || {};
		return accounts;
	});

	ipcMain.handle('getEventsForWeek', async (event, week) => {
		const { start, end } = week;

		// const ocal = new OutlookCalendar();
		// await ocal.auth();

		// return await ocal.getEventsBetweenDates(start, end);
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

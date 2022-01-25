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
import {
	ACCOUNTS_INFO_KEY,
	BaseCalendar,
	IAccounts,
	IEvent
} from './services/calendar/base';
import { Provider } from './services/calendar/oauth';
import { OutlookCalendar } from './services/calendar/outlook';
import { Mixpanel } from 'mixpanel';
import { Habit } from './entity/habit';

let db: DatabaseService;
let appWindow: AppWindow;
let notificationWindow: AppWindow;
let mixpanel: Mixpanel;

const username = os.userInfo().username;
const store = new Store();

export function initHandlers(): void {
	db = getDatabaseConnection();
	appWindow = getAppWindow();
	notificationWindow = getNotificationWindow();
	mixpanel = getMixpanelInstance();

	// eslint-disable-next-line no-unused-vars
	ipcMain.handle('triggerOAuth', async (event, provider: Provider) => {
		let platform;

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

		await platform.auth();

		return (store.get(ACCOUNTS_INFO_KEY) as IAccounts) || {};
	});

	ipcMain.handle('getConnectedAccounts', async () => {
		const accounts = (store.get(ACCOUNTS_INFO_KEY) as IAccounts) || {};
		return accounts;
	});

	ipcMain.handle('getEventsForWeek', async (_, week) => {
		const { start, end } = week;
		let events: IEvent[] = [];

		// const platformEvents: IEvent[];
		let platform: BaseCalendar = new GoogleCalendar();
		events = events.concat(
			await platform.getEventsBetweenDates(start, end)
		);

		platform = new OutlookCalendar();
		events = events.concat(
			await platform.getEventsBetweenDates(start, end)
		);

		return events;
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

	ipcMain.handle('insertHabit', async (_event, habit: Habit) => {
		mixpanel.track('Added habit', {
			source: 'Tray window',
			habit,
			distinct_id: username
		});
		await db.insertHabit(habit);
	});

	ipcMain.handle('deleteHabit', async (_event, habitId: number) => {
		await db.deleteHabit(habitId);
	});

	ipcMain.handle('notification', async (_event, action) => {
		mixpanel.track('Reminder action', {
			source: 'Notification window',
			action,
			distinct_id: username
		});
		notificationWindow.hide();
		await db.insertHabitEvent(action.status, action.habit_id);
		await appWindow.webContents.send('overview:update-habit-counts');
	});
}

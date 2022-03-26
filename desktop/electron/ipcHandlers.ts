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
// import { getCountsForHabit } from './helpers';
import { GoogleCalendar } from './services/calendar/google';
import {
	ACCOUNTS_INFO_KEY,
	BaseCalendar,
	IAccount,
	IAccounts,
	ICalendar,
	IEvent
} from './services/calendar/base';
import { Provider } from './services/calendar/oauth';
import { OutlookCalendar } from './services/calendar/outlook';
import { Mixpanel } from 'mixpanel';
import { Habit } from './entity/habit';
import { isAfter, isBefore } from 'date-fns';

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

	ipcMain.handle('getCalendars', async () => {
		const calendars: Record<string, ICalendar[]> = {};

		let platform: BaseCalendar = new GoogleCalendar();
		Object.assign(calendars, await platform.getCalendars());

		platform = new OutlookCalendar();
		Object.assign(calendars, await platform.getCalendars());

		return calendars;
	});

	ipcMain.handle('getConnectedAccounts', async () => {
		const accounts = (store.get(ACCOUNTS_INFO_KEY) as IAccounts) || {};
		return accounts;
	});

	ipcMain.handle('createEvent', async (_, event: IEvent) => {
		let platform: BaseCalendar;
		const accounts = (store.get(ACCOUNTS_INFO_KEY) as IAccounts) || {};

		switch (event.calendar.platform) {
		case 'google':
			platform = new GoogleCalendar();
			break;
		case 'microsoft':
			platform = new OutlookCalendar();
			break;
		default:
			throw Error('Unsupported platform.');
		}
		
		const platformAccounts = accounts[event.calendar.platform as keyof IAccounts];

		if (platformAccounts !== undefined) {
			const account = platformAccounts[event.calendar.account];
			platform.auth(account);
			return await platform.createEvent(event);
		}
		throw Error('Error creating event, try again later.');
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

		events.sort((eventA, eventB) => {
			if (isBefore(eventA.start, eventB.start)) {
				return -1;
			} else if (isAfter(eventA.start, eventB.start)) {
				return 1;
			}

			return 0;
		});

		return events;
	});

	ipcMain.handle('getHabits', async () => {
		return; // await db.getAllHabits();
	});

	ipcMain.handle('getHabitsForDay', async (_event, day) => {
		return; // await db.getAllHabits(day);
	});

	ipcMain.handle('getHabitEventCountsForDay', async (_event, day) => {
		// const habits = await db.getAllHabits(day);

		// const counts = habits.map(async habit => {
		// 	const minutes = (habit.end_time - habit.start_time) * 60;
		// 	const total = minutes / habit.frequency;

		// 	const dailyEventCounts = await getCountsForHabit(habit);

		// 	return {
		// 		habit_id: habit.id,
		// 		total: total,
		// 		completed: dailyEventCounts['completed'] || 0,
		// 		missed: dailyEventCounts['missed'] || 0,
		// 		triggered: dailyEventCounts['triggered'] || 0
		// 	};
		// });

		// const results = await Promise.all(counts);
		// return results;
		return;
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

	getAppWindow().on('hide', () => {
		getAppWindow().webContents.send('hide-tray-window');
	});
}

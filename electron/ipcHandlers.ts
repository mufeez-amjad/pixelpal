import { ipcMain } from 'electron';
import {
	DatabaseService,
	getDatabaseConnection
} from './services/db/DatabaseService';
import { getMixpanelInstance } from './services/mixpanel/MixpanelService';
import { AppWindow, getAppWindow } from './window/AppWindow';
import { getNotificationWindow } from './window/NotificationWindow';
import { getCountsForHabit } from './helpers';

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

	ipcMain.handle('getHabits', async () => {
		const habits = await db.getAllHabits();
		return habits;
	});

	ipcMain.handle('getHabitsForDay', async (_event, day) => {
		const habits = await db.getAllHabits(day);
		return habits;
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

	ipcMain.handle('getSurvey', async (_event, surveyId) => {
		const survey = db.getSurvey(surveyId);
		return survey;
	});

	ipcMain.handle('insertSurvey', async (_event, surveyId) => {
		await db.insertSurvey(surveyId);
		console.log('inserted survey');
	});

	ipcMain.handle('completeSurvey', async (_event, surveyId) => {
		await db.completeSurvey(surveyId);
		console.log('completed survey');
	});
}

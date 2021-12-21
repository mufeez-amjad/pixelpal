import { ipcMain } from 'electron';
import {
	DatabaseService,
	getDatabaseConnection
} from './services/db/DatabaseService';
import { getMixpanelInstance } from './services/mixpanel/MixpanelService';
import { AppWindow, getAppWindow } from './window/AppWindow';
import { getNotificationWindow } from './window/NotificationWindow';

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
		const eventCounts = await db.getHabitEventCountsForDay();

		const counts = habits.map(h => {
			const minutes = (h.end_time - h.start_time) * 60;
			const total = minutes / h.frequency;

			// ugly mvp code
			const completed = eventCounts.find(
				e => e.type == 'completed' && e.habit_id == h.id
			);
			const missed = eventCounts.find(
				e => e.type == 'missed' && e.habit_id == h.id
			);
			const triggered = eventCounts.find(
				e => e.type == 'triggered' && e.habit_id == h.id
			);

			return {
				habit_id: h.id,
				total: total,
				completed: completed ? completed.num_events : 0,
				missed: missed ? missed.num_events : 0,
				triggered: triggered ? triggered.num_events : 0
			};
		});

		return counts;
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

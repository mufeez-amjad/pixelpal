import { app, ipcMain } from 'electron';
import Mixpanel from 'mixpanel';
import path from 'path';

import AppTray from './tray';
import AppWindow from './window';
import DatabaseService from './services/db/DatabaseService';
import { SchedulerService } from './services/scheduler/SchedulerService';

import { getCurrentDisplay } from './util';

const dbFile = app.isPackaged
	? path.join(app.getPath('userData'), 'pixelpal.db')
	: '.db/pixelpal.db';

const username = require('os').userInfo().username;

const knex = require('knex')({
	client: 'sqlite3',
	connection: {
		filename: dbFile
	},
	migrations: {
		tableName: 'migrations',
		directory: path.join(__dirname, '../migrations/')
	}
});

/* eslint-disable no-unused-vars */
let window: AppWindow;
let tray: AppTray;
let db: DatabaseService;
let schedulerSrv: SchedulerService;
let notificationWindow: AppWindow;
/* eslint-disable no-unused-vars */

const mixpanel = Mixpanel.init('e4914acb2794ddaa0478bfd6ec81064a');
const fs = require('fs');

require('@electron/remote/main').initialize();

async function init() {
	tray = new AppTray();
	window = new AppWindow({ tray, autoHide: true });

	const screenBounds = getCurrentDisplay().bounds;

	let width = 300;
	notificationWindow = new AppWindow({
		position: {
			x: screenBounds.width + screenBounds.x - width,
			y: screenBounds.y
		},
		transparent: true,
		dimensions: { width, height: 150 },
		path: 'notification'
	});

	db = new DatabaseService(knex);

	const dbDir = path.dirname(dbFile);
	if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);
	await knex.migrate.latest();

	schedulerSrv = new SchedulerService(db, notificationWindow);
	schedulerSrv.start();

	tray.on('click', () => {
		mixpanel.track('Open window', {
			source: 'Tray click',
			distinct_id: username
		});
	});
}

ipcMain.handle('getHabits', async event => {
	const habits = await db.getAllHabits();
	return habits;
});

ipcMain.handle('getHabitsForDay', async (event, day) => {
	const habits = await db.getAllHabits(day);
	return habits;
});

ipcMain.handle('getHabitEventCountsForDay', async (event, day) => {
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

ipcMain.handle('insertHabit', async (event, habit) => {
	mixpanel.track('Added habit', {
		source: 'Tray window',
		habit,
		distinct_id: username
	});
	await db.insertHabit(habit);
});

ipcMain.handle('deleteHabit', async (event, habitId) => {
	await db.deleteHabit(habitId);
});

ipcMain.handle('notification', async (event, action) => {
	mixpanel.track('Reminder action', {
		source: 'Notification window',
		action,
		distinct_id: username
	});
	notificationWindow.hide();
	await db.createHabitEvent(action.status, action.habit_id);
	await window.webContents.send('overview:update-habit-counts');
});

ipcMain.handle('getSurvey', async (event, surveyId) => {
	const survey = db.getSurvey(surveyId);
	return survey;
});

ipcMain.handle('insertSurvey', async (event, surveyId) => {
	await db.insertSurvey(surveyId);
	console.log('inserted survey');
});

ipcMain.handle('completeSurvey', async (event, surveyId) => {
	await db.completeSurvey(surveyId);
	console.log('completed survey');
});

app.whenReady().then(() => {
	init();

	if (app.dock) {
		app.dock.hide();
	}
});

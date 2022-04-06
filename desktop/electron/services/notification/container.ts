import { BrowserWindow, BrowserWindowConstructorOptions, ipcMain, screen } from 'electron';
import { Notification } from './notification';

import * as path from 'path';

export default class NotificationContainer {
	notifications: Notification[] = [];
	window: BrowserWindow | null;

	static WIDTH = 380;
	static CUSTOM_STYLES: string;

	ready = false;

	constructor() {
		const display = screen.getPrimaryDisplay();

		const options: BrowserWindowConstructorOptions = {
			height: display.workArea.y + display.workAreaSize.height,
			width: NotificationContainer.WIDTH,
			x: (
				display.workArea.x + display.workAreaSize.width
				- NotificationContainer.WIDTH
			),
			y: 0,
			alwaysOnTop: true,
			skipTaskbar: true,
			resizable: false,
			minimizable: false,
			fullscreenable: false,
			focusable: false,
			show: false,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false,
			},
			frame: false,
			transparent: true,
		};

		this.window = new BrowserWindow(options);
		const pathToHTML = path.join('file://', __dirname, '/container.html');
		this.window.loadURL(pathToHTML);
		this.window.setIgnoreMouseEvents(true, { forward: true });
		this.window.showInactive();

		this.window.webContents.openDevTools();

		this.window.webContents.on('did-finish-load', () => {
			this.ready = true;
			if (NotificationContainer.CUSTOM_STYLES && this.window) {
				this.window.webContents.send(
					'custom-styles',
					NotificationContainer.CUSTOM_STYLES
				);
			}
			this.notifications.forEach(this.displayNotification);
		});


		ipcMain.on('set-ignore-mouse-events', (event, boolean, opts) => {
			console.log('ignore:', boolean);
			this.window?.setIgnoreMouseEvents(boolean, opts);
		});

		ipcMain.on('notification-clicked', (e: any, id: string) => {
			this.handleClick('notification-clicked', id);
		});

		ipcMain.on('notification-btn-clicked', (e: any, id: string) => {
			this.handleClick('notification-btn-clicked', id);
		});

		this.window.on('closed', () => {
			this.window = null;
		});
	}

	private handleClick(channel: string, id: string) {
		const notification = this.notifications.find(n => n.id == id);

		if (notification) {
			switch (channel) {
			case 'notification-clicked':
				notification.emit('btn-click');
				break;
			default:
				notification.emit('click');
			}
			
			notification.close();
		}
	}

	addNotification(notification: Notification) {
		if (this.ready) {
			this.displayNotification(notification);
		}

		this.notifications.push(notification);
	}

	removeNotification(n: Notification) {
		this.notifications.splice(this.notifications.indexOf(n), 1);
		this.window && this.window.webContents.send('notification-remove', n.id);
		n.emit('close');
	}

	private displayNotification = (notification: Notification) => {
		if (!this.window) {
			return;
		}

		this.window.webContents.send(
			'notification-add',
			notification.getContent(),
		);
		notification.emit('display');

		if (notification.opts.timeout) {
			setTimeout(() => {
				notification.close();
			}, notification.opts.timeout);
		}
	};

	public dispose() {
		this.window && this.window.close();
	}
}
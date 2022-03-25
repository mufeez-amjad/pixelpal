import os from 'os';
import { app, BrowserWindow, Tray, Menu } from 'electron';
import { Display } from 'electron/main';
import path from 'path';
import AppTray from '../tray';
import { getMixpanelInstance } from '../services/mixpanel/MixpanelService';

import { getCurrentDisplay } from '../util';

const WINDOW_WIDTH = 340;
const WINDOW_HEIGHT = 540;

interface IOptions {
	transparent?: boolean;
	autoHide?: boolean;
	tray?: Tray;
	position?: { x: number; y: number };
	dimensions?: { width: number; height: number };
	path?: string;
}

export class AppWindow extends BrowserWindow {
	tray?: Tray;
	width: number;
	height: number;

	constructor(options: IOptions) {
		const width = options.dimensions?.width || WINDOW_WIDTH;
		const height = options.dimensions?.height || WINDOW_HEIGHT;
		super({
			width,
			height,
			show: false,
			frame: false,
			fullscreenable: false,
			resizable: false,
			useContentSize: true,
			transparent: options.transparent,
			hasShadow: !options.transparent,
			alwaysOnTop: true,
			webPreferences: {
				backgroundThrottling: false,
				nodeIntegration: true,
				contextIsolation: false
			}
		});
		this.width = width;
		this.height = height;

		if (options.tray) {
			this.tray = options.tray;
			this.tray.on('click', () => this.toggleWindow());
		}

		if (options.autoHide) {
			this.setAutoHide();
		}
		this.setMenu(null);
		this.setURL(options.path);
		this.align(options.position);
	}

	setURL = (urlPath?: string): void => {
		let url = app.isPackaged
			? `file://${path.join(__dirname, '../../build/index.html')}`
			: 'http://localhost:3000';

		if (urlPath) {
			url += '#/' + urlPath;
		}

		this.loadURL(url);
	};

	private setAutoHide = (): void => {
		this.hide();
		this.on('blur', () => {
			// TODO: uncomment
			// if (!this.webContents.isDevToolsOpened()) {
			// 	this.hide();
			// }
		});
		this.on('close', event => {
			event.preventDefault();
			this.hide();
		});
	};

	toggleWindow = (): void => {
		if (this.isVisible()) {
			this.hide();
			return;
		}

		this.showWindow();
	};

	showWindow = (): void => {
		this.align();
		this.show();
	};

	align = (position?: any): void => {
		let x, y;
		if (position) {
			x = position.x;
			y = position.y;
		} else {
			try {
				const alignTo = this.calculatePosition();
				x = alignTo.x;
				y = alignTo.y;
			} catch (err) {
				console.log(err);
			}
		}

		this.setBounds({
			width: this.width,
			height: this.height,
			x,
			y
		});
	};

	private calculatePosition = () => {
		if (!this.tray) {
			throw Error('Tray is undefined!');
		}

		const display: Display = getCurrentDisplay();
		const screenBounds = display.bounds;

		const trayBounds = this.tray.getBounds();
		const { x: trayX, width: trayWidth } = trayBounds;

		if (trayX + this.width < screenBounds.x + screenBounds.width) {
			// anchor top left:
			return { x: trayX, y: screenBounds.y };
		} else {
			// anchor top right
			return { x: trayX - this.width + trayWidth, y: 0 };
		}
	};
}

let appWindow: AppWindow;

export function createAppWindow(): void {
	const username = os.userInfo().username;
	const tray = new AppTray();
	tray.on('click', () => {
		getMixpanelInstance().track('Open window', {
			source: 'Tray click',
			distinct_id: username
		});
	});

	// Context Menu
	const contextMenu = Menu.buildFromTemplate([
		{ label: 'Quit', click: () => app.quit() }
	]);

	// Setting context Menu
	tray.on('right-click', () => tray.popUpContextMenu(contextMenu));
	appWindow = new AppWindow({ tray, autoHide: true });
}

export function getAppWindow(): AppWindow {
	return appWindow;
}

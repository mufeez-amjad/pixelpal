import { BrowserWindow, screen, Tray } from 'electron';
import path from 'path';

const isDev = require('electron-is-dev');

const WINDOW_WIDTH = 500;
const WINDOW_HEIGHT = 400;

interface IOptions {
	transparent?: boolean;
	autoHide?: boolean;
	tray: Tray;
}

class AppWindow extends BrowserWindow {
	tray: Tray;

	constructor(options: IOptions) {
		super({
			width: WINDOW_WIDTH,
			height: WINDOW_HEIGHT,
			show: false,
			frame: false,
			fullscreenable: false,
			resizable: false,
			useContentSize: true,
			transparent: false,
			// backgroundColor: options.transparent ? '#00ffffff' : '#ffffff',
			alwaysOnTop: true,
			webPreferences: {
				backgroundThrottling: false,
				nodeIntegration: true,
				enableRemoteModule: true,
				contextIsolation: false
			}
		});
		this.tray = options.tray;
		this.tray.on('click', () => this.toggleWindow());

		if (options.autoHide) {
			this.setAutoHide();
		}
		this.setMenu(null);
		this.setURL();
		this.align();
	}

	setURL = (url?: string) => {
		if (url) this.loadURL(url);
		else
			this.loadURL(
				isDev
					? 'http://localhost:3000'
					: `file://${path.join(__dirname, '../build/index.html')}`
			);
	};

	private setAutoHide = () => {
		this.hide();
		this.on('blur', () => {
			if (!this.webContents.isDevToolsOpened()) {
				this.hide();
			}
		});
		this.on('close', event => {
			event.preventDefault();
			this.hide();
		});
	};

	toggleWindow = () => {
		if (this.isVisible()) {
			this.hide();
			return;
		}

		this.showWindow();
	};

	showWindow = () => {
		this.align();
		this.show();
	};

	private align = (position?: any) => {
		let x, y;
		if (position) {
			x = position.x;
			y = position.y;
		} else {
			const alignTo = this.calculatePosition();
			x = alignTo.x;
			y = alignTo.y;
		}

		this.setBounds({
			width: WINDOW_WIDTH,
			height: WINDOW_HEIGHT,
			x,
			y
		});
	};

	private calculatePosition = () => {
		const screenBounds = screen.getPrimaryDisplay().size;
		const trayBounds = this.tray.getBounds();
		const { x: trayX, width: trayWidth } = trayBounds;

		if (trayX + WINDOW_WIDTH < screenBounds.width) {
			// anchor top left:
			return { x: trayX, y: 0 };
		} else {
			// anchor top right
			return { x: trayX - WINDOW_WIDTH + trayWidth, y: 0 };
		}
	};
}

export default AppWindow;

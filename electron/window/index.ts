import { BrowserWindow, screen, Tray } from 'electron';
import path from 'path';

const isDev = require('electron-is-dev');

const WINDOW_WIDTH = 500;
const WINDOW_HEIGHT = 300;

interface IOptions {
	transparent?: boolean;
	autoHide?: boolean;
	tray?: Tray;
	position?: { x: number; y: number };
	dimensions?: { width: number; height: number };
}

class AppWindow extends BrowserWindow {
	tray?: Tray;
	width: number;
	height: number;

	constructor(options: IOptions) {
		let width = options.dimensions?.width || WINDOW_WIDTH;
		let height = options.dimensions?.height || WINDOW_HEIGHT;
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
				enableRemoteModule: true,
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
		this.setURL();
		this.align(options.position);
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

	align = (position?: any) => {
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
		const screenBounds = screen.getPrimaryDisplay().size;
		if (!this.tray) {
			throw Error('Tray is undefined!');
		}

		const trayBounds = this.tray.getBounds();
		const { x: trayX, width: trayWidth } = trayBounds;

		if (trayX + this.width < screenBounds.width) {
			// anchor top left:
			return { x: trayX, y: 0 };
		} else {
			// anchor top right
			return { x: trayX - this.width + trayWidth, y: 0 };
		}
	};
}

export default AppWindow;

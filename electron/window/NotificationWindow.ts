import { getCurrentDisplay } from '../util';
import { AppWindow } from './AppWindow';

let notificationWindow: AppWindow;

export function createNotificationWindow() {
	let width = 300;
	const screenBounds = getCurrentDisplay().bounds;
	notificationWindow = new AppWindow({
		position: {
			x: screenBounds.width + screenBounds.x - width,
			y: screenBounds.y
		},
		transparent: true,
		dimensions: { width, height: 150 },
		path: 'notification'
	});
}

export function getNotificationWindow() {
	return notificationWindow;
}

import { Notification, INotificationOptions } from './notification';
import NotificationManager from './manager';
import NotificationContainer from './container';

function createNotification(options: INotificationOptions): Notification {
	return NotificationManager.createNotification(options);
}

function setGlobalStyles(css: string) {
	NotificationContainer.CUSTOM_STYLES = css;
}

export {
	createNotification,
	setGlobalStyles
};
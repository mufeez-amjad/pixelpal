import NotificationContainer from './container';
import { Notification, INotificationOptions } from './notification';

export default class NotificationManager {
	static container: NotificationContainer | null;

	private static getContainer(): NotificationContainer {
		if (!NotificationManager.container) {
			NotificationManager.container = new NotificationContainer();
		}
	
		return NotificationManager.container;
	}
	
	public static removeNotification(notification: Notification) {
		if (NotificationManager.container) {
			NotificationManager.container.removeNotification(notification);

			// Once we have no notifications left, destroy the container.
			if (NotificationManager.container.notifications.length == 0) {
				NotificationManager.container.dispose();
				NotificationManager.container = null;
			}
		}
	}

	public static createNotification(
		options: INotificationOptions
	): Notification {
		const container = NotificationManager.getContainer();
		const notification = new Notification(options);
	
		container.addNotification(notification);
	
		return notification;
	}
}
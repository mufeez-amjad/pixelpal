import { EventEmitter } from 'events';
import NotificationManager from './manager';

import { randomUUID } from 'crypto';

export interface INotificationOptions {
	timeout?: number;
	html?: string;
}

export class Notification extends EventEmitter {
	opts: INotificationOptions;
	id: string;

	constructor(options: INotificationOptions) {
		super();
		this.opts = options;
		this.id = `n-${randomUUID()}`;
	}

	public close() {
		NotificationManager.removeNotification(this);
	}

	public getContent(): string {
		if (!this.opts.html) return '';

		return [
			`<div class="notification" id="${this.id}">`,
			// eslint-disable-next-line indent
				this.opts.html,
			'</div>'
		].join('');
	}

	public getTimeout() {
		return this.opts.timeout;
	}
}
import {
	AuthProviderCallback,
	Client
} from '@microsoft/microsoft-graph-client';

import { BaseCalendar, IEvent } from '../calendar';
import { Credentials } from '../oauth';
import Auth from './oauth';

import {
	Event as OutlookIEvent,
	Calendar as OutlookICalendar
} from '@microsoft/microsoft-graph-types';

export class OutlookCalendar extends BaseCalendar {
	oauth: Auth;
	client?: Client;

	constructor() {
		super();

		const opts = {
			clientId: '4141f923-f32b-4737-8946-b8e2fd52c0cf',
			scopes: [
				'https://graph.microsoft.com/Calendars.Read',
				'offline_access'
			]
		};
		this.oauth = new Auth(opts);
	}

	async auth(): Promise<Credentials> {
		const callback = async (done: AuthProviderCallback) => {
			try {
				const creds = await this.oauth.getCreds();
				if (creds.access_token) {
					done(null, creds.access_token);
				}
			} catch (err) {
				done(err, null);
			}
		};

		this.client = Client.init({
			authProvider: callback
		});
		return await this.oauth.getCreds();
	}

	async getEventsBetweenDates(
		start: Date,
		end: Date
	): Promise<IEvent[] | undefined> {
		if (!this.client) {
			return;
		}

		const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
		const creds = await this.oauth.getCreds();

		const calendarsData = await this.client
			.api('/me/calendars')
			.header('Authorization', `Bearer ${creds.access_token}`)
			.get();

		const calendars = calendarsData.value as Array<OutlookICalendar>;
		console.log(calendars);

		const events = await Promise.all(
			calendars.map(async calendar => {
				const res = await this.client!.api('/me/calendarview')
					.header('Authorization', `Bearer ${creds.access_token}`)
					.header('Prefer', `outlook.timezone="${timeZone}"`)
					.query({
						startDateTime: start.toISOString(),
						endDateTime: end.toISOString()
					})
					.orderby('start/dateTime')
					.get();

				const rawEvents = res.value as Array<OutlookIEvent>;

				const events = rawEvents.map(event => {
					const { start, end } = event;

					return {
						name: event.subject!,
						start: new Date(start!.dateTime!),
						end: new Date(end!.dateTime!),
						calendar: {
							name: calendar.name!,
							color:
								calendar.hexColor || calendar.color || '#ffffff'
						}
					};
				});

				return events;
			})
		);

		console.log(events);

		return events.flat();
	}
}

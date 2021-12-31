import { Calendar, Event } from '../calendar';
import Auth from './oauth';
import secretAccountKey from './secretAccountKey.json';
import { calendar_v3, google } from 'googleapis';
const gcal = google.calendar('v3');

import { startOfDay, endOfDay } from 'date-fns';

export class GoogleCalendar extends Calendar {
	oauth: Auth;
	constructor() {
		super();

		const opts = {
			clientId: secretAccountKey.installed.client_id,
			clientSecret: secretAccountKey.installed.client_secret,
			scopes: [
				'https://www.googleapis.com/auth/calendar.readonly',
				'https://www.googleapis.com/auth/calendar.events.readonly'
			]
		};
		this.oauth = new Auth(opts);
	}

	async getEventsForDay(d: Date): Promise<Event[] | undefined> {
		try {
			await this.oauth.auth();
		} catch (error) {
			return [];
		}

		google.options({ auth: this.oauth.client });

		const { data: calendarsData } = await gcal.calendarList.list();

		const events = await Promise.all(
			(calendarsData.items || []).map(async calendar => {
				let options: calendar_v3.Params$Resource$Events$List = {
					timeMin: startOfDay(d).toISOString(),
					timeMax: endOfDay(d).toISOString()
				};

				if (calendar.id) {
					options.calendarId = calendar.id;
				}
				const { data: calendarEventsData } = await gcal.events.list(
					options
				);

				console.log(calendarEventsData);

				const cleanedEvents = (calendarEventsData.items || []).map(
					event => {
						return {
							name: event.summary!,
							start: new Date(event!.start!.dateTime!),
							end: new Date(event!.end!.dateTime!),
							calendar: calendar.id || 'primary'
						};
					}
				);

				return cleanedEvents;
			})
		);

		console.log(events);

		return events.flat();
	}
}

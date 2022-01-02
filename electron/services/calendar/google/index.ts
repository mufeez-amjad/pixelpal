import { Calendar, Event } from '../calendar';
import Auth from './oauth';
import secretAccountKey from './secretAccountKey.json';
import { calendar_v3, google } from 'googleapis';
const gcal = google.calendar('v3');

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

	async auth() {
		await this.oauth.authClient();
		google.options({ auth: this.oauth.client });
	}

	async getEventsBetweenDates(
		start: Date,
		end: Date
	): Promise<Event[] | undefined> {
		const { data: colors } = await gcal.colors.get();

		const { data: calendarsData } = await gcal.calendarList.list();

		const events = await Promise.all(
			(calendarsData.items || []).map(async calendar => {
				let options: calendar_v3.Params$Resource$Events$List = {
					timeMin: start.toISOString(),
					timeMax: end.toISOString()
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
						let color = event.colorId
							? colors.event![event.colorId].background
							: colors.calendar![calendar.colorId!].background;

						return {
							name: event.summary!,
							start: new Date(event!.start!.dateTime!),
							end: new Date(event!.end!.dateTime!),
							calendar: {
								name: calendar.summary || 'primary',
								color: color || '#ffffff'
							}
						};
					}
				);

				return cleanedEvents;
			})
		);

		return events.flat();
	}
}

import {
	ACCOUNTS_INFO_KEY,
	BaseCalendar,
	IAccount,
	IAccounts,
	ICalendar,
	IEvent,
	IUser
} from '../base';

import Auth from './oauth';
import secretAccountKey from './secretAccountKey.json';
import { calendar_v3, google } from 'googleapis';
const gcal = google.calendar('v3');

import Store from 'electron-store';
import { Credentials } from '../oauth';
import { format } from 'date-fns';
const store = new Store();

export class GoogleCalendar extends BaseCalendar {
	oauth: Auth;

	constructor() {
		const { google } = store.get(ACCOUNTS_INFO_KEY, {}) as IAccounts;
		super(google);

		const opts = {
			clientId: secretAccountKey.installed.client_id,
			clientSecret: secretAccountKey.installed.client_secret,
			scopes: [
				'https://www.googleapis.com/auth/calendar.readonly',
				'https://www.googleapis.com/auth/calendar.events',
				// 'https://www.googleapis.com/auth/userinfo.profile',
				'https://www.googleapis.com/auth/userinfo.email'
			]
		};
		this.oauth = new Auth(opts);
	}

	async getLoggedInAccountInfo(): Promise<IUser> {
		const { data } = await google.oauth2('v2').userinfo.get();
		return {
			email: data.email!
		};
	}

	async auth(account?: IAccount): Promise<Credentials> {
		let creds: Credentials;
		try {
			creds = await this.oauth.authClient(account);
		} catch (err) {
			throw Error(`Error authenticating user ${err}`);
		}

		google.options({ auth: this.oauth.client });

		const accounts = (store.get(ACCOUNTS_INFO_KEY) as IAccounts) || {};
		const user = await this.getLoggedInAccountInfo();

		accounts.google = Object.assign(accounts.google || {}, {
			[user.email!]: {
				user,
				creds
			}
		});

		store.set(ACCOUNTS_INFO_KEY, accounts);

		return creds;
	}

	protected async getAccountCalendars(
		account: IAccount
	): Promise<ICalendar[]> {
		const { data: colors } = await gcal.colors.get();
		const { data } = await gcal.calendarList.list();
		if (!data.items) {
			return [];
		}

		return data.items.flatMap(calendar => {
			if (!calendar.summary || !calendar.id) {
				return [];
			}

			return {
				platform: 'google',
				account: account.user.email,
				id: calendar.id,
				name: calendar.summary,
				color: getColor(calendar, colors)
			};
		});
	}

	protected async getAccountEventsBetweenDates(
		account: IAccount,
		start: Date,
		end: Date,
		eventIds: Set<string>
	): Promise<IEvent[]> {
		const { data: colors } = await gcal.colors.get();
		const calendars = await this.getAccountCalendars(account);

		const events = await Promise.all(
			calendars.map(async calendar => {
				const options: calendar_v3.Params$Resource$Events$List = {
					timeMin: start.toISOString(),
					timeMax: end.toISOString(),
					singleEvents: true,
					showDeleted: false,
					orderBy: 'startTime'
				};

				if (calendar.id) {
					options.calendarId = calendar.id;
				}
				const { data: calendarEventsData } = await gcal.events.list(
					options
				);

				const cleanedEvents = (calendarEventsData.items || []).flatMap(
					event => {
						const { start, end, id, summary } = event;

						// avoid duplicate events
						if (id && summary) {
							eventIds.add(id);

							const common = {
								id,
								name: summary,
								calendar: {
									...calendar
									// color: getColor(calendar, colors, event)
								}
							};

							if (start && end) {
								// all day events
								if (start.date && end.date) {
									return {
										...common,
										start: new Date(start.date),
										end: new Date(end.date),
										allDay: true
									};
								} else if (start.dateTime && end.dateTime) {
									return {
										...common,
										start: new Date(start.dateTime),
										end: new Date(end.dateTime)
									};
								}
							}
						}
						return [];
					}
				);

				return cleanedEvents;
			})
		);

		return events.flat();
	}

	async createEvent(event: IEvent): Promise<boolean> {
		console.log('Creating event!', event);
		const e = {
			'summary': event.name,
			// 'location': '800 Howard St., San Francisco, CA 94103',
			'description': 'Test Event',
			'start': {
				'dateTime': event.start.toISOString(),
				'timeZone': format(event.start, 'OOOO')
			},
			'end': {
				'dateTime': event.end.toISOString(),
				'timeZone': format(event.end, 'OOOO')
			},
			// 'recurrence': [
			// 	'RRULE:FREQ=DAILY;COUNT=2'
			// ],
			// 'attendees': [
			// 	{'email': 'lpage@example.com'},
			// 	{'email': 'sbrin@example.com'}
			// ],
			// 'reminders': {
			// 	'useDefault': false,
			// 	'overrides': [
			// 		{'method': 'email', 'minutes': 24 * 60},
			// 		{'method': 'popup', 'minutes': 10}
			// 	]
			// }
		};
		gcal.events.insert({calendarId: event.calendar.id, requestBody: e});

		return true;
	}
}

function getColor(
	calendar: calendar_v3.Schema$CalendarListEntry,
	colors: calendar_v3.Schema$Colors,
	event?: calendar_v3.Schema$Event
): string {
	if (calendar.backgroundColor) {
		return calendar.backgroundColor;
	} else if (
		event &&
		event.colorId &&
		colors.event &&
		colors.event[event.colorId]
	) {
		return colors.event[event.colorId].background!;
	} else if (
		calendar.colorId &&
		colors.calendar &&
		colors.calendar[calendar.colorId]
	) {
		return colors.calendar[calendar.colorId].background!;
	}

	return '#1a73e8';
}

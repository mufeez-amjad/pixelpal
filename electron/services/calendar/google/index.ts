import {
	ACCOUNTS_INFO_KEY,
	BaseCalendar,
	IAccount,
	IAccounts,
	IEvent,
	IUser
} from '../base';

import Auth from './oauth';
import secretAccountKey from './secretAccountKey.json';
import { calendar_v3, google } from 'googleapis';
const gcal = google.calendar('v3');

import Store from 'electron-store';
import { Credentials } from '../oauth';
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
				'https://www.googleapis.com/auth/calendar.events.readonly',
				// 'https://www.googleapis.com/auth/userinfo.profile',
				'https://www.googleapis.com/auth/userinfo.email'
			]
		};
		this.oauth = new Auth(opts);

		console.log('accounts', this.accounts);
	}

	async getLoggedInAccountInfo(): Promise<IUser> {
		const { data } = await google.oauth2('v2').userinfo.get();
		return {
			email: data.email
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

	protected async getAccountEventsBetweenDates(
		account: IAccount,
		start: Date,
		end: Date
	): Promise<IEvent[]> {
		const { data: colors } = await gcal.colors.get();

		const { data: calendarsData } = await gcal.calendarList.list();

		const events = await Promise.all(
			(calendarsData.items || []).map(async calendar => {
				const options: calendar_v3.Params$Resource$Events$List = {
					timeMin: start.toISOString(),
					timeMax: end.toISOString()
				};

				if (calendar.id) {
					options.calendarId = calendar.id;
				}
				const { data: calendarEventsData } = await gcal.events.list(
					options
				);

				const cleanedEvents = (calendarEventsData.items || []).flatMap(
					event => {
						const { start, end } = event;

						if (start && end && event.summary) {
							if (start.date && end.date) {
								return {
									name: event.summary,
									start: new Date(start.date),
									end: new Date(end.date),
									allDay: true,
									calendar: {
										name: calendar.summary || 'primary',
										color: getColor(event, calendar, colors)
									}
								};
							} else if (start.dateTime && end.dateTime) {
								return {
									name: event.summary,
									start: new Date(start.dateTime),
									end: new Date(end.dateTime),
									calendar: {
										name: calendar.summary || 'primary',
										color: getColor(event, calendar, colors)
									}
								};
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
}

function getColor(
	event: calendar_v3.Schema$Event,
	calendar: calendar_v3.Schema$CalendarListEntry,
	colors: calendar_v3.Schema$Colors
): string {
	if (calendar.backgroundColor) {
		return calendar.backgroundColor;
	} else if (event.colorId && colors.event && colors.event[event.colorId]) {
		return colors.event[event.colorId].background!;
	} else if (
		calendar.colorId &&
		colors.calendar &&
		colors.calendar[calendar.colorId]
	) {
		return colors.calendar[calendar.colorId].background!;
	}

	return '#333333';
}

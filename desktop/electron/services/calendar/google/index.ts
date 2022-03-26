import {
	ACCOUNTS_INFO_KEY,
	BaseCalendar,
	IAccount,
	IAccounts,
	ICalendar,
	IConference,
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
					event => cleanEvent(event, calendar)
				);

				return cleanedEvents;
			})
		);

		return events.flat();
	}

	async createEvent(event: IEvent): Promise<IEvent> {
		const payload: calendar_v3.Schema$Event = {
			summary: event.name,
			// 'location': '800 Howard St., San Francisco, CA 94103',
			description: 'Test Event',
			start: {
				dateTime: event.start.toISOString(),
				timeZone: format(event.start, 'OOOO')
			},
			end: {
				dateTime: event.end.toISOString(),
				timeZone: format(event.end, 'OOOO')
			},
			conferenceData: {
				createRequest: {
					conferenceSolutionKey: {
						type: 'hangoutsMeet',
					},
					requestId: `${event.name}-${event.start.toISOString()}-${event.end.toISOString()}`
				}
			}
		};
		const res = await gcal.events.insert({calendarId: event.calendar.id, requestBody: payload, conferenceDataVersion: 1});
		return cleanEvent(res.data, event.calendar);
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

function cleanEvent(res: calendar_v3.Schema$Event, calendar: ICalendar): IEvent {
	const { start, end, id, summary, htmlLink, conferenceData } = res;

	const conference: IConference[] = [];

	if (conferenceData) {
		if (conferenceData.conferenceSolution) {
			const {name, iconUri} = conferenceData.conferenceSolution!;
			
			if (name && iconUri && conferenceData.entryPoints) {
				conferenceData.entryPoints.forEach(ep => {
					const conferenceSolution = {
						name: name!,
						icon: iconUri!,
						entryPoint: [{
							label: ep.label!,
							uri: ep.uri!,
						}]
					};
					conference.push(conferenceSolution);
				});
			}
		}
	}

	const common = {
		id: id!,
		name: summary!,
		calendar: {
			...calendar
			// color: getColor(calendar, colors, event)
		},
		url: htmlLink!,
		conference
	};

	if (start?.dateTime && end?.dateTime) {
		return {
			...common,
			start: new Date(start!.dateTime),
			end: new Date(end!.dateTime),
		};
	} else {
		// all-day event
		return {
			...common,
			start: new Date(start!.date!),
			end: new Date(end!.date!),
			allDay: true,
		};
	}
}
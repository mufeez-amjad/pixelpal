import {
	AuthProviderCallback,
	Client
} from '@microsoft/microsoft-graph-client';

import { BaseCalendar, IAccount, ICalendar, IEvent } from '../base';
import { ACCOUNTS_INFO_KEY, IAccounts } from '../base';
import { Credentials } from '../oauth';
import Auth from './oauth';

import {
	Event as OutlookIEvent,
	Calendar as OutlookICalendar,
	User as OutlookIUser
} from '@microsoft/microsoft-graph-types';

import Store from 'electron-store';
const store = new Store();

export class OutlookCalendar extends BaseCalendar {
	oauth: Auth;
	client?: Client;
	creds?: Credentials;

	constructor() {
		const { microsoft } = store.get(ACCOUNTS_INFO_KEY, {}) as IAccounts;
		super(microsoft);

		const opts = {
			clientId: '4141f923-f32b-4737-8946-b8e2fd52c0cf',
			scopes: [
				'https://graph.microsoft.com/Calendars.Read',
				'https://graph.microsoft.com/User.Read',
				'offline_access'
			]
		};
		this.oauth = new Auth(opts);
	}

	async getLoggedInAccountInfo(): Promise<OutlookIUser | undefined> {
		if (!this.client || !this.creds) {
			return;
		}

		const res = await this.client
			.api('/me')
			.header('Authorization', `Bearer ${this.creds.access_token}`)
			.header('Content-Type', 'application/json')
			.get();

		return res as OutlookIUser;
	}

	async auth(account?: IAccount): Promise<Credentials> {
		const callback = async (done: AuthProviderCallback) => {
			try {
				const creds = await this.oauth.getCreds(account);
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

		this.creds = await this.oauth.getCreds(account);

		const accounts = store.get(ACCOUNTS_INFO_KEY, {}) as IAccounts;
		const user = await this.getLoggedInAccountInfo();

		if (user) {
			const email = user.mail || user.userPrincipalName!;
			accounts.microsoft = Object.assign(accounts.microsoft || {}, {
				[email]: {
					user: {
						email
					},
					creds: this.creds
				}
			});

			store.set(ACCOUNTS_INFO_KEY, accounts);
		}

		return this.creds;
	}

	protected async getAccountEventsBetweenDates(
		account: IAccount,
		start: Date,
		end: Date,
		eventIds: Set<string>
	): Promise<IEvent[]> {
		const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

		const calendars = await this.getAccountCalendars(account);

		const events = await Promise.all(
			calendars.map(async calendar => {
				const res = await this.client!.api('/me/calendarview')
					.header(
						'Authorization',
						`Bearer ${account.creds!.access_token}`
					)
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
						id: event.id!,
						name: event.subject!,
						start: new Date(start!.dateTime!),
						end: new Date(end!.dateTime!),
						allDay: event.isAllDay || false,
						calendar
					};
				});

				return events;
			})
		);

		return events.flat();
	}

	protected async getAccountCalendars(
		account: IAccount
	): Promise<ICalendar[]> {
		const calendarsData = await this.client!.api('/me/calendars')
			.header('Authorization', `Bearer ${account.creds!.access_token}`)
			.get();

		const calendars = calendarsData.value as Array<OutlookICalendar>;
		return calendars.flatMap(calendar => {
			if (!calendar.name || !calendar.id) {
				return [];
			}

			return {
				platform: 'microsoft',
				account: account.user.email,
				id: calendar.id,
				name: calendar.name,
				color: calendar.hexColor || calendar.color || '#ffffff'
			};
		});
	}

	async createEvent(event: IEvent): Promise<IEvent> {
		return event;
	}
}

import { User } from '@microsoft/microsoft-graph-types';
import { oauth2_v2 } from 'googleapis';
import { Credentials } from './oauth';

export interface IEvent {
	name: string;
	start: Date;
	end: Date;
	allDay?: boolean;
	calendar: CalendarProperties;
}

interface CalendarProperties {
	name: string;
	color: string;
}

export const ACCOUNTS_INFO_KEY = 'connected-accounts-info';

export interface IUser {
	email?: string | null | undefined;
}

export interface IAccount {
	user: IUser;
	creds?: Credentials;
}

export interface IAccounts {
	google?: {
		[key: string]: IAccount;
	};
	microsoft?: {
		[key: string]: IAccount;
	};
}

export abstract class BaseCalendar {
	abstract getEventsBetweenDates(
		start: Date,
		end: Date
	): Promise<IEvent[] | undefined>;

	abstract auth(add: boolean): Promise<void>;
}

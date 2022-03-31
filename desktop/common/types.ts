export interface ICalendar {
	platform: string;
	account: string;
	id: string;
	name: string;
	color: string;
}
export interface IEvent {
	id: string;
	name: string;
	start: Date;
	end: Date;
	allDay?: boolean;
	calendar: ICalendar;
	conference: IConference[];
	url: string;
	description: string;
}

export interface IConference {
	name: string;
	icon: string;
	entryPoint: EntryPoint[];
}

export interface EntryPoint {
	uri: string;
	type: string;
}

export interface IUser {
	email?: string | null | undefined;
}

export interface IAccount {
	user: IUser;
}

export interface IPlatformAccounts {
	[key: string]: IAccount;
}

export interface IAccounts {
	google?: IPlatformAccounts;
	microsoft?: IPlatformAccounts;
}

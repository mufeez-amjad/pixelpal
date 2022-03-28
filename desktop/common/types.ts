export interface ICalendar {
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
}

export interface IConference {
	name: string;
	icon: string;
	entryPoint: EntryPoint[];
}

export interface EntryPoint {
	uri: string;
	label: string;
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

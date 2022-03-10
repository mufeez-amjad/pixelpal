export interface ICalendar {
	name: string;
	color: string;
}
export interface IEvent {
	name: string;
	start: Date;
	end: Date;
	allDay?: boolean;
	calendar: ICalendar;
}

export interface IScheduledEvent extends IEvent {
	overlapsIn?: number;
	overlapsOut?: number;
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

interface CalendarProperties {
	name: string;
	color: string;
}

export interface IEvent {
	name: string;
	start: Date;
	end: Date;
	allDay?: boolean;
	calendar: CalendarProperties;
}

export interface IUser {
	email?: string | null | undefined;
}

export interface IAccount {
	user: IUser;
}

export interface IAccounts {
	google?: {
		[key: string]: IUser;
	};
	microsoft?: {
		[key: string]: IUser;
	};
}

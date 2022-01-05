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

export abstract class BaseCalendar {
	abstract getEventsBetweenDates(
		start: Date,
		end: Date
	): Promise<IEvent[] | undefined>;
}

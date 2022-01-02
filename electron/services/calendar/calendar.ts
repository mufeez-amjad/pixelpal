/* eslint-disable no-unused-vars */

export interface Event {
	name: string;
	start: Date;
	end: Date;
	calendar: CalendarProperties;
}

interface CalendarProperties {
	name: string;
	color: string;
}

export abstract class Calendar {
	abstract getEventsBetweenDates(
		start: Date,
		end: Date
	): Promise<Event[] | undefined>;
}

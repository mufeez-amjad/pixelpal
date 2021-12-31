/* eslint-disable no-unused-vars */

export interface Event {
	name: string;
	start: Date;
	end: Date;
	calendar: string;
}

export abstract class Calendar {
	abstract getEventsForDay(d: Date): Promise<Event[] | undefined>;
}

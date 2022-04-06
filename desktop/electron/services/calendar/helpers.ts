import { isAfter, isBefore } from 'date-fns';
import { BaseCalendar, IEvent } from './base';
import { GoogleCalendar } from './google';
import { OutlookCalendar } from './outlook';

export async function getEventsBetweenDates(start: Date, end: Date) {
	try {
		let events: IEvent[] = [];
		// const platformEvents: IEvent[];
		let platform: BaseCalendar = new GoogleCalendar();
		events = events.concat(
			await platform.getEventsBetweenDates(start, end)
		);

		platform = new OutlookCalendar();
		events = events.concat(
			await platform.getEventsBetweenDates(start, end)
		);

		events.sort((eventA, eventB) => {
			if (isBefore(eventA.start, eventB.start)) {
				return -1;
			} else if (isAfter(eventA.start, eventB.start)) {
				return 1;
			}

			return 0;
		});
		return events;
	} catch (e) {
		throw Error('Failed to retrieve events.');
	}
}

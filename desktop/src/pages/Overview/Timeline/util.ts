import { intervalToDuration } from 'date-fns';
import sortBy from 'lodash.sortby';
import { IEvent } from '../../../../common/types';

const HOUR_HEIGHT = 48;

export interface RenderedEvent {
	event: IEvent;
	styles: {
		top: number;
		height: number;
		width: number;
		xOffset: number;
	};
	divided: boolean;
}

class Event {
	start: Date;
	end: Date;

	startMs: number;
	endMs: number;

	container?: Event;
	row?: Event;
	leaves?: Event[];
	rows?: Event[];
	data: IEvent;

	constructor (data: IEvent) {
		this.start = data.start;
		this.end = data.end;
		this.startMs = data.start.getTime();
		this.endMs = data.end.getTime();
		this.data = data;
	}

	get top(): number {
		return getOffsetTop(this.start, this.end, this.data.allDay);
	}

	get height(): number {
		return getHeight(this.start, this.end, this.data.allDay);
	}

	/**
	 * The event's width without any overlap.
	 */
	get _width() : number {
		// The container event's width is determined by the maximum number of
		// events in any of its rows.
		if (this.rows) {
			const columns =
				this.rows.reduce(
					(max, row) => Math.max(max, row.leaves!.length + 1), // add itself
					0
				) + 1; // add the container

			return 100 / columns;
		}

		const availableWidth = 100 - this.container!._width;

		// The row event's width is the space left by the container, divided
		// among itself and its leaves.
		if (this.leaves) {
			return availableWidth / (this.leaves.length + 1);
		}

		// The leaf event's width is determined by its row's width
		return this.row!._width;
	}

	/**
	 * The event's calculated width, possibly with extra width added for
	 * overlapping effect.
	 */
	get width() {
		const noOverlap = this._width;
		const overlap = Math.min(100, this._width * 1.7);

		// Containers can always grow.
		if (this.rows) {
			return overlap;
		}

		// Rows can grow if they have leaves.
		if (this.leaves) {
			return this.leaves.length > 0 ? overlap : noOverlap;
		}

		// Leaves can grow unless they're the last item in a row.
		const { leaves } = this.row!;
		const index = leaves!.indexOf(this);
		return index === leaves!.length - 1 ? noOverlap : overlap;
	}

	get xOffset(): number {
		// Containers have no offset.
		if (this.rows) return 0;

		// Rows always start where their container ends.
		if (this.leaves) return this.container!._width;

		// Leaves are spread out evenly on the space left by its row.
		const { leaves, xOffset, _width } = this.row!;
		const index = leaves!.indexOf(this) + 1;
		return xOffset + index * _width;
	}
}

export function getHeight(start: Date, end: Date, allDay?: boolean) {
	const duration = intervalToDuration({
		start,
		end
	});

	if (allDay) {
		return 0;
	}

	if (duration.hours != null && duration.minutes != null) {
		return (duration.hours + duration.minutes / 60) * HOUR_HEIGHT;
	}
	return 0;
}

export function getOffsetTop(start: Date, end: Date, allDay?: boolean) {
	return !allDay ? (start.getHours() + start.getMinutes() / 60) * HOUR_HEIGHT: 0;
}

/**
 * Return true if event a and b is considered to be on the same row.
 */
function onSameRow(a: Event, b: Event, minimumStartDifference: number) {
	return (
		// Occupies the same start slot.
		Math.abs(b.start.getTime() - a.start.getTime()) < minimumStartDifference ||

		// A's start slot overlaps with b's end slot.
		(b.start > a.start && b.start < a.end)
	);
}

function sortByRender(events: Event[]): Event[] {
	const sortedByTime = sortBy(events, ['startMs', (e: Event) => -e.endMs]);

	const sorted: Event[] = [];
	while (sortedByTime.length > 0) {
		const event = sortedByTime.shift();
		if (!event) continue;
		sorted.push(event);

		for (let i = 0; i < sortedByTime.length; i++) {
			const test = sortedByTime[i];

			// Still inside this event, look for next.
			if (event!.endMs > test.startMs) continue;

			// We've found the first event of the next event group.
			// If that event is not right next to our current event, we have to
			// move it here.
			if (i > 0) {
				const event = sortedByTime.splice(i, 1)[0];
				sorted.push(event);
			}

			// We've already found the next event group, so stop looking.
			break;
		}
	}

	return sorted;
}

export default function getStyledEvents({
	events,
	minimumStartDifference,
}: {events: IEvent[], minimumStartDifference: number}): RenderedEvent[] {
	// Create proxy events and order them so that we don't have
	// to fiddle with z-indexes.
	const proxies = events.map(
		(event: IEvent) => new Event(event)
	);
	const eventsInRenderOrder: Event[] = sortByRender(proxies);

	// Group overlapping events, while keeping order.
	// Every event is always one of: container, row or leaf.
	// Containers can contain rows, and rows can contain leaves.
	const containerEvents: Event[] = [];
	for (let i = 0; i < eventsInRenderOrder.length; i++) {
		const event = eventsInRenderOrder[i];

		// Check if this event can go into a container event.
		const container = containerEvents.find(
			(c) =>
				c.end > event!.start ||
				Math.abs(event!.start.getTime() - c.start.getTime()) < minimumStartDifference
		);

		// Couldn't find a container — that means this event is a container.
		if (!container) {
			event!.rows = [];
			containerEvents.push(event!);
			continue;
		}

		// Found a container for the event.
		event!.container = container;

		// Check if the event can be placed in an existing row.
		// Start looking from behind.
		let row = null;
		for (let j = container.rows!.length - 1; !row && j >= 0; j--) {
			if (onSameRow(container.rows![j], event!, minimumStartDifference)) {
				row = container.rows![j];
			}
		}

		if (row) {
			// Found a row, so add it.
			row.leaves!.push(event!);
			event!.row = row;
		} else {
			// Couldn't find a row – that means this event is a row.
			event!.leaves = [];
			container.rows!.push(event!);
		}
	}

	// Return the original events, along with their styles.
	return eventsInRenderOrder.map((event: Event) => ({
		event: event.data,
		styles: {
			top: event.top,
			height: event.height,
			width: event.width,
			xOffset: Math.max(0, event.xOffset),
		},
		divided: event.width < 100
	}));
}
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { addHours, format, isSameDay } from 'date-fns';
import { ICalendar, IEvent } from '../../../common/types';

interface EventPayload {
	day?: Date;
	event: IEvent | null;
	state: EventState;
}
interface EventsPayload {
	day?: Date;
	events: IEvent[];
}
interface DayPayload {
	day: Date;
}
interface CalendarsPayload {
	calendars: Record<string, ICalendar[]>;
}

export enum EventState {
	none,
	dragging,
	creating,
	selected
}

// Define a type for the slice state
interface EventsState {
	calendars: Record<string, ICalendar[]>;
	events: Record<string, IEvent[]>;
	event: {
		value: IEvent;
		state: EventState;
	} | null;
	selectedDay: Date;
}

export const dayKeyFormat = (date: Date) => {
	return format(date, 'd/M/yyyy');
};

// Define the initial state using that type
const initialState: EventsState = {
	calendars: {},
	events: {},
	event: null,
	selectedDay: new Date()
};

export const calendarSlice = createSlice({
	name: 'calendar',
	initialState,
	reducers: {
		setEvent: (state, action: PayloadAction<EventPayload>) => {
			console.log('Setting event in reducer!', action.payload);

			if (action.payload.event) {
				state.event = {
					value: action.payload.event,
					state: action.payload.state,
				};
			} else {
				state.event = null;
			}
		},
		addEvents: (state, action: PayloadAction<EventsPayload>) => {
			const {payload} = action;
			const nextState: Record<string, IEvent[]> = state.events;
			const addToState = (date: Date, event: IEvent) => {
				const key = dayKeyFormat(date);

				if (!(key in nextState)) {
					nextState[key] = [];
				}
				nextState[key].push(event);
			};
			payload.events.forEach(event => {
				addToState(event.start, event);
				if (!isSameDay(event.start, event.end)) {
					addToState(event.end, event);
				}
			});
			state.events = nextState;
		},
		setEvents: (state, action: PayloadAction<EventsPayload>) => {
			const { payload } = action;

			if (payload.day) {
				const key = dayKeyFormat(payload.day);
				state.events = Object.assign(state.events, {
					[key]: payload.events
				});
			} else {
				const nextState: Record<string, IEvent[]> = {};
				const addToState = (date: Date, event: IEvent) => {
					const key = dayKeyFormat(date);

					if (!(key in nextState)) {
						nextState[key] = [];
					}
					nextState[key].push(event);
				};

				payload.events.forEach(event => {
					addToState(event.start, event);
					if (!isSameDay(event.start, event.end)) {
						addToState(event.end, event);
					}
				});

				state.events = nextState;
			}
		},
		setSelectedDay: (state, action: PayloadAction<DayPayload>) => {
			state.selectedDay = new Date(action.payload.day);
		},
		setCalendars(state, action: PayloadAction<CalendarsPayload>) {
			state.calendars = action.payload.calendars;
		}
	}
});

// Action creators are generated for each case reducer function
export const { addEvents, setEvent, setEvents, setSelectedDay, setCalendars } =
	calendarSlice.actions;

export default calendarSlice.reducer;

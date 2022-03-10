import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { format, isSameDay } from 'date-fns';
import { ICalendar, IEvent } from '../../../common/types';

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

// Define a type for the slice state
interface EventsState {
	calendars: Record<string, ICalendar[]>;
	events: Record<string, IEvent[]>;
	selectedDay: Date;
}

// Define the initial state using that type
const initialState: EventsState = {
	calendars: {},
	events: {},
	selectedDay: new Date()
};

export const dayKeyFormat = (date: Date) => {
	return format(date, 'd/M/yyyy');
};

export const calendarSlice = createSlice({
	name: 'calendar',
	initialState,
	reducers: {
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
export const { setEvents, setSelectedDay, setCalendars } =
	calendarSlice.actions;

export default calendarSlice.reducer;

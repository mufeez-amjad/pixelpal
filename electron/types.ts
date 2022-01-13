// TODO: remove these and use only typeorm entities

export interface CreateHabitRequest {
	name: string;
	frequency: number;
	start_time: number;
	end_time: number;
	days: string;
}

export interface Habit {
	id: number;
	name: string;
	frequency: number;
	start_time: number;
	end_time: number;
	days: string;
	reminder_at: number;
}

export interface HabitEventCounts {
	habit_id: number;
	type: string;
	num_events: number;
}

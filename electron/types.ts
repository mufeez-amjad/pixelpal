export interface CreateHabitRequest {
	name: string;
	frequency: number;
	start_time: number;
	end_time: number;
	days: string;
}

export interface HabitEventCounts {
	habit_id: number;
	type: string;
	num_events: number;
}

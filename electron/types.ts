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

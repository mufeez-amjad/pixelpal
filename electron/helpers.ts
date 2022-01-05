import { getDatabaseConnection } from './services/db/DatabaseService';
import { CreateHabitRequest, Habit } from './types';

const dayChars: Record<string, number> = {
	U: 0,
	M: 1,
	T: 2,
	W: 3,
	R: 4,
	F: 5,
	S: 6
};

const getDayMinutes = (date: Date): number => {
	return 60 * date.getHours() + date.getMinutes();
};

const getDays = (dayString: string): Record<number, boolean> => {
	const days: Record<number, boolean> = {};
	for (const char of dayString) {
		days[dayChars[char]] = true;
	}
	return days;
};

export function calculateNextReminderAt(
	habit: CreateHabitRequest | Habit,
	reminderAtMillis?: number
): number {
	const possibleDays = getDays(habit.days);

	// Check preconditions:
	//  - At least one day is selected
	//  - The startTime of the window is before the endTime of the window
	if (
		Object.keys(possibleDays).length == 0 ||
		habit.start_time > habit.end_time
	) {
		console.error(`Malformed habit: ${JSON.stringify(habit)}`);
		return Number.MAX_SAFE_INTEGER;
	}

	let reminderAt: Date;
	if (reminderAtMillis) {
		reminderAt = new Date(reminderAtMillis);
		reminderAt.setSeconds(0, 0); // truncate up to (& incl) seconds
	} else {
		// Set the reminder time to yesterday, and the following logic will take care of crafting the next reminder
		// time.
		reminderAt = new Date();
		reminderAt.setDate(reminderAt.getDate() - 1);
	}

	// 1. Check if the reminder date is from before today. If so, set it to the beginning of today.
	const startOfToday = new Date();
	startOfToday.setHours(0, 0, 0, 0); // truncate up to (& incl) hours
	if (reminderAt < startOfToday) {
		reminderAt = startOfToday;
		reminderAt.setHours(habit.start_time, 0);
	}

	// 2. Check if the reminder clock time (minutes since start of day) is from before right now. If so, increment by
	// frequency until the reminder time is after right now, or we reach the end of the window.
	let reminderMinutes = getDayMinutes(reminderAt);
	const nowMinutes = getDayMinutes(new Date());
	while (reminderMinutes <= Math.min(nowMinutes, 60 * habit.end_time)) {
		reminderMinutes += habit.frequency;
	}
	reminderAt.setHours(reminderMinutes / 60, reminderMinutes % 60);

	// 3. Check if the reminder is set after the window, or for an valid day,
	while (
		getDayMinutes(reminderAt) > 60 * habit.end_time ||
		!possibleDays[reminderAt.getDay()]
	) {
		// advance by one day
		reminderAt.setDate(reminderAt.getDate() + 1);
		reminderAt.setHours(habit.start_time, 0);
	}

	return reminderAt.getTime();
}

export async function getCountsForHabit(habit: Habit) {
	const dailyEventCounts =
		await getDatabaseConnection().getTodayEventCountsForHabit(habit);
	const counts: any = {};

	dailyEventCounts.forEach((e: any) => {
		counts[e.type] = e.num_events;
	});

	return counts;
}

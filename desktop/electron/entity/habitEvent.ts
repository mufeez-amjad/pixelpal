import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export interface HabitEventCounts {
	habit_id: number;
	type: string;
	num_events: number;
}

@Entity('habit_events')
export class HabitEvent {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	habit_id!: number;

	@Column()
	type!: string;

	@Column()
	timestamp!: number;
}

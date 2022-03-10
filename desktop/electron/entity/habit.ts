import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

@Entity('habit')
export class Habit extends BaseEntity {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	name!: string;

	@Column()
	frequency!: number;

	@Column()
	start_time!: number;

	@Column()
	end_time!: number;

	@Column()
	days!: string;

	@Column()
	reminder_at!: number;
}

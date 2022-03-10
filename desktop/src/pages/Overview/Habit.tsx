import React from 'react';
import styled from 'styled-components';
import { formatRelative } from 'date-fns';

import {
	CircularProgressbarWithChildren,
	buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { FaCheck } from 'react-icons/fa';

export interface IHabit {
	id: number;
	name: string;
	reminder_at: Date;
	total: number;
	frequency: number;
	done: number;
}

interface Props {
	habit: IHabit
}

const Habit = ({ habit }: Props) : JSX.Element => {
	const getProgressBarColor = (percentage: number) => {
		if (percentage < 0.1) {
			return '#e71b33';
		} else if (percentage < 0.3) {
			return '#c92727';
		} else if (percentage < 0.5) {
			return '#a03232';
		} else if (percentage < 0.8) {
			return '#3c8b28';
		} else {
			return '#3e9726';
		}
	};

	const nextTime = React.useMemo(() => {
		return formatRelative(new Date(habit.reminder_at), new Date());
	}, [habit]);

	const frequency = React.useMemo(() => {
		if (habit.frequency < 60) {
			return `${habit.frequency} minutes`;
		} else {
			const hours = habit.frequency / 60;
			if (hours == 1) {
				return `${hours} hour`;
			}
			return `${hours} hours`;
		}
	}, []);

	return (
		<Container>
			<Progress>
				<CircularProgressbarWithChildren
					value={habit.done}
					maxValue={habit.total}
					strokeWidth={20}
					styles={buildStyles({
						pathColor: getProgressBarColor(habit.done / habit.total)
					})}
				>
					{habit.done === habit.total && (
						<FaCheck
							color={getProgressBarColor(
								habit.done / habit.total
							)}
							size={10}
						/>
					)}
				</CircularProgressbarWithChildren>
			</Progress>
			<HabitDetails>
				<HabitTitle>{habit.name}</HabitTitle>
				<HabitTime>
					Every {frequency} - next {nextTime}
				</HabitTime>
			</HabitDetails>
			<HabitCount>
				<div>{habit.done}</div>
				<div style={{ marginTop: 5, paddingLeft: 5, paddingRight: 5 }}>
					/
				</div>
				<div style={{ marginTop: 10 }}>{habit.total}</div>
			</HabitCount>
		</Container>
	);
};

const Container = styled.div`
	flex-grow: 1;
	border-radius: 15px;
	background-color: white;
	width: 90%;

	display: flex;
	align-items: center;
	padding: 15px;
	margin-right: 10px;
	margin-left: 10px;
	margin-top: 5px;
	margin-bottom: 5px;
	justify-content: space-between;
`;

const Progress = styled.div`
	height: 30px;
	width: 30px;
	margin: 10px;
`;

const HabitTitle = styled.div`
	font-size: 16px;
	font-weight: 700;
`;

const HabitDetails = styled.div`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	margin-left: 10px;
`;

const HabitTime = styled.div`
	font-size: 14px;
	color: grey;
`;

const HabitCount = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-right: 10px;
	font-weight: bold;
`;

export default Habit;

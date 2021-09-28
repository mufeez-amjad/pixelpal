import React from 'react';
import styled from 'styled-components';

import {
	CircularProgressbarWithChildren,
	buildStyles
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { FaCheck } from 'react-icons/fa';

const Habit = ({ habit }) => {
	const getProgressBarColor = percentage => {
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
				<HabitTime>Every hour - next at 6pm</HabitTime>
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
	border-radius: 15px;
	background-color: white;
	width: 90%;

	display: flex;
	align-items: center;
	padding: 15px;
	margin: 5px;
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

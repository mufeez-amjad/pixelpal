import React from 'react';
import styled from 'styled-components';

import {
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
	addWeeks,
	getDay,
	format
} from 'date-fns';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Day({ day, selectedDay, onClick, current }) {
	const isSelected = () => {
		return isSameDay(selectedDay, day);
	};

	const weekday = () => {
		return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][getDay(day)];
	};

	return (
		<DayContainer current={current}>
			<span>{weekday()}</span>
			<DateContainer
				current={current}
				selected={isSelected()}
				onClick={() => onClick()}
			>
				<span>{day.getDate()}</span>
			</DateContainer>
		</DayContainer>
	);
}

function WeekCalendar({ selectedDay, onWeekdaySelect }) {
	const [refDay, setRefDay] = React.useState(startOfWeek(selectedDay));

	const daysOfWeek = React.useMemo(() => {
		return eachDayOfInterval({
			start: startOfWeek(refDay),
			end: endOfWeek(refDay)
		});
	}, [refDay]);

	React.useEffect(() => {
		setRefDay(selectedDay);
	}, [selectedDay]);

	const advanceWeek = num => {
		setRefDay(addWeeks(startOfWeek(refDay), num));
	};

	const [month, year] = format(refDay, 'MMMM yyyy').split(' ');

	return (
		<Container>
			<Month onClick={() => onWeekdaySelect(new Date())}>
				<span>{month}</span>
				<span> {year}</span>
			</Month>
			<Week>
				<FaChevronLeft onClick={() => advanceWeek(-1)} />
				<DaysContainer>
					{daysOfWeek.map((day, index) => (
						<Day
							key={index}
							day={day}
							selectedDay={selectedDay}
							onClick={() => onWeekdaySelect(day)}
							current={isSameMonth(refDay, day)}
						/>
					))}
				</DaysContainer>
				<FaChevronRight onClick={() => advanceWeek(1)} />
			</Week>
		</Container>
	);
}

const Container = styled.div`
	display: flex;
	flex-direction: column;
	padding: 10px;
	padding-top: 20px;
`;

const Month = styled.div`
	padding: 5px 10px;
	font-size: 16px;

	> span {
		&:first-child {
			font-weight: 700;
		}

		&:last-child {
			color: #fcb852;
		}
	}
`;

const Week = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 10px;
`;

const DaysContainer = styled.div`
	display: flex;
	justify-content: space-between;
`;

const DayContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	> span {
		font-size: 10px;
	}

	${({ current }) =>
		!current &&
		`
	color: #ccc;
  	`}

	${({ selected }) =>
		selected &&
		`
	color: white;
	background: #FCB852;
  	`}
`;

const DateContainer = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 4px;
	width: 32px;
	height: 32px;
	border-radius: 32px;

	${({ current }) =>
		!current &&
		`
	color: #ccc;
  	`}

	${({ selected }) =>
		selected &&
		`
	color: white;
	background: #FCB852;
  	`}
`;

export default WeekCalendar;

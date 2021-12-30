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
import useKeyboardShortcuts, { KEY_CODE, SHORTCUT } from '../../hooks/use_keyboard_shortcuts';

interface IDay {
	day: Date;
	selectedDay: Date;
	onClick: () => void;
	current: boolean;
}

function Day({ day, selectedDay, onClick, current }: IDay) {
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

interface Props {
	selectedDay: Date;
	// eslint-disable-next-line no-unused-vars
	onWeekdaySelect: (d: Date) => void;
}
function WeekCalendar({ selectedDay, onWeekdaySelect }: Props) {
	const [refDay, setRefDay] = React.useState(startOfWeek(selectedDay));
	const lastShortcut = useKeyboardShortcuts([
		{name: SHORTCUT.ARROW_LEFT, keyCode: KEY_CODE.ARROW_LEFT},
		{name: SHORTCUT.ARROW_RIGHT, keyCode: KEY_CODE.ARROW_RIGHT},
	]);

	React.useEffect(() => {
		setRefDay(selectedDay);
	}, [selectedDay]);

	// Act on keyboard shortcuts
	React.useEffect(() => {
		switch (lastShortcut) {
		case SHORTCUT.ARROW_LEFT:
			advanceWeek(-1);
			break;

		case SHORTCUT.ARROW_RIGHT:
			advanceWeek(1);
			break;
		}
	}, [lastShortcut]);

	const daysOfWeek = React.useMemo(() => {
		return eachDayOfInterval({
			start: startOfWeek(refDay),
			end: endOfWeek(refDay)
		});
	}, [refDay]);

	const advanceWeek = (num: number) => {
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

interface ContainerProps {
	current: boolean;
	selected?: boolean;
}

const DayContainer = styled.div<ContainerProps>`
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

const DateContainer = styled.div<ContainerProps>`
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

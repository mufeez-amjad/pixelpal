import React from 'react';
import * as Styled from './styled';

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
import useKeyboardShortcuts, { KEY_CODE, SHORTCUT } from '../../../hooks/use_keyboard_shortcuts';

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
		<Styled.DayContainer current={current}>
			<span>{weekday()}</span>
			<Styled.DateContainer
				current={current}
				selected={isSelected()}
				onClick={() => onClick()}
			>
				<span>{day.getDate()}</span>
			</Styled.DateContainer>
		</Styled.DayContainer>
	);
}

interface Props {
	selectedDay: Date;
	onWeekdaySelect: (d: Date) => void;
}

function WeekCalendar({ selectedDay, onWeekdaySelect }: Props) : JSX.Element {
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
		<Styled.Container>
			<Styled.Month onClick={() => onWeekdaySelect(new Date())}>
				<span>{month}</span>
				<span> {year}</span>
			</Styled.Month>
			<Styled.Week>
				<FaChevronLeft onClick={() => advanceWeek(-1)} />
				<Styled.DaysContainer>
					{daysOfWeek.map((day, index) => (
						<Day
							key={index}
							day={day}
							selectedDay={selectedDay}
							onClick={() => onWeekdaySelect(day)}
							current={isSameMonth(refDay, day)}
						/>
					))}
				</Styled.DaysContainer>
				<FaChevronRight onClick={() => advanceWeek(1)} />
			</Styled.Week>
		</Styled.Container>
	);
}

export default WeekCalendar;

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
	format,
	addDays
} from 'date-fns';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useKeyboardShortcuts, { KEY_CODE, SHORTCUT } from '../../../hooks/use_keyboard_shortcuts';
import { IEvent } from '../../../../common/types';
import { useAppSelector } from '../../../store/hooks';
import { dayKeyFormat } from '../../../store/calendar';

interface IDay {
	day: Date;
	selectedDay: Date;
	onClick: () => void;
	isCurrentMonth: boolean;
	isWeekend: boolean;
	events: IEvent[];
}

function Day({ day, selectedDay, onClick, isCurrentMonth, isWeekend, events}: IDay) {
	const isSelected = () => {
		return isSameDay(selectedDay, day);
	};

	const weekday = () => {
		return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][getDay(day)];
	};

	const colors = React.useMemo(() => {
		return Array.from(new Set(events.map(e => e.calendar.color)));
	}, [events]);

	return (
		<Styled.DayContainer
			current={isCurrentMonth}
			isWeekend={isWeekend}
		>
			<span>{weekday()}</span>
			<Styled.DateContainer
				current={isCurrentMonth}
				selected={isSelected()}
				onClick={() => onClick()}
			>
				<span>{day.getDate()}</span>
				<Styled.DotsContainer>
					{colors.map((c, i) => <Styled.Dot 
						color={c}
						key={i}
					/>)}
				</Styled.DotsContainer>
			</Styled.DateContainer>
		</Styled.DayContainer>
	);
}

interface Props {
	selectedDay: Date;
	onWeekdaySelect: (d: Date) => void;
}

function WeekCalendar({ selectedDay, onWeekdaySelect }: Props) : JSX.Element {
	const events = useAppSelector((state) => state.calendar.events);

	const [refDay, setRefDay] = React.useState(startOfWeek(selectedDay));
	const lastShortcut = useKeyboardShortcuts([
		{name: SHORTCUT.ARROW_LEFT, keyCode: KEY_CODE.ARROW_LEFT, altKey: true}, // TODO(mufeez): ctrlKey instead
		{name: SHORTCUT.ARROW_RIGHT, keyCode: KEY_CODE.ARROW_RIGHT, altKey: true},
		{name: SHORTCUT.SHIFT_ARROW_LEFT, keyCode: KEY_CODE.ARROW_LEFT, altKey: true, shiftKey: true},
		{name: SHORTCUT.SHIFT_ARROW_RIGHT, keyCode: KEY_CODE.ARROW_RIGHT, altKey: true, shiftKey: true},
	]);

	React.useEffect(() => {
		setRefDay(selectedDay);
	}, [selectedDay]);

	// Act on keyboard shortcuts
	React.useEffect(() => {
		switch (lastShortcut) {
		case SHORTCUT.SHIFT_ARROW_LEFT:
			advanceWeek(-1);
			break;
		case SHORTCUT.SHIFT_ARROW_RIGHT:
			advanceWeek(1);
			break;
		case SHORTCUT.ARROW_LEFT:
			onWeekdaySelect(addDays(selectedDay, -1));
			break;
		case SHORTCUT.ARROW_RIGHT:
			onWeekdaySelect(addDays(selectedDay, 1));
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
				<FaChevronLeft 
					onClick={() => advanceWeek(-1)}
					style={{marginLeft: -4}}
				/>
				<Styled.DaysContainer>
					{daysOfWeek.map((day, index) => (
						<Day
							key={index}
							day={day}
							selectedDay={selectedDay}
							onClick={() => onWeekdaySelect(day)}
							isCurrentMonth={isSameMonth(refDay, day)}
							isWeekend={index % 6 == 0}
							events={events[dayKeyFormat(day)] || []}
						/>
					))}
				</Styled.DaysContainer>
				<FaChevronRight 
					onClick={() => advanceWeek(1)}
					style={{marginRight: -4}}
				/>
			</Styled.Week>
		</Styled.Container>
	);
}

export default WeekCalendar;

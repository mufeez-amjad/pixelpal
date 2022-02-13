import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { endOfWeek, format, isAfter, isBefore, isSameDay, startOfWeek } from 'date-fns';
const { ipcRenderer } = window.require('electron');

import WeekCalendar from './WeekCalendar';
import { PageContainer } from '..';
import Timeline from './Timeline';

import { IEvent } from '../../../common/types';

import { IoAdd, IoSettingsSharp } from 'react-icons/io5';
import { BiStopwatch } from 'react-icons/bi';
import stand from './stand.gif';
import LoadingWrapper, { LoadingIndicator } from '../../common/LoadingWrapper';

import { useAppDispatch, useAppSelector } from '../../store/hooks';

import { dayKeyFormat, setEvents, setSelectedDay as setDay } from '../../store/calendar';

enum Showing {
	All = 'All',
	Events = 'Events',
	Todo = 'Todos',
}

function Overview(): JSX.Element {
	const events = useAppSelector((state) => state.calendar.events);
	const selectedDay = useAppSelector((state) => state.calendar.selectedDay);
	const dispatch = useAppDispatch();

	const [todaysEvents, setTodaysEvents] = React.useState<IEvent[]>([]);

	const [isLoading, setLoading] = React.useState(true);

	const setSelectedDay = (day: Date) => {
		dispatch(setDay({day: new Date(day)}));
	};

	React.useEffect(() => {
		console.log('Changed day to', selectedDay.toDateString());
		setTodaysEvents(events[dayKeyFormat(selectedDay)]);
	}, [events, selectedDay]);

	const { weekStart, weekEnd } = React.useMemo(() => {
		return {
			weekStart: startOfWeek(selectedDay).toISOString(),
			weekEnd: endOfWeek(selectedDay).toISOString()
		};
	}, [selectedDay]);

	React.useEffect(() => {
		(async () => {
			setLoading(true);
			let nextEvents: Array<IEvent> = [];
			try {
				nextEvents = await ipcRenderer.invoke('getEventsForWeek', {
					start: new Date(weekStart),
					end: new Date(weekEnd)
				});
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}

			dispatch(setEvents({ events: nextEvents }));
		})();
	}, [weekStart, weekEnd]);

	React.useEffect(() => {
		function handleWindowShow() {
			setSelectedDay(new Date());
		}
		ipcRenderer.on('hide-tray-window', handleWindowShow);
		return () => ipcRenderer.removeListener('hide-tray-window', handleWindowShow);
	}, []);

	return (
		<PageContainer>
			<Top>
				<div
					style={{
						padding: 20,
						paddingBottom: 4
					}}
				>
					<TopButtonsContainer>
						{isLoading && <LoadingIndicator
							style={{ width: 18, height: 18, marginRight: 12 }}
						/>}
						<TopButton
							to={'/'}
							hoverColor='tomato'
						>
							<BiStopwatch />
						</TopButton>

						<TopButton
							to={'/settings'}
						>
							<IoSettingsSharp />
						</TopButton>
					</TopButtonsContainer>
					<WeekCalendar
						selectedDay={selectedDay}
						onWeekdaySelect={setSelectedDay}
					/>
				</div>
				<Character>
					<img style={{ width: 100, height: 100 }} src={stand} />
				</Character>
			</Top>
			<Bottom>
				<Timeline
					events={todaysEvents}
					date={selectedDay}
				/>
			</Bottom>
		</PageContainer>
	);
}

export default Overview;

const Top = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	background-color: white;
`;

const Bottom = styled.div`
	flex: 4;
	overflow: overlay;
	position: relative;
`;

const Character = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;

	img {
		align-self: flex-end;
	}

	background: linear-gradient(white, #a3a3a3), url('http://pixelartmaker-data-78746291193.nyc3.digitaloceanspaces.com/image/2c8e48e8d8c0f41.png') no-repeat bottom right;
	background-size: 500px 140px;
	background-repeat: no-repeat;
	background-blend-mode: multiply;

	height: 140px;
`;

const TopButtonsContainer = styled.div`
	position: absolute;
	right: 20px;
	top: 25px;

	display: flex;
	flex-direction: row;
	align-items: center;

	font-size: 16px;
`;

interface TopButtonProps {
	hoverColor?: string;
}
const TopButton = styled(Link)`

	background-color: transparent;
	color: grey;

	font-size: 16px;
	width: 16px;
	height: 18px;

	svg {
		display: block;
	}

	border: none;
	filter: brightness(100%);

	:hover {
		color: ${({ hoverColor }: TopButtonProps) => hoverColor || 'grey'};
		cursor: default;
		filter: brightness(85%);
	}

	:focus {
		outline: 0;
	}

	&:not(:last-child) {
		margin-right: 12px;
	}
`;

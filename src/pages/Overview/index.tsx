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
import { GiTomato } from 'react-icons/gi';
import stand from './stand.gif';

enum Showing {
	All = 'All',
	Events = 'Events',
	Todo = 'Todos',
}



function Overview() : JSX.Element {
	const [showing, setShowing] = React.useState(Showing.All);
	const [events, setEvents] = React.useState<Array<IEvent>>([]);

	const [todaysEvents, setTodaysEvents] = React.useState<Array<IEvent>>([]);

	const [selectedDay, setSelectedDay] = React.useState(new Date());

	const { weekStart, weekEnd } = React.useMemo(() => {
		return {
			weekStart: startOfWeek(selectedDay).toISOString(), 
			weekEnd: endOfWeek(selectedDay).toISOString()
		};
	}, [selectedDay]);

	React.useEffect(() => {
		(async () => {
			const nextEvents : Array<IEvent> = await ipcRenderer.invoke('getEventsForWeek', {
				start: new Date(weekStart), 
				end: new Date(weekEnd)
			});
			console.log(nextEvents);
			// const nextEvents: Array<IEvent> = [];
			nextEvents.sort((eventA, eventB) => {
				if (isBefore(eventA.start, eventB.start)) {
					return -1;
				} else if (isAfter(eventA.start, eventB.start)) {
					return 1;
				}

				return 0;
			});
			setEvents(nextEvents);
		})();
	}, [weekStart, weekEnd]);

	React.useEffect(() => {
		const nextTodaysEvents = events.filter(event => isSameDay(event.start, selectedDay));
		setTodaysEvents(nextTodaysEvents);
	}, [events, selectedDay]);

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
						<TopButton
							to={'/'}
							hoverColor='tomato'
						>
							<GiTomato />
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
				{/* <SectionHeader>
					<Dropdown>
						<select 
							value={showing}
							onChange={(e) => setShowing(e.target.value as Showing)}
						>
							{Object.keys(Showing).map(key => <option key={key} value={key}>{key}</option>)}
						</select>
					</Dropdown>
					<div>
						<IoAdd />
					</div>
				</SectionHeader> */}
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
	/* background-color: #eeeeee; */
	flex: 4;
	display: flex;
	flex-direction: column;
	overflow: overlay;
	padding: 0 20px;
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

	font-size: 16px;
`;

interface TopButtonProps {
	hoverColor?: string;
}
const TopButton = styled(Link)`
	background-color: transparent;
	color: grey;

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



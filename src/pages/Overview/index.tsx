import React from 'react';
import styled from 'styled-components';

const { ipcRenderer } = window.require('electron');

import { IoSettingsSharp } from 'react-icons/io5';
import { FaCircle } from 'react-icons/fa';

import stand from './stand.gif';

import { Event as IEvent } from '../../../electron/services/calendar/calendar';

import WeekCalendar from './WeekCalendar';
import { endOfWeek, format, isSameDay, startOfWeek } from 'date-fns';

/* eslint-disable no-unused-vars */
enum Showing {
	All = 'All',
	Events = 'Events',
	Todo = 'Todos',
}
/* eslint-enable no-unused-vars */

interface EventProps {
	event: IEvent
}

const Event = ({event}: EventProps) => {
	const timeRange = `${format(event.start, 'h:mmaaa')} - ${format(event.end, 'h:mmaaa')}`;

	return (
		<EventContainer>
			<TimeContainer>
				<FaCircle 
					size={8}
					color={event.calendar.color}
				/>
				<Time>
					{timeRange}
				</Time>
			</TimeContainer>
			<EventName>
				{event.name}
			</EventName>

		</EventContainer>
	);
};

const EventContainer = styled.div`
	display: flex;
	flex-direction: column;
	background-color: white;
	padding: 10px;
	margin-bottom: 5px;
	border-radius: 10px;
`;

const TimeContainer = styled.div`
	display: flex;
	align-items: center;
	font-size: 12px;
`;

const Time = styled.span`
	margin-left: 8px;
`;

const EventName = styled.div`
	font-weight: 600;
	margin-top: 4px;
`;

function Overview() {
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
			const nextEvents = await ipcRenderer.invoke('getEventsForWeek', {
				start: new Date(weekStart), 
				end: new Date(weekEnd)
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
		<Container>
			<Top>
				<SettingsButton>
					<IoSettingsSharp
						color="grey"
						style={{ display: 'block', fontSize: 16 }}
					/>
				</SettingsButton>
				<WeekCalendar
					selectedDay={selectedDay}
					onWeekdaySelect={setSelectedDay}
				/>
				<Character>
					<img style={{ width: 100, height: 100 }} src={stand} />
				</Character>
			</Top>
			<Bottom className="scroll-view">
				<SectionHeader>
					<Dropdown>
						<select 
							value={showing}
							onChange={(e) => setShowing(e.target.value as Showing)}
						>
							{Object.keys(Showing).map(key => <option key={key} value={key}>{key}</option>)}
						</select>
					</Dropdown>
				</SectionHeader>
				<Items>
					{todaysEvents.map((event, i) => (
						<Event event={event} key={`${event.name}-${i}`} />
					))}
				</Items>
			</Bottom>
		</Container>
	);
}



export default Overview;

const Container = styled.div`
	background-color: #eeeeee;
	height: 100%;
	width: 100%;
	padding: 20px;
	display: flex;
	flex-direction: column;
`;

const Top = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	background-color: white;
`;

const Bottom = styled.div`
	flex: 4;
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
`;

const Character = styled.div`
	display: flex;
	justify-content: center;
`;

const SectionHeader = styled.div`
	font-size: 12px;
	padding: 15px 20px;
	padding-bottom: 10px;
	color: #b4b4b4;
	display: flex;
	justify-content: space-between;
	align-items: center;

	/* border-bottom: 1px solid grey; */
`;

const Dropdown = styled.div`
  position: relative;
  background-color: #c9c9c9;
  width: auto;
  float: left;
  max-width: 100%;
  border-radius: 8px;

  select {
    font-size: 12px;
    font-weight: 300;
    max-width: 100%;
    padding: 4px 20px 4px 8px;
    border: none;
    background-color: transparent;
    -webkit-appearance: none;
       -moz-appearance: none;
            appearance: none;
    
	&:active,
    &:focus {
      outline: none;
      box-shadow: none;
    }
  }

  &:after {
    content: " ";
    position: absolute;
    top: 50%;
    margin-top: -2px;
    right: 8px;
    width: 0; 
    height: 0; 
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #747474;
  }
`;

const SettingsButton = styled.button`
	position: absolute;
	right: 0;
	top: 13px;
	margin: 15px;

	background-color: transparent;

	border: none;
	filter: brightness(100%);

	:hover {
		filter: brightness(85%);
	}

	:focus {
		outline: 0;
	}
`;

const Items = styled.div`
	padding: 0px 20px;
	display: flex;
	flex-direction: column;
	padding-bottom: 10px;
`;

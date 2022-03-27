import React from 'react';
import { css, CSSProperties, useTheme } from 'styled-components';
import { styled, Theme } from '../../theme';

import { Link } from 'react-router-dom';
import { endOfWeek, startOfWeek } from 'date-fns';
const { ipcRenderer } = window.require('electron');

import WeekCalendar from './WeekCalendar';
import { PageContainer } from '..';
import Timeline from './Timeline';
import LoadingWrapper, { LoadingIndicator } from '../../common/LoadingWrapper';
import Event from './Event';

import { IEvent } from '../../../common/types';

import { IoSettingsSharp } from 'react-icons/io5';
import { BiPlus, BiStopwatch } from 'react-icons/bi';
import stand from './stand.gif';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { dayKeyFormat, addEvents, setEvents, setSelectedDay as setDay } from '../../store/calendar';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';

const localizer = momentLocalizer(moment);

// @ts-ignore
const DnDCalendar = withDragAndDrop(Calendar);

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import CustomDay from './Timeline/CustomDay';

enum Showing {
	All = 'All',
	Events = 'Events',
	Todo = 'Todos',
}

function Overview(): JSX.Element {
	const theme = useTheme() as Theme;

	const events = useAppSelector((state) => state.calendar.events);
	const selectedDay = useAppSelector((state) => state.calendar.selectedDay);
	const dispatch = useAppDispatch();

	const [todaysEvents, setTodaysEvents] = React.useState<IEvent[]>([]);

	const [isLoading, setLoading] = React.useState(true);
	const [isOverlayShowing, setOverlayShowing] = React.useState(false);
	const [event, setEvent] = React.useState<IEvent>();

	const setSelectedDay = (day: Date) => {
		dispatch(setDay({day: new Date(day)}));
	};

	React.useEffect(() => {
		if (!isOverlayShowing) {
			setEvent(undefined);
		}
	}, [isOverlayShowing]);

	React.useEffect(() => {
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

	const onSelectRange = (start: Date | null, end: Date | null, dragComplete = false) => {
		if (!start || !end) {
			setEvent(undefined);
			return;
		}
		
		const nextEvent = {
			start,
			end,
		};
		if (event) {
			setEvent({
				...event,
				...nextEvent,
			});
		} else {
			setEvent({
				...nextEvent,
				name: '',
				calendar: {
					name: '',
					color: theme.color.primary, // TODO: accent
				},
				allDay: false
			});
		}
		setOverlayShowing(dragComplete);
	};

	const onUpdateEvent = (newEvent: IEvent | null, created: boolean) => {
		if (created && newEvent) {
			dispatch(addEvents({events: [newEvent]}));
			setEvent(undefined);
			setOverlayShowing(false);
		} else {
			if (newEvent) {
				setEvent({...event, ...newEvent});
			} else {
				setEvent(undefined);
				setOverlayShowing(false);
			}
		}
	};

	const onSelectEvent = (event: IEvent) => {
		console.log('Clicked!', event);
		setEvent(event);
		setOverlayShowing(true);
	};

	const onEventResize = (data: any) => {
		// resize event and tell gcal
	};

	const onEventDrop = (data: any) => {
		// move event and tell gcal
		console.log(data);
	};

	return (
		<PageContainer>
			<Top>
				<div>
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
								hoverColor='#333'
								style={{
									transition: 'ease-in .1s',
									transform: isOverlayShowing ? 'rotate(45deg) translateZ(0)' : 'none',
									zoom: '1.005',
								}}
								onClick={() => setOverlayShowing(!isOverlayShowing)}
							>
								<BiPlus />
							</TopButton>
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
					{(isOverlayShowing && event) && <Event 
						created={false}
						event={event}
						onUpdateEvent={onUpdateEvent}
					/>}
				</div>
				<Character>
					<img style={{ width: 100, height: 100 }} src={stand} />
				</Character>
			</Top>
			<Bottom>
				<DnDCalendar
					toolbar={false}
					date={selectedDay}
					localizer={localizer}
					//@ts-ignore
					titleAccessor={(event) => event.name}
					events={todaysEvents}
					defaultView={'day'}
					//@ts-ignore
					views={{ day: CustomDay }}
					onEventDrop={onEventDrop}
					onEventResize={onEventResize}
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
	flex-grow: 4;
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
	to?: string;
	children?: React.ReactNode;
	style?: CSSProperties;
	onClick?: () => void;
}
const TopButton: React.FC<TopButtonProps> = ({to, hoverColor, children, style, onClick}: TopButtonProps) => {
	if (to) {
		return (
			<TopButtonLink
				to={to}
				hoverColor={hoverColor}
			>
				{children}
			</TopButtonLink>
		);
	} else {
		return (
			<TopButtonDiv
				style={style}
				onClick={onClick && (() => onClick())}
			>
				{children}
			</TopButtonDiv>
		);
	}
};

const baseButtonStyles = css`
 	background-color: transparent;
	color: grey;
	border: none;
	
	font-size: 16px;
	width: 16px;
	height: 18px;

	svg {
		display: block;
	}

	:hover {
		color: ${({ hoverColor }: TopButtonProps) => hoverColor || 'grey'};
		cursor: default;
		filter: brightness(85%);
	}

	:focus {
		outline: 0;
	}
`;

const TopButtonLink = styled(Link)`
	${baseButtonStyles}

	&:not(:last-child) {
		margin-right: 12px;
	}
`;


const TopButtonDiv = styled.div`
	${baseButtonStyles}

	&:not(:last-child) {
		margin-right: 12px;
	}
`;
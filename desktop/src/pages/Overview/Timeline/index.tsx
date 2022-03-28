import React from 'react';
import styled, { CSSProperties, useTheme } from 'styled-components';
import { format, intervalToDuration, isAfter, isSameDay, isSameMinute } from 'date-fns';

import { IEvent } from '../../../../common/types';
import useDebounce from '../../../hooks/use_debounce';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { EventState, setEvent } from '../../../store/calendar';
import { Theme } from '../../../theme';

const hours = [
	'12 AM',
	'1 AM',
	'2 AM',
	'3 AM',
	'4 AM',
	'5 AM',
	'6 AM',
	'7 AM',
	'8 AM',
	'9 AM',
	'10 AM',
	'11 AM',
	'12 PM',
	'1 PM',
	'2 PM',
	'3 PM',
	'4 PM',
	'5 PM',
	'6 PM',
	'7 PM',
	'8 PM',
	'9 PM',
	'10 PM',
	'11 PM',
	'12 AM'
];

const hourHeight = 48; // px
const totalHeight = hours.length - 1 * hourHeight; // px

interface DateTimeRange {
	start: Date | null;
	end: Date | null;
}
interface MousePositionRange {
	click: number | null;
	current: number | null;
	dragging: boolean;
}
interface Props {
	events: IEvent[];
	date: Date;
}
function Timeline({events, date}: Props): JSX.Element {
	const theme = useTheme() as Theme;

	const dispatch = useAppDispatch();
	const event = useAppSelector((state) => state.calendar.event);
	
	const [scheduledEvents, setScheduledEvents] = React.useState<IEvent[][]>([]);
	const [allDayEvents, setAllDayEvents] = React.useState<IEvent[]>([]);

	/* 
	 * Drag variables
	*/
	const [mousePosition, setMousePosition] = React.useState<MousePositionRange>({
		click: null,
		current: null,
		dragging: false,
	});
	const [selectedRange, setSelectedRange] = React.useState<DateTimeRange>({
		start: null,
		end: null,
	});
	const debouncedSelectedRange = useDebounce(selectedRange, 5);

	React.useEffect(() => {
		const {start, end} = selectedRange;
		const {click, current} = mousePosition;

		if (start && end) {
			// New click
			if (click && !current) {
				setSelectedRange({start: null, end: null});
			}
		}

		// Only mouseDown - no drag yet
		if (!current || !click) {
			return;
		}

		// Both click and current are set

		if (Math.abs(click - current) > 10) {
			const d1 = mouseCoordinateToDate(click);
			const d2 = mouseCoordinateToDate(current);
			if (!d1 || !d2) {
				return;
			}
			setSelectedRange({
				start: click < current ? d1 : d2,
				end: click < current ? d2 : d1
			});
		}
	}, [mousePosition]);

	React.useEffect(() => {
		const {start, end} = debouncedSelectedRange;

		// Clear event
		if (!start || !end) {
			dispatch(setEvent({event: null, state: EventState.none}));
		} else {
			const nextEvent = {
				start,
				end,
				allDay: false
			};

			if (event) {
				dispatch(setEvent({
					event: {
						...event.value,
						...nextEvent,
					},
					state: mousePosition.dragging ? EventState.dragging : EventState.creating
				}));
			} else {
				dispatch(setEvent({
					event: {
						...nextEvent,
						name: '',
						calendar: {
							name: '',
							color: theme.color.primary,
						},
						conference: [],
						url: '',
						id: '',
					},
					state: mousePosition.dragging ? EventState.dragging : EventState.creating
				}));
			}
		}
	}, [debouncedSelectedRange, mousePosition.dragging]);

	React.useEffect(() => {
		setScheduledEvents(groupIntoNonOverlapping((events || []).filter(event => event.allDay == undefined || event.allDay === false)));
		setAllDayEvents((events || []).filter(event => event.allDay));
	}, [events]);

	const lineRef = React.useRef<null | HTMLDivElement>(null);

	const showRedLine = React.useMemo(() => {
		return isSameDay(date, new Date());
	}, [date]);

	React.useEffect(() => {
		if (lineRef.current && showRedLine) {
			// TODO(mufeez): fix scrolling
			lineRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	}, [lineRef, showRedLine]);

	const grid = React.useMemo(() => {
		const res = [];
		
		for (let i = 0; i < hours.length*2 - 2; i++) {
			res.push(<GridBox key={i}/>);
		}

		return res;
	}, []);

	const scheduled = React.useMemo(() => {
		return scheduledEvents.flatMap(group => {
			return group.map((event, i) => {
				const width = 100 / group.length;
				return (
					<Event 
						event={event}
						key={`${event.name}-${i}-${event.start.toISOString()}-${event.end.toISOString()}`}
						style={{
							width: `${width}%`,
							left: `${width * i}%`
						}}
						divided={group.length > 1}
						onClick={() => dispatch(setEvent({event, state: EventState.selected}))}
					/>
				);
			});
		});
	}, [scheduledEvents]);

	const selectedEventRef = React.useRef<null | HTMLDivElement>(null);

	const creating = React.useMemo(() => {
		if (event?.state === EventState.selected) {
			return;
		}

		if (event?.value) {
			return (
				<Event 
					event={event.value}
					zIndex={2}
					ref={selectedEventRef}
				/>
			);
		}
	}, [event]);

	React.useEffect(() => {
		// if (selectedEventRef.current && event?.state === EventState.creating) {
		// 	selectedEventRef.current.scrollIntoView({
		// 		behavior: 'smooth',
		// 		block: 'end'
		// 	});
		// }
	}, [selectedEventRef, event]);

	const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
		// Not a left click
		if (e.button != 0) {
			return;
		}
		setMousePosition({ click: mouseEventToCoordinate(e)[1], current: null, dragging: true });
	};

	const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
		// Not a left click
		if (e.button != 0) {
			return;
		}
		
		if (!mousePosition.dragging) {
			return;
		}

		setMousePosition({click: mousePosition.click, current: mouseEventToCoordinate(e)[1], dragging: true });
	};

	const onMouseUp: React.MouseEventHandler<HTMLDivElement> = (e) => {
		// Not a left click
		if (e.button != 0) {
			return;
		}
		setMousePosition({ click: null, current: null, dragging: false });
	};

	return (
		<Container>
			<AllDay>
				<div>All-day</div>
				<div>
					{allDayEvents.map((event, index) => (
						<Event 
							event={event}
							key={index}
							style={{
								position: 'relative',
							}}
							onClick={() => dispatch(setEvent({event, state: EventState.selected}))}
						/>
					))}
				</div>
			</AllDay>
			<div
				style={{
					position: 'relative',
					display: 'flex',
					flexDirection: 'row',
					marginTop: 40,
				}}
			>
				<Hours>
					{hours.map((hour, index) => <Hour key={index}><span>{hour}</span></Hour>)}
				</Hours>
				<Events
					id={'grid'} // needed for dragging
					draggable={false}
					onMouseDown={onMouseDown}
					onMouseMove={onMouseMove}
					onMouseUp={onMouseUp}
				>
					{grid}
					{creating}
					{scheduled}
				</Events>
				{showRedLine && <CurrentTime ref={lineRef}/>}
			</div>
		</Container>
	);
}

const mouseEventToCoordinate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
	const target = e.target as HTMLDivElement;
	
	let parent = target.parentElement;
	while (parent && parent.id != 'grid') {
		parent = parent.parentElement;
	}
	if (!parent) {
		return [null, null];
	}
	const rect = parent.getBoundingClientRect();

	const x = e.clientX - rect.left;
	const y = e.clientY - rect.top;

	return [x, y];
};

const mouseEventToDate = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
	const y = mouseEventToCoordinate(e)[1];
	return mouseCoordinateToDate(y);
};

const mouseCoordinateToDate = (y: number | null) => {
	if (!y) {
		return;
	}

	let hours = Math.floor(y / hourHeight);
	const minutes = (y / hourHeight - hours) * 60;
	const nearest15 = (Math.round(minutes / 15) * 15) % 60;
	if (minutes > 30 && nearest15 == 0) {
		hours += 1;
	}

	const date = new Date();
	date.setHours(hours, nearest15);
	date.setSeconds(0);
	return date;
};

const Hours = styled.div`
	display: flex;
	flex-direction: column;
`;

const GridBox = styled.div`
	position: relative;
	height: ${hourHeight / 2}px;

	:first-child {
		border-top: 0.5px solid #dbdbdb;
	}

	border-bottom: 0.5px solid #e4e4e4;
	border-right: 1px solid #e4e4e4;
	border-left: 1px solid #e4e4e4;
`;

const AllDay = styled.div`
	display: flex;
	font-size: 10px;
	font-weight: 300;
	color: #646464;
	margin-left: -20px;
	padding-right: 20px;

	width: 100%;

	position: fixed;
	z-index: 3;

	> div {
		background-color: white;

		&:first-child {
			padding: 6px 0;
			padding-left: 20px;
			min-width: 60px;
			border-right: 1px solid #e4e4e4;
			border-bottom: 1px solid #e4e4e4;
		}

		&:nth-child(2) {
			width: 100%;
			border-bottom: 1px solid #e4e4e4;
			border-right: 1px solid #e4e4e4;
			box-sizing: border-box;
		}
	}
`;

const Hour = styled.div`
	height: ${hourHeight}px;
	
	:first-child {
		margin-top: -8px;
	}

	font-size: 10px;
	font-weight: 300;
	width: 40px;
	color: #646464;

	&:last-child {
		height: fit-content;
	}
`;

const Container = styled.div`
	position: relative;
	margin: 0 20px;
	display: flex;
	flex-direction: column;
`;

const Events = styled.div`
	position: relative;
	width: 100%;
`;

// eslint-disable-next-line react/display-name
const CurrentTime = React.forwardRef<HTMLDivElement>((_props, ref) => {
	const [currentTime, setCurrentTime] = React.useState(new Date());
	const [seconds, setSeconds] = React.useState(currentTime.getSeconds());
	
	React.useEffect(() => {
		const interval = setInterval(() => {
			const newTime = new Date();
			if (newTime.getMinutes() != currentTime.getMinutes()) {
				setCurrentTime(newTime);
			}
			if (newTime.getSeconds() > 2) {
				setSeconds(newTime.getSeconds());
			}
		}, (60-seconds) * 1000);
		return () => {
			clearInterval(interval);
		};
	}, [seconds]);

	const time = React.useMemo(() => {
		return format(currentTime, 'h:mm');
	}, [currentTime]);

	const offsetTop = React.useMemo(() => {
		return (currentTime.getHours() + currentTime.getMinutes() / 60) * hourHeight;
	}, [currentTime]);

	return (
		<RedLine
			id='red-line'
			offsetTop={offsetTop}
			ref={ref}
		>
			<span>
				{time}
			</span>
			<hr />
		</RedLine>
	);
});

interface IRedLine {
	offsetTop: number;
}
const RedLine = styled.div<IRedLine>`
	position: absolute;
	top: ${({offsetTop}) => offsetTop - 8}px;
	font-size: 11px;
	width: 100%;
	pointer-events: none;

	span {
		background-color: red;
		color: white;
		padding: 4px 6px;
		border-radius: 8px;
		margin-left: -8px;
	}

	hr {
		border: 1px solid rgba(255,0,0, 0.7);
		margin-top: -8px;
		margin-left: -8px;
	}
`;

interface EventProps {
	event: IEvent;
	style?: CSSProperties;
	divided?: boolean;
	onClick?: () => void;
	zIndex?: number;
}
// eslint-disable-next-line react/display-name
const Event = React.forwardRef<HTMLDivElement, EventProps>(({event, style, divided, zIndex, onClick}, ref) => {
	const offsetStart = !event.allDay ? (event.start.getHours() + event.start.getMinutes() / 60) * hourHeight: 0;
	
	const height = React.useMemo(() => {
		const duration = intervalToDuration({
			start: event.start,
			end: event.end
		});

		if (event.allDay) {
			return 0;
		}

		if (duration.hours != null && duration.minutes != null) {
			return (duration.hours + duration.minutes / 60) * hourHeight;
		}
	}, [event]);

	const [start, end] = React.useMemo(() => {
		const formatTime = (date: Date) => {
			if (date.getMinutes()) {
				return format(date, 'h:mm a');
			} else {
				return format(date, 'h a');
			}
		};
		return [formatTime(event.start), formatTime(event.end)];
	}, [event.start, event.end]);

	return (
		<EventContainer
			zIndex={zIndex || 1}
			offsetStart={offsetStart}
			color={event.calendar.color}
			darkerColor={shadeColor(event.calendar.color, -20)}
			height={height || 'fit-content'}
			style={style}
			divided={divided !== undefined && divided === true}
			onMouseDown={(e) => e.stopPropagation()}
			onClick={onClick}
			ref={ref}
		>
			<div>
				{event.name && <div>
					{event.name}
				</div>}
				{!event.allDay && <Time id='time'>
					{start} - {end}
				</Time>}
			</div>
		</EventContainer>
	);
});

interface IEventContainer {
	offsetStart: number;
	color: string;
	darkerColor: string;
	height: number | string;
	divided: boolean;
	zIndex: number;
}

const EventContainer = styled.div<IEventContainer>`
	display: flex;

	position: absolute;
	background-color: ${({color}) => color};
	opacity: 0.9;
	border-left: 3px solid ${({darkerColor}) => darkerColor};
	width: 100%;
	font-size: 10px;
	font-weight: 500;
	top: ${({offsetStart}) => offsetStart}px;
	z-index: ${({zIndex}) => zIndex};

	border-radius: 4px;
	padding-left: 4px;

	min-height: fit-content !important;
	height: ${({height}) => isNaN(Number(height)) ? height: `${height}px`};

	display: block;
	color: white;

	:hover {
		cursor: default;
		filter: brightness(97%);
	}

	${({ divided, height }) => !divided && height < 10 && `
		align-content: center;
  	`}
	
	> div {
		display: flex;

		${({divided}) => divided ? `
		flex-direction: column;
		`: `
		flex-direction: row;
		`};
	}
`;

const Time = styled.span`
	font-weight: 400;

	&:not(:first-child) {
		margin-left: 4px;
	}
`;

function shadeColor(color: string, percent: number) {
	let R = parseInt(color.substring(1,3),16);
	let G = parseInt(color.substring(3,5),16);
	let B = parseInt(color.substring(5,7),16);

	R = R * (100 + percent) / 100;
	G = G * (100 + percent) / 100;
	B = B * (100 + percent) / 100;

	R |= 0;
	G |= 0;
	B |= 0;

	R = (R<255)?R:255;  
	G = (G<255)?G:255;  
	B = (B<255)?B:255;  

	const RR = ((R.toString(16).length==1)?'0'+R.toString(16):R.toString(16));
	const GG = ((G.toString(16).length==1)?'0'+G.toString(16):G.toString(16));
	const BB = ((B.toString(16).length==1)?'0'+B.toString(16):B.toString(16));

	return '#'+RR+GG+BB;
}

export default Timeline;

function groupIntoNonOverlapping(events?: IEvent[]): IEvent[][] {
	if (!events?.length) {
		return [];
	}

	events.sort(function (a, b) {
		if (a.end < b.end)
			return 1;
		if (a.end > b.end)
			return -1;
		return 0;
	});

	const groups = [];

	const getMaxEnd = (events: IEvent[]) => {
		if (events.length == 0) return false;
		events.sort(function (a, b) {
			if (a.end < b.end)
				return 1;
			if (a.end > b.end)
				return -1;
			return 0;
		});
		return events[0].end;
	};

	let group = 0;
	groups.push([events[0]]);

	for (let i = 1, l = events.length; i < l; i++) {
		if (events[i].start >= events[i - 1].start && 
			events[i].start < getMaxEnd(groups[group])) {
			groups[group].push(events[i]);
		} else {
			group++;
			groups[group] = [events[i]];
		}
	}
	
	for (let i = 0; i < groups.length; i++) {
		groups[i] = groups[i].sort((a, b) => {
			if (isSameMinute(a.start, b.start)) {
				if (isAfter(a.end, b.end)) {
					return -1;
				} else {
					return 1;
				}
				
			} else {
				return a.start.getTime() - b.start.getTime();
			}
		});
	}
	return groups;
}

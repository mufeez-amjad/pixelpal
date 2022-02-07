import React from 'react';
import styled from 'styled-components';
import { format, intervalToDuration, isSameDay, subMinutes } from 'date-fns';
import { FaCircle } from 'react-icons/fa';

import { IEvent } from '../../../../common/types';

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

interface Props {
	events: IEvent[];
	date: Date;
}

function Timeline({events, date}: Props): JSX.Element {
	const myRef = React.useRef<null | HTMLDivElement>(null);

	const showRedLine = React.useMemo(() => {
		return isSameDay(date, new Date());
	}, [date]);

	React.useEffect(() => {
		if (myRef.current && showRedLine) {
			myRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'nearest',
			});
		}
	}, [myRef, showRedLine]);

	const grid = React.useMemo(() => {
		const res = [];
		
		for (let i = 0; i < hours.length*2 - 2; i++) {
			res.push(<GridBox key={i}/>);
		}

		return res;
	}, []);

	return (
		<Container>
			<Hours>
				{hours.map((hour, index) => <Hour key={index}><span>{hour}</span></Hour>)}
			</Hours>
			<Events>
				{grid}
				{events.map((event, i) => (
					<Event event={event} key={`${event.name}-${i}`} />
				))}
			</Events>
			{showRedLine && <CurrentTime ref={myRef}/>}
		</Container>
	);
}

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

const Hour = styled.div`
	height: ${hourHeight}px;
	
	:first-child {
		margin-top: -8px;
	}


	font-size: 10px;
	font-weight: 300;
	padding-right: 10px;
	color: #646464;

	&:last-child {
		height: fit-content;
	}
`;

const Container = styled.div`
	position: relative;
	margin-top: 12px;
	padding: 16px 0;
	margin: 0 20px;
	display: flex;
	flex-direction: row;
`;

const Events = styled.div`
	position: relative;
	flex-grow: 1;
`;

// eslint-disable-next-line react/display-name
const CurrentTime = React.forwardRef<HTMLDivElement>((_props, ref) => {
	const [currentTime, setCurrentTime] = React.useState(new Date());
	
	React.useEffect(() => {
		setTimeout(() => setCurrentTime(new Date()), 60000);
	}, []);

	const time = format(currentTime, 'h:mm');

	const offsetTop = (currentTime.getHours() + currentTime.getMinutes() / 60) * hourHeight;

	return (
		<RedLine
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
	top: ${({offsetTop}) => offsetTop}px;
	font-size: 11px;
	color: red;
	width: 100%;

	span {
		background-color: red;
		color: white;
		padding: 4px 4px;
		border-radius: 8px;
		margin-left: -8px;
	}

	hr {
		border: 1px solid red;
		margin-top: -8px;
		margin-left: 26px;
	}
`;


interface EventProps {
	event: IEvent
}
const Event = ({event}: EventProps): JSX.Element => {
	const offsetStart = (event.start.getHours() + event.start.getMinutes() / 60) * hourHeight;
	
	const height = React.useMemo(() => {
		const duration = intervalToDuration({
			start: event.start,
			end: event.end
		});

		if (duration.hours != null && duration.minutes != null) {
			return Math.max((duration.hours + duration.minutes / 60) * hourHeight, 15);
		}
	}, []);

	return (
		<EventContainer
			offsetStart={offsetStart}
			color={event.calendar.color}
			darkerColor={shadeColor(event.calendar.color, -20)}
			height={height || 'fit-content'}
		>
			<span>
				{event.name}
			</span>
			<span>
				{format(event.start, ', h:mm')}
			</span>
		</EventContainer>
	);
};

interface IEventContainer {
	offsetStart: number;
	color: string;
	darkerColor: string;
	height: number | string;
}

const EventContainer = styled.div<IEventContainer>`
	position: absolute;
	background-color: ${({color}) => color};
	border-left: 3px solid ${({darkerColor}) => darkerColor};
	width: 100%;
	font-size: 12px;
	top: ${({offsetStart}) => offsetStart}px;
	border-radius: 4px;
	padding-left: 4px;
	height: ${({height}) => height}px;
	display: flex;
	color: white;

	:hover {
		cursor: default;
		filter: brightness(97%);
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

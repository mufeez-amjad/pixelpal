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
export default function Timeline({events, date}: Props): JSX.Element {
	const myRef = React.useRef<null | HTMLDivElement>(null);

	React.useEffect(() => {
		if (myRef.current && isSameDay(date, new Date())) {
			myRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
				inline: 'nearest',
			});
		}
	}, [myRef]);

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
			<CurrentTime ref={myRef}/>
		</Container>
	);
}

const Hours = styled.div`
	display: flex;
	flex-direction: column;
	/* background-color: #fd9393; */	
`;

const GridBox = styled.div`
	position: relative;
	height: 24px;
	border-top: 0.5px solid #e4e4e4;
	border-bottom: 0.5px solid #eeeeee;
	border-right: 1px solid #e4e4e4;
`;

const Hour = styled.div`
	height: ${hourHeight}px;
	font-size: 10px;
	font-weight: 300;
	padding-right: 10px;
	border-right: 1px solid #e4e4e4;
	color: #c0bebe;
	&:last-child {
		height: fit-content;
		/* border-right: none; */
	}
`;

const Container = styled.div`
	position: relative;
	padding: 10px 0;
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

	const time = format(currentTime, 'hh:mm');

	const offsetTop = (currentTime.getHours() + currentTime.getMinutes() / 60) * hourHeight;

	return (
		<RedLine
			offsetTop={offsetTop}
			ref={ref}
		>
			<span>
				{time}
			</span>
			{/* <FaCircle 
				size={8}
			/> */}
			
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
			return Math.max((duration.hours + duration.minutes / 60) * hourHeight - 1, 15);
		}
	}, []);

	return (
		<EventContainer
			offsetStart={offsetStart}
			color={event.calendar.color}
			height={height || 'fit-content'}
		>
			<span>
				{event.name}
			</span>
		</EventContainer>
	);
};

interface IEventContainer {
	offsetStart: number;
	color: string;
	height: number | string;
}

const EventContainer = styled.div<IEventContainer>`
	position: absolute;
	background-color: ${({color}) => color};
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

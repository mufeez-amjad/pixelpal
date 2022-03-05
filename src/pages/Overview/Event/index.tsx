import React from 'react';
import styled from 'styled-components';

import { Dropdown, TextArea, TextInput } from '../../../common/input';
import { format, parse, intervalToDuration, formatDuration, addSeconds, isSameDay } from 'date-fns';
import { IEvent } from '../../../../common/types';

import { IoCalendarClearSharp } from 'react-icons/io5';
import { GoCheck } from 'react-icons/go';
import { BiTimeFive } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
interface EventProps {
	event: IEvent;
	onUpdateEvent: (event: IEvent) => void;
}

function Event({event, onUpdateEvent}: EventProps): JSX.Element {
	const [isEvent, setIsEvent] = React.useState(true);
	
	const [range, setRange] = React.useState({
		start: {
			time: '',
			day: '',
			date: new Date(),
			dirty: false
		},
		end: {
			time: '',
			day: '',
			date: new Date(),
			dirty: false
		},
	});

	const [description, setDescription] = React.useState('');
	
	const [errors, setErrors] = React.useState<Record<keyof IEvent, string | null>>({
		name: null,
		start: null,
		end: null,
		allDay: null,
		calendar: null
	});

	React.useEffect(() => {
		const dayFormat = 'EEE MMMM d';
		setRange({
			...range, 
			...(!range.start.dirty && { start: {
				time: format(event.start, 'h:mm aaa'),
				day: format(event.start, dayFormat),
				date: event.start,
				dirty: false
			}}),
			...(!range.end.dirty && { end: {
				time: format(event.end, 'h:mm aaa'),
				day: format(event.end, dayFormat),
				date: event.end,
				dirty: false
			}})
		});
		setErrors({...errors, start: null, end: null});
	}, [event]);

	const duration = React.useMemo(() => {
		const duration = intervalToDuration({
			start: event.start,
			end: addSeconds(event.end, 1)
		});
		return formatDuration(duration, {format: ['hours', 'minutes']}).replace(' hour', 'hr').replace(' minutes', 'm');
	}, [event.start, event.end]);

	React.useEffect(() => {
		if (!range.start.dirty && !range.end.dirty) {
			return;
		}

		const validateDate = (d: string): Date => {
			const date = parse(d, 'h:mm aaa', new Date());
			if (isNaN(date.getTime())) {
				throw Error('invalid time');
			}
			return date;
		};

		let start, end: Date | undefined;

		try {
			start = validateDate(range.start.time);
		} catch (e: unknown) {
			console.log('error!');
			if (e instanceof Error) {
				setErrors({...errors, start: e.message});
			}
		}
		try {
			end = validateDate(range.end.time);
		} catch (e: unknown) {
			console.log('error!');
			if (e instanceof Error) {
				setErrors({...errors, end: e.message});
			}
		}

		console.log(start, end);
		if (start == undefined || end == undefined) {
			return;
		}

		onUpdateEvent({...event, start, end});
	}, [range]);

	return (
		<Container>
			<Form>
				<Row>
					<TextInput 
						value={event.name}
						placeholder='Add title'
						style={{
							flexGrow: 1,
							marginRight: 8
						}}
						onChange={(e) => onUpdateEvent({...event, name: e.target.value }) }
					/>
					<Switch
						toggle={!isEvent}
					>
						<IoCalendarClearSharp 
							onClick={() => setIsEvent(true)}
						/>
						<GoCheck
							fontWeight={700}
							onClick={() => setIsEvent(false)}
						/>
						<div className="slider"></div>
					</Switch>
				</Row>
				<Row
					style={{
						alignItems: 'flex-start',
						flex: 1,
					}}
				>
					<Column
						style={{
							maxWidth: 150
						}}
					>
						<TextInput
							value={range.start.time}
							placeholder=''
							onChange={(e) => setRange({...range, start: {
								...range.start,
								time: e.target.value,
								dirty: true,
							}})}
							error={errors['start']}
							Icon={BiTimeFive}
							iconStyle={{
								fontSize: 16,
							}}
						/>
						<TextInput
							value={range.start.day}
							placeholder=''
							onChange={(e) => setRange({...range, start: {
								...range.start,
								day: e.target.value,
								dirty: true,
							}})}
							error={errors['end']}
							style={{
								marginLeft: 16,
							}}
						/>
					</Column>
					
					<Column
						style={{
							flex: 1
						}}
					>
						<div
							style={{
								display: 'flex',
								alignItems: 'center'
							}}
						>
							<TextInput
								value={range.end.time}
								placeholder=''
								onChange={(e) => setRange({...range, end: {
									...range.end,
									time: e.target.value,
									dirty: true,
								}})}
								Icon={BsArrowRight}
								iconStyle={{
									fontSize: 18,
								}}
								error={errors['end']}
								style={{
									width: 100
								}}
							/>
							<div
								style={{
									flex: 1,
									textAlign: 'center',
									color: '#737373',
									fontSize: 12
								}}
							>
								{duration}
							</div>
						</div>
						{!isSameDay(range.start.date, range.end.date) && <TextInput
							value={range.end.day}
							placeholder=''
							onChange={(e) => setRange({...range, end: {
								...range.end,
								day: e.target.value,
								dirty: true,
							}})}
							error={errors['end']}
						/>}
					</Column>
				</Row>
				<Row>
					<Dropdown />
				</Row>
				<Row>
					<TextArea
						value={description}
						placeholder='Description'
						onChange={(e) => setDescription(e.target.value)}
						style={{
							height: 100,
							width: '100%'
						}}
					/>
				</Row>
			</Form>
		</Container>
	);
}

const Container = styled.div`
	position: absolute;
	background-color: #f3f3f3;
	width: 100%;
	/* height: 50%; */
	z-index: 3;
`;

const Form = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	
	box-sizing: border-box;
`;

const Row = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;

	padding: 8px 12px;

	&:not(:first-child) {
		border-top: 1px solid #e4e4e4;
	}
`;

const Column = styled.div`
	display: flex;
	flex-direction: column;
	align-items: left;
	justify-content: flex-start;
	align-content: flex-start;

	&:not(:first-child) {
		margin-left: 8px;
	}

	> * {
		&:not(:first-child) {
			margin-top: 8px;
		}
	}
`;

interface SwitchProps {
	toggle: boolean;
}
const Switch = styled.div<SwitchProps>`
	position: relative;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;

	flex-grow: 0;

	width: 60px;
	border-radius: 5px;
	background-color: #e0dede;
	padding: 4px 6px;

	.slider {
		top: 0;
		left: 0;
		position: absolute;
		width: 50%;
		height: 100%;
		background-color: #b9b9b9;
		z-index: 0;

		border-radius: 5px;
		/* border-radius: 5px 0 0 5px; */

		-webkit-transition: .3s;
		transition: .3s;

		${({toggle}) => toggle && `
			// border-radius: 0 5px 5px 0;		
			transform: translateX(30px);
		`}
	}

	> svg {
		z-index: 1;
		width: 18px;

		${({toggle}) => toggle ? `
		&:first-child {
			color: #b3b3b3;
		}

		&:not(:first-child) {
			color: white;
		}
		` : `
		&:first-child {
			color: white;
		}

		&:not(:first-child) {
			color: #b3b3b3;
		}
		`};
	}
`;

export default Event;
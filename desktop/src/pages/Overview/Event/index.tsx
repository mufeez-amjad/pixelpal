import React from 'react';
import { styled } from '../../../theme';

const { ipcRenderer } = window.require('electron');

import { Dropdown, DropdownOptions, TextArea, TextInput } from '../../../common/input';
import { format, parse, intervalToDuration, formatDuration, addSeconds, isSameDay } from 'date-fns';
import { ICalendar, IEvent } from '../../../../common/types';

import { IoCalendarClearOutline, IoCalendarClearSharp } from 'react-icons/io5';
import { GoCheck } from 'react-icons/go';
import { BiPencil, BiTimeFive } from 'react-icons/bi';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { BsArrowRight } from 'react-icons/bs';

import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { addEvents, EventState, setCalendars, setEvent } from '../../../store/calendar';
import { Button, ButtonType } from '../../../common/buttons';
import { LinkWithIcon } from '..';
import useKeyboardShortcuts, { KEY_CODE, SHORTCUT } from '../../../hooks/use_keyboard_shortcuts';
interface EventProps {
	event: IEvent;
	created: boolean;
}
function Event({event, created}: EventProps): JSX.Element {
	const dispatch = useAppDispatch();

	const lastShortcut = useKeyboardShortcuts([
		{name: SHORTCUT.ESCAPE, keyCode: KEY_CODE.ESCAPE},
	]);

	// Act on keyboard shortcuts
	React.useEffect(() => {
		switch (lastShortcut) {
		case SHORTCUT.ESCAPE:
			dispatch(setEvent({event: null, state: EventState.none}));
			break;
		}
	}, [lastShortcut]);


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
	const [description, setDescription] = React.useState(event.description);

	const [calendar, setCalendar] = React.useState<ICalendar>(event.calendar);

	const [isLoading, setIsLoading] = React.useState(false);

	const calendars = useAppSelector((state) => state.calendar.calendars);

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
		// setErrors({...errors, start: null, end: null});
		setCalendar(event.calendar);
		setDescription(event.description);
	}, [event]);

	React.useEffect(() => {
		(async () => {
			let nextCalendars: Record<string, ICalendar[]> = {};
			try {
				nextCalendars = await ipcRenderer.invoke('getCalendars');
			} catch (err) {
				console.error(err);
			}
			dispatch(setCalendars({ calendars: nextCalendars }));
		})();
	}, []);

	const duration = React.useMemo(() => {
		const duration = intervalToDuration({
			start: event.start,
			end: addSeconds(event.end, 1)
		});
		return formatDuration(duration, {format: ['hours', 'minutes']}).replace(' hour', 'hr').replace(' minutes', 'm');
	}, [event.start, event.end]);

	const createEvent = async () => {
		setIsLoading(true);
		const newEvent: IEvent = await ipcRenderer.invoke('createEvent', event);
		setIsLoading(false);
		dispatch(addEvents({events: [newEvent]}));
		dispatch(setEvent({event: null, state: EventState.none}));
	};

	const calendarOptions = React.useMemo(() => {
		return Object.entries(calendars).map((entry) => {
			const [name, cals] = entry;
			return {
				subheading: name,
				items: cals.map(cal => ({
					value: cal.name,
					data: cal,
					checkbox: cal.color
				}))
			} as DropdownOptions;
		});
	}, [calendars]);

	const onSelectCalendar = (cal: any) => {
		const newCalendar = cal as ICalendar;
		dispatch(setEvent({event: {...event, calendar: newCalendar}, state: EventState.creating}));
	};

	const handleConferenceClick = (c: IEvent['conference'][number]) => {
		const link = c.entryPoint.find(ep => ep.type == 'video')?.uri;
		if (link) {
			ipcRenderer.invoke('externalLink', link);
		}
	};

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
						autofocus
						onChange={(e) => dispatch(setEvent({event: {...event, name: e.target.value}, state: EventState.creating}))}
					/>
					{!created ? (
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
					) : (
						<div
							style={{
								display: 'flex',
								alignItems: 'center'
							}}
						>
							<LinkWithIcon>
								<BiPencil
									size={16}
								/>
							</LinkWithIcon>
							<LinkWithIcon
								onClick={() => ipcRenderer.invoke('externalLink', event.url)}
							>
								<HiOutlineExternalLink 
									size={16}
								/>
							</LinkWithIcon>
						</div>
					)}
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
							// error={errors['start']}
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
							// error={errors['end']}
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
								// error={errors['end']}
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
							// error={errors['end']}
						/>}
					</Column>
				</Row>
				{(!created || event.conference.length > 0) && <Row>
					{created ? (event.conference.map((c, i) => (
						<ConferencingSolution
							key={`${c.name}-${i}`}
						>
							<div>
								<img src={c.icon} />
								<div
									onClick={() => handleConferenceClick(c)}
								>
									Join {c.name}
								</div>
							</div>
							{/* <div>
								{c.entryPoint.map((ep, j) => (
									<div
										key={`${ep.type}-${j}`}
									>
										<span>{ep.type}</span>
										<span>{ep.uri}</span>
									</div>
								))}
							</div> */}
						</ConferencingSolution>
					))) : (
						<div
							style={{
								display: 'flex',
								alignItems: 'center'
							}}
						>
							<input type="checkbox" />
							<span
								style={{
									marginLeft: 8
								}}
							>Add meeting room</span>
						</div>
					)}
				</Row>}
				<Row>
					<div
						style={{
							flex: 2
						}}
					>
						<Dropdown
							value={calendar.name}
							options={calendarOptions}
							Icon={IoCalendarClearOutline}
							onSelectValue={onSelectCalendar}
						/>
					</div>
				</Row>
				<Row
					style={{ height: 64 }}
				>
					<TextArea
						value={description}
						placeholder='Description'
						onChange={(e) => setDescription(e.target.value)}
						resizable={false}
						style={{
							minWidth: '100%',
							maxWidth: '100%'
						}}
					/>
				</Row>
			</Form>
			{!created && <Row
				style={{
					justifyContent: 'flex-end',
				}}
			>
				<Button
					text='Cancel'
					type={ButtonType.Default}
					onClick={() => dispatch(setEvent({event: null, state: EventState.none}))}
				/>
				<Button
					text='Save'
					type={ButtonType.Primary}
					onClick={createEvent}
					loading={isLoading}
				/>
			</Row>}
		</Container>
	);
}

const Container = styled.div`
	position: absolute;
	background-color: #f3f3f3;
	width: 100%;
	max-height: 350px;
	overflow: overlay;
	/* overflow-y: scroll; */
	z-index: 1000;

	--scrollbar-color: #00000040 !important; // always show scrollbar
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

	&:not(:last-child) {
		border-bottom: 1px solid #e4e4e4;
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
	background-color: ${({theme}) => theme.color.lighterGrey};
	padding: 4px 6px;

	.slider {
		top: 0;
		left: 0;
		position: absolute;
		width: 50%;
		height: 100%;
		background-color: ${({theme}) => theme.color.midGrey};
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

		${({toggle, theme}) => toggle ? `
		&:first-child {
			color: ${theme.color.midGrey};
		}

		&:not(:first-child) {
			color: white;
		}
		` : `
		&:first-child {
			color: white;
		}

		&:not(:first-child) {
			color: ${theme.color.midGrey};
		}
		`};
	}
`;

const ConferencingSolution = styled.div`
	img {
		width: 18px;
		height: 18px;
	}

	> div:first-child {
		display: flex;
		align-items: center;
		
		div {
			color: white;
			margin-left: 8px;

			padding: 6px 12px;
			background-color: #1a73e8;
			border-radius: 8px;
		}
	}
`;

export default Event;
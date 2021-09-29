import React, { useState } from 'react';
import {
	FormGroup,
	InputGroup,
	RangeSlider,
	Slider,
	Button,
	ButtonGroup
} from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

const { ipcRenderer } = window.require('electron');

import { IoCloseCircleOutline } from 'react-icons/io5';

function ReminderForm() {
	const history = useHistory();

	const [timeSliderState, setTimeSliderState] = useState([6, 18]);
	const [nameState, setNameState] = useState({ target: { value: '' } });
	const [frequencyState, setFrequencyState] = useState(3);
	const [daysState, setDaysState] = useState({});

	const frequencyLabels = [
		'5 minutes',
		'10 minutes',
		'30 minutes',
		'1 hour',
		'2 hours',
		'4 hours',
		'6 hours',
		'12 hours',
		'1 day'
	];

	const dayChars = {
		Mo: 'M',
		Tu: 'T',
		We: 'W',
		Th: 'R',
		Fr: 'F',
		Sa: 'S',
		Su: 'U'
	};
	const frequencies = [5, 10, 30, 60, 120, 240, 360, 720, 1440];

	const renderLabel = val => {
		return val > 9 ? `${val}:00` : `0${val}:00`;
	};

	const renderFrequencyLabel = val => {
		return frequencyLabels[val];
	};

	const buildDayString = () => {
		let s = '';
		for (const day in daysState) {
			if (daysState[day]) s += dayChars[day];
		}
		return s;
	};

	const handleDaysButtonClick = e => {
		const button = e.target.textContent;
		const state = {
			...daysState,
			[button]: !daysState[button]
		};

		setDaysState(state);
	};

	const submitHabit = () => {
		const habit = {
			name: nameState.target.value,
			start_time: timeSliderState[0],
			end_time: timeSliderState[1],
			frequency: frequencies[frequencyState],
			days: buildDayString()
		};

		if (habit.name && habit.days && habit.frequency) {
			ipcRenderer.invoke('insertHabit', habit);
			history.push('/');
		}
	};

	return (
		<div style={{ padding: '1em', width: '460px' }}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					marginBottom: '20px'
				}}
			>
				<CircleButton
					style={{ marginRight: '10px' }}
					onClick={() => history.push('/')}
				>
					<IoCloseCircleOutline
						color="black"
						style={{ display: 'block' }}
						fontSize={18}
					/>
				</CircleButton>
				<div
					style={{
						fontSize: '20px',
						fontWeight: '800',
						marginTop: '10px',
						marginBottom: '10px'
					}}
				>
					Create habit
				</div>
			</div>

			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<FormGroup label="Name" labelFor="habit-name">
					<InputGroup
						id="habit-name"
						placeholder="Drink water"
						onChange={setNameState}
					/>
				</FormGroup>
				<FormGroup
					label="Days"
					labelFor="day-buttons"
					style={{ marginLeft: '20px' }}
				>
					<ButtonGroup minimal={true}>
						<Button
							active={daysState.Mo}
							onClick={handleDaysButtonClick}
						>
							Mo
						</Button>
						<Button
							active={daysState.Tu}
							onClick={handleDaysButtonClick}
						>
							Tu
						</Button>
						<Button
							active={daysState.We}
							onClick={handleDaysButtonClick}
						>
							We
						</Button>
						<Button
							active={daysState.Th}
							onClick={handleDaysButtonClick}
						>
							Th
						</Button>
						<Button
							active={daysState.Fr}
							onClick={handleDaysButtonClick}
						>
							Fr
						</Button>
						<Button
							active={daysState.Sa}
							onClick={handleDaysButtonClick}
						>
							Sa
						</Button>
						<Button
							active={daysState.Su}
							onClick={handleDaysButtonClick}
						>
							Su
						</Button>
					</ButtonGroup>
				</FormGroup>
			</div>

			<FormGroup label="Time Window" labelFor="habit-window">
				<RangeSlider
					id="habit-window"
					min={0}
					max={24}
					stepSize={1}
					labelStepSize={6}
					value={timeSliderState}
					labelRenderer={renderLabel}
					onChange={setTimeSliderState}
				/>
			</FormGroup>
			<FormGroup label="Frequency" labelFor="habit-frequency">
				<Slider
					id="habit-frequency"
					min={0}
					max={8}
					stepSize={1}
					labelValues={frequencyLabels}
					value={frequencyState}
					labelRenderer={renderFrequencyLabel}
					onChange={setFrequencyState}
				/>
			</FormGroup>
			<FormGroup labelFor="submit-button">
				<Button
					type="submit"
					text="Add Habit"
					intent="success"
					onClick={submitHabit}
				/>
			</FormGroup>
		</div>
	);
}

export default ReminderForm;

const CircleButton = styled.div`
	background-color: ${({ backgroundColor }) =>
		backgroundColor ? backgroundColor : 'white'};
	border-radius: 20px;
	padding: 10px;
	height: fit-content;
	width: fit-content;

	border: none;
	cursor: default;

	a {
		cursor: default;
		padding: 0;
		margin: 0;
	}

	text-decoration: none;
	&:focus,
	&:hover,
	&:visited,
	&:link,
	&:active {
		text-decoration: none;
	}

	filter: brightness(100%);

	:hover {
		filter: brightness(85%);
	}

	:focus {
		outline: 0;
	}
`;

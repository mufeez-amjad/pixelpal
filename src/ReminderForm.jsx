import React, { useState } from 'react';
import {
	FormGroup,
	InputGroup,
	RangeSlider,
	Slider,
	Button,
	ButtonGroup
} from '@blueprintjs/core';

import { Link } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function ReminderForm() {
	const [timeSliderState, setTimeSliderState] = useState([6, 18]);
	const [nameState, setNameState] = useState({ target: { value: '' } });
	const [frequencyState, setFrequencyState] = useState(3);
	const [daysState, setDaysState] = useState({
		Mo: true,
		Tu: true,
		We: true,
		Th: true,
		Fr: true,
		Sa: true,
		Su: true
	});

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
			startTime: timeSliderState[0],
			endTime: timeSliderState[1],
			frequency: frequencies[frequencyState],
			days: buildDayString()
		};

		ipcRenderer.invoke('insertHabit', habit);
	};

	return (
		<div
			style={{
				padding: 30,
				height: '100%',
				width: '100%',
				margin: 0
			}}
		>
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
					style={{ marginLeft: 'auto' }}
				>
					<ButtonGroup minimal={true}>
						{Object.keys(daysState).map(day => (
							<Button
								key={day}
								active={daysState[day]}
								style={{
									borderRadius: '50%',
									marginRight: 5,
									width: 10
								}}
								onClick={handleDaysButtonClick}
							>
								{day}
							</Button>
						))}
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
				<Link to="/">
					<Button
						type="submit"
						text="Add Habit"
						intent="success"
						onClick={submitHabit}
					/>
				</Link>
			</FormGroup>
		</div>
	);
}

export default ReminderForm;

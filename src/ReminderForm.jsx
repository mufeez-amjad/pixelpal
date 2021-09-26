import React, { useState } from 'react';
import {
	FormGroup,
	InputGroup,
	RangeSlider,
	Slider,
	Button,
	ButtonGroup
} from '@blueprintjs/core';
import '../node_modules/@blueprintjs/core/lib/css/blueprint.css';
const { ipcRenderer } = window.require('electron');

function ReminderForm() {
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
			startTime: timeSliderState[0],
			endTime: timeSliderState[1],
			frequency: frequencies[frequencyState],
			days: buildDayString()
		};

		ipcRenderer.invoke('insertHabit', habit);
	};

	return (
		<div style={{ margin: '1em' }}>
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

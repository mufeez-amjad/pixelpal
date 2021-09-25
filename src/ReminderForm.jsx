import React from 'react';
import { FormGroup, InputGroup, Slider } from '@blueprintjs/core';
import '../node_modules/@blueprintjs/core/lib/css/blueprint.css';
// const { ipcRenderer } = window.require('electron');

// function test() {
// 	const habit = {
// 		name: 'testHabit',
// 		interval: 5,
// 		days: 'MWF'
// 	};
// 	ipcRenderer.invoke('insertHabit', habit);
// 	ipcRenderer.invoke('getHabits');
// }

class ReminderForm extends React.Component {
	constructor() {
		super();
		this.state = { interval: 5 };
		this.handleChange = this.handleChange.bind(this);
	}

	render() {
		return (
			<div>
				<FormGroup
					label="Add new Habit"
					labelFor="text-input"
					labelInfo="(required)"
				>
					<InputGroup id="text-input" placeholder="Drink water" />
					<Slider
						min={0}
						max={10}
						stepSize={0.1}
						labelStepSize={10}
						value={this.state.interval}
						onChange={value => this.setState({ interval: value })}
					/>
				</FormGroup>
			</div>
		);
	}
}

export default ReminderForm;

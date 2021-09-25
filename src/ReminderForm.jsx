import React from 'react';
import { Link } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function test() {
	const habit = {
		name: 'testHabit',
		interval: 5,
		days: 'MWF'
	};
	ipcRenderer.invoke('insertHabit', habit);
	ipcRenderer.invoke('getHabits');
}

function ReminderForm() {
	return (
		<div>
			<Link to="/">
				<button onClick={test}>Submit</button>
			</Link>
		</div>
	);
}

export default ReminderForm;

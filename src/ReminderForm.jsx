import React from 'react';
import { Link } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function test() {
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

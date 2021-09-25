import React from 'react';
import { Link } from 'react-router-dom';
const { ipcRenderer } = window.require('electron');

function test() {
	ipcRenderer.invoke('t', 'hello').then(() => {
		console.log('got response');
	});
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

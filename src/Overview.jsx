import React from 'react';
import { Link } from 'react-router-dom';

function Overview() {
	return (
		<div>
			<Link to="/reminderform">
				<button>Add Reminder</button>
			</Link>
		</div>
	);
}

export default Overview;

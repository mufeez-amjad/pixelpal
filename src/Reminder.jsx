import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './Reminder.css';

function Reminder(props) {
	var percentage;
	if (!props.addReminder) {
		percentage = (props.done / props.total) * 100 + '%';
		console.log(percentage);
	}
	return props.addReminder ? (
		<Link to="/reminderform" style={{ textDecoration: 'none' }}>
			<div
				className="card"
				style={{ borderRadius: 25, marginBottom: 15, padding: 8 }}
			>
				<a
					className="card-block stretched-link text-decoration-none"
					style={{ color: 'black' }}
				>
					<b>Add Reminder</b>
				</a>
			</div>
		</Link>
	) : (
		<div
			className="card"
			style={{ borderRadius: 25, marginBottom: 15, padding: 8 }}
		>
			<div className="row">
				<div className="col-8">{props.text}</div>
				<div className="col-4">
					{props.done} / {props.total}
				</div>
			</div>
		</div>
	);
}

Reminder.propTypes = {
	addReminder: PropTypes.bool,
	text: PropTypes.string,
	done: PropTypes.number,
	total: PropTypes.number
};

export default Reminder;

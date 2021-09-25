import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Intent, ProgressBar } from '@blueprintjs/core';

function Reminder(props) {
	var reminderStyle = {
		borderRadius: 50,
		marginBottom: 15,
		padding: 15
	};

	return props.addReminder ? (
		<Link to="/reminderform" style={{ textDecoration: 'none' }}>
			<div className="card" style={reminderStyle}>
				<a
					className="card-block stretched-link text-decoration-none"
					style={{ color: 'black' }}
				>
					<b>Add Reminder</b>
				</a>
			</div>
		</Link>
	) : (
		<div className="card" style={reminderStyle}>
			<div className="row">
				<div className="col-8">{props.text}</div>
				<div className="col-4">
					{props.done} / {props.total}
				</div>
			</div>
			<ProgressBar
				value={props.done / props.total}
				intent={Intent.SUCCESS}
			/>
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

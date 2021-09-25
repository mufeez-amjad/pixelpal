import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function Reminder(props) {
	var reminderStyle = {
		borderRadius: 50,
		marginTop: 20,
		marginBottom: 20,
		padding: 15
	};

	var percentage;
	if (!props.addReminder) {
		percentage = (props.done / props.total) * 100 + '%';
	}

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
			<div className="row" style={{ marginBottom: 5 }}>
				<div className="col-8">
					<h6>{props.text}</h6>
				</div>
				<div className="col-4 text-end">
					<h6>
						{props.done} / {props.total}
					</h6>
				</div>
			</div>
			<div className="bp3-progress-bar bp3-intent-success .modifier">
				<div
					className="bp3-progress-meter"
					style={{ width: percentage }}
				></div>
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

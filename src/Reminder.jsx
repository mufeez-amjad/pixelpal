import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Intent, ProgressBar, Card, Button } from '@blueprintjs/core';

function Reminder(props) {
	const [hover, setHover] = useState(false);
	var reminderStyle = {
		marginTop: 20,
		marginBottom: 20,
		padding: 15
	};

	return props.addReminder ? (
		<Link
			to="/reminderform"
			style={{
				textDecoration: 'none',
				color: 'black',
				textAlign: 'center'
			}}
		>
			<Card style={reminderStyle}>
				<b>Add Reminder</b>
			</Card>
		</Link>
	) : (
		<Card
			style={reminderStyle}
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			<div className="row" style={{ marginBottom: 5 }}>
				<div
					className="col-8"
					style={{ display: 'flex', flexDirection: 'row' }}
				>
					<h6>{props.name}</h6>
					{hover ? (
						<Button
							style={{ height: 5, width: 10 }}
							small={true}
							minimal={true}
							className="col-3"
							icon="delete"
							onClick={() => props.handleDelete(props.id)}
						></Button>
					) : null}
				</div>
				<div className="col-4 text-end">
					<div className="row">
						<h6>
							{props.done} / {props.total}
						</h6>
					</div>
				</div>
			</div>
			<ProgressBar
				stripes={false}
				value={props.done / props.total}
				intent={Intent.SUCCESS}
			/>
		</Card>
	);
}

Reminder.propTypes = {
	addReminder: PropTypes.bool,
	name: PropTypes.string,
	done: PropTypes.number,
	total: PropTypes.number,
	id: PropTypes.number,
	handleDelete: PropTypes.func
};

export default Reminder;

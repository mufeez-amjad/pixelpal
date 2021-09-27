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
			<div style={{ display: 'flex', flexDirection: 'row' }}>
				<div
					style={{
						width: '80%',
						display: 'flex',
						flexDirection: 'row'
					}}
				>
					<p style={{ fontSize: 18 }}>{props.name}</p>

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
				<div style={{ width: '20%', textAlign: 'right' }}>
					<p style={{ fontSize: 18 }}>
						{props.done} / {props.total}
					</p>
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

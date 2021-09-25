import React from 'react';

import Reminder from './Reminder';

function Overview() {
	var reminders = [
		{
			text: 'Drink Water',
			done: 5,
			total: 8
		},
		{
			text: 'Stretch',
			done: 2,
			total: 16
		},
		{
			text: 'Go Running',
			done: 1,
			total: 2
		}
	];

	var missed = {
		// text: 'Breathe',
		// time: '2pm'
	};

	return (
		<div
			className="container"
			style={{ padding: 20, height: '100%', width: '100%', margin: 0 }}
		>
			<h1 className="row" style={{ marginBottom: 20, marginLeft: 0 }}>
				<b>Overview</b>
			</h1>
			{missed && Object.keys(missed).length !== 0 ? (
				<div
					className="row"
					style={{
						display: 'flex',
						verticalAlign: 'middle',
						paddingRight: 20,
						paddingLeft: 20,
						marginBottom: 20,
						background: '#e3bfb9',
						paddingTop: 5,
						paddingBottom: 5,
						borderRadius: 25
					}}
				>
					<p className="col-7">
						<b>Missed:</b> {missed.text} at {missed.time}
					</p>
					<button
						className="col-2 btn-sm btn-primary"
						style={{ marginRight: 10 }}
					>
						Done
					</button>
					<button className="col-2 btn-sm btn-secondary">
						Dismiss
					</button>
				</div>
			) : (
				<div
					className="row"
					style={{
						marginLeft: 0,
						display: 'flex',
						verticalAlign: 'middle',
						paddingRight: 20,
						paddingLeft: 20,
						marginBottom: 20,
						background: '#c8e3b9',
						paddingTop: 5,
						paddingBottom: 5,
						borderRadius: 25
					}}
				>
					<p>
						<b>Up Next:</b> Drink Water in 5min
					</p>
				</div>
			)}
			<div
				className="row"
				style={{ marginLeft: 0, height: '88%', marginBottom: 30 }}
			>
				<div
					className="col-8"
					style={{
						background: '#b9dde3',
						borderRadius: 25,
						paddingLeft: 15,
						paddingRight: 15,
						marginBottom: 50,
						verticalAlign: 'middle'
					}}
				>
					{reminders.map(function (reminder, i) {
						return (
							<Reminder
								key={i}
								addReminder={false}
								text={reminder.text}
								done={reminder.done}
								total={reminder.total}
							/>
						);
					})}
					{reminders.length < 5 ? (
						<Reminder addReminder={true} />
					) : null}
				</div>
				<div className="col-4 align-bottom">
					<img
						src="https://i.pinimg.com/236x/33/24/0b/33240b660976088a4e43f8a0b620f966.jpg"
						width="200"
						height="200"
						style={{ verticalAlign: 'bottom' }}
					/>
				</div>
			</div>
		</div>
	);
}

export default Overview;

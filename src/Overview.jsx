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

	return (
		<div className="container">
			<h1>Overview</h1>
			<div className="row">
				<div className="col-6">
					<p>Up Next: Drink Water in 5min</p>
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
				<div className="col-6">
					<img src="https://i.pinimg.com/236x/33/24/0b/33240b660976088a4e43f8a0b620f966.jpg" />
				</div>
			</div>
		</div>
	);
}

export default Overview;

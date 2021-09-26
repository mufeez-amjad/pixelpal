import React from 'react';
import { Intent, Callout, Button } from '@blueprintjs/core';

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
		},
		{
			text: 'Go Running',
			done: 1,
			total: 2
		},
		{
			text: 'Go Running',
			done: 1,
			total: 2
		},
		{
			text: 'Go Running',
			done: 1,
			total: 2
		}
	];

	var missed = {
		text: 'Breathe',
		time: '2pm'
	};

	return (
		<div style={{ padding: 20, height: '100%', width: '100%', margin: 0 }}>
			<h1 className="row" style={{ marginBottom: 20, marginLeft: 0 }}>
				<b>Overview</b>
			</h1>
			{missed && Object.keys(missed).length !== 0 ? (
				<Callout
					intent={Intent.WARNING}
					style={{
						height: 40,
						marginBottom: 20
					}}
				>
					<div className="row">
						<div className="col-8">
							<p className="col-7">
								<b>Missed:</b> {missed.text} at {missed.time}
							</p>
						</div>
						<div className="col-4 text-end">
							<Button
								className="col-2"
								small={true}
								intent={Intent.SUCCESS}
								style={{
									marginRight: 10,
									height: 20,
									width: 50,
									fontSize: '90%'
								}}
							>
								Done
							</Button>
							<Button
								className="col-2"
								small={true}
								style={{
									height: 20,
									width: 60,
									fontSize: '90%'
								}}
							>
								Dismiss
							</Button>
						</div>
					</div>
				</Callout>
			) : (
				<Callout
					intent={Intent.PRIMARY}
					style={{
						height: 40,
						marginBottom: 20
					}}
				>
					<p>
						<b>Up Next:</b> Drink Water in 5min
					</p>
				</Callout>
			)}
			<div
				className="row"
				style={{ marginLeft: 0, height: '88%', marginBottom: 30 }}
			>
				<div
					className="col-7"
					style={{
						background: '#e7e8ec',
						borderRadius: 5,
						paddingLeft: 15,
						paddingRight: 15,
						marginBottom: 50,
						verticalAlign: 'middle',
						overflow: 'hidden'
					}}
				>
					<div
						className="scrollView"
						style={{
							overflowY: 'scroll',
							height: 300
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
					</div>
					<Reminder addReminder={true} />
				</div>
				<div className="col-5" style={{ position: 'relative' }}>
					<img
						src="https://www.pngkit.com/png/full/349-3491696_hamtaro-cute-food-pixel-art.png"
						width="250"
						height="250"
						style={{ position: 'absolute', bottom: 50 }}
					/>
				</div>
			</div>
		</div>
	);
}

export default Overview;

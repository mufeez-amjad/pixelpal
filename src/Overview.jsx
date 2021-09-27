import React from 'react';
import { Intent, Callout, Button } from '@blueprintjs/core';
const { ipcRenderer } = window.require('electron');

import Reminder from './Reminder';

function Overview() {
	var missed = {
		name: 'Breathe',
		time: '2pm'
	};

	const [habits, setHabits] = React.useState(null);

	const getCurrentDay = () => {
		const dayOfWeek = new Date().getDay();
		const days = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];
		return days[dayOfWeek];
	};

	React.useEffect(async () => {
		let rawHabits = await ipcRenderer.invoke(
			'getHabitsForDay',
			getCurrentDay()
		);
		rawHabits.map(rh => {
			rh['done'] = 5;
			rh['total'] = 6;
		});
		setHabits(rawHabits);
	}, []);

	const handleDelete = id => {
		ipcRenderer.invoke('deleteHabit', id);
		const nextHabits = habits.filter(h => h.id != id);
		setHabits(nextHabits);
	};

	return (
		<div
			style={{
				paddingLeft: 20,
				paddingRight: 20,
				height: '100%',
				width: '100%',
				margin: 0
			}}
		>
			<h1
				style={{
					display: 'flex',
					flexDirection: 'row',
					marginBottom: 20,
					marginLeft: 0
				}}
			>
				Overview
			</h1>
			{missed && Object.keys(missed).length !== 0 ? (
				<Callout
					intent={Intent.WARNING}
					style={{
						height: 40,
						marginBottom: 20
					}}
				>
					<div style={{ display: 'flex', flexDirection: 'row' }}>
						<div style={{ width: '67%' }}>
							<p className="col-7">
								<b>Missed:</b> {missed.name} at {missed.time}
							</p>
						</div>
						<div style={{ textAlign: 'right', width: '33%' }}>
							<Button
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
				style={{
					display: 'flex',
					flexDirection: 'row',
					marginLeft: 0,
					height: '80%',
					marginBottom: 30
				}}
			>
				<div
					style={{
						background: '#e7e8ec',
						borderRadius: 5,
						paddingLeft: 15,
						paddingRight: 15,
						marginBottom: 50,
						verticalAlign: 'middle',
						overflow: 'hidden',
						width: '60%'
					}}
				>
					<div
						className="scrollView"
						style={{
							overflowY: 'scroll',
							height: 300
						}}
					>
						{habits &&
							habits.map(function (habit, i) {
								console.log(habit);
								return (
									<Reminder
										key={i}
										id={habit.id}
										addReminder={false}
										name={habit ? habit.name : 'Hello'}
										done={habit.done}
										total={habit.total}
										handleDelete={handleDelete}
									/>
								);
							})}
					</div>
					<Reminder addReminder={true} />
				</div>
				<div style={{ position: 'relative', width: '40%' }}>
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

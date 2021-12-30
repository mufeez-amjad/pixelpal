import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

import { FaPlus } from 'react-icons/fa';
import { ImPencil } from 'react-icons/im';
import { IoCloseCircleOutline, IoSettingsSharp } from 'react-icons/io5';

import stand from './stand.gif';

import Habit, { IHabit } from './Habit';
import WeekCalendar from './WeekCalendar';

function Overview() {
	const [habits, setHabits] = React.useState<Array<IHabit>>([]);

	const [selectedDay, setSelectedDay] = React.useState(new Date());

	const [isEditing, setIsEditing] = React.useState(false);

	const currentDayChar = () => {
		const dayOfWeek = selectedDay.getDay();
		const days = ['U', 'M', 'T', 'W', 'R', 'F', 'S'];
		return days[dayOfWeek];
	};

	const updateHabitCounts = async () => {
		let rawHabits = await ipcRenderer.invoke(
			'getHabitsForDay',
			currentDayChar()
		);

		// let habitEventCounts = await ipcRenderer.invoke(
		// 	'getHabitEventCountsForDay',
		// 	currentDayChar()
		// );

		// rawHabits.map((rh: IHabit) => {
		// 	// todo: replace with non ugly code
		// 	rh.done = habitEventCounts.find(
		// 		e => e.habit_id == rh.id
		// 	).completed;
		// 	rh.total = habitEventCounts.find(e => e.habit_id == rh.id).total;
		// });

		setHabits(rawHabits);
	};

	ipcRenderer.on(
		'overview:update-habit-counts',
		async () => await updateHabitCounts()
	);

	React.useEffect(() => {
		function handleWindowShow() {
			setSelectedDay(new Date());
		}
		ipcRenderer.on('hide-tray-window', handleWindowShow);
		return () => ipcRenderer.removeListener('hide-tray-window', handleWindowShow);
	}, []);

	React.useEffect(() => {
		(async () => {
			await updateHabitCounts();
		});
	}, []);

	const handleDelete = (id: number) => {
		ipcRenderer.invoke('deleteHabit', id);
		const nextHabits = habits.filter(h => h.id != id);
		setHabits(nextHabits);
	};

	return (
		<Container>
			<Top>
				<SettingsButton>
					<IoSettingsSharp
						color="grey"
						style={{ display: 'block', fontSize: 16 }}
					/>
				</SettingsButton>
				<WeekCalendar
					selectedDay={selectedDay}
					onWeekdaySelect={setSelectedDay}
				/>
				<Character>
					<img style={{ width: 100, height: 100 }} src={stand} />
				</Character>
			</Top>
			<Bottom className="scroll-view">
				<SectionHeader>
					<span style={{ marginLeft: 10 }}>Today's Habits</span>
					<HeaderButtons>
						<CircleButton
							backgroundColor={isEditing ? '#d4d4d4' : 'white'}
							style={{ marginRight: '5px' }}
							onClick={() =>
								setIsEditing(!isEditing && habits.length > 0)
							}
						>
							<ImPencil
								color="black"
								style={{ display: 'block' }}
							/>
						</CircleButton>
						<Link to={'/'}>
							<CircleButton>
								<FaPlus
									color="black"
									style={{ display: 'block' }}
								/>
							</CircleButton>
						</Link>
					</HeaderButtons>
				</SectionHeader>
				<Habits className="scroll-view">
					{habits.length != 0 ? (
						habits.map((habit, i) => (
							<div
								key={i}
								style={{
									display: 'flex',
									width: '100%',
									padding: 0,
									margin: 0,
									alignItems: 'center'
								}}
							>
								<Habit key={i} habit={habit} />
								{isEditing && (
									<CircleButton
										style={{ marginRight: '5px' }}
										onClick={() => handleDelete(habit.id)}
									>
										<IoCloseCircleOutline
											color="black"
											style={{ display: 'block' }}
										/>
									</CircleButton>
								)}
							</div>
						))
					) : (
						<div>You have no habits, create one!</div>
					)}
				</Habits>
			</Bottom>
		</Container>
	);
}

export default Overview;

const Container = styled.div`
	background-color: #eeeeee;
	height: 100%;
	width: 100%;
	padding: 20px;
	display: flex;
	flex-direction: column;
`;

const Top = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	background-color: white;
`;

const Bottom = styled.div`
	flex: 4;
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
`;

const Character = styled.div`
	display: flex;
	justify-content: center;
`;

const SectionHeader = styled.div`
	font-size: 12px;
	padding: 10px;
	color: #b4b4b4;
	display: flex;
	justify-content: space-between;
	align-items: center;

	/* border-bottom: 1px solid grey; */
`;

const HeaderButtons = styled.div`
	display: flex;
	margin-right: 10px;
`;

const SettingsButton = styled.button`
	position: absolute;
	right: 0;
	top: 13px;
	margin: 15px;

	background-color: transparent;

	border: none;
	filter: brightness(100%);

	:hover {
		filter: brightness(85%);
	}

	:focus {
		outline: 0;
	}
`;

interface CircleButtonProps {
	backgroundColor?: string;
}
const CircleButton = styled.div<CircleButtonProps>`
	background-color: ${({ backgroundColor }) =>
		backgroundColor ? backgroundColor : 'white'};
	border-radius: 20px;
	padding: 10px;
	height: fit-content;

	border: none;
	cursor: default;

	a {
		cursor: default;
		padding: 0;
		margin: 0;
	}

	text-decoration: none;
	&:focus,
	&:hover,
	&:visited,
	&:link,
	&:active {
		text-decoration: none;
	}

	filter: brightness(100%);

	:hover {
		filter: brightness(85%);
	}

	:focus {
		outline: 0;
	}
`;

const Habits = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow-y: scroll;
	height: 100%;
	padding: 5px;
`;

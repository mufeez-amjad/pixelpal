import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

import { FaPlus } from 'react-icons/fa';
import { IoMenu } from 'react-icons/io5';
import { ImPencil } from 'react-icons/im';
import { IoCloseCircleOutline } from 'react-icons/io5';

import stand from './stand.gif';
import Habit from './Habit';
import Banner from './Banner';
import SurveyBanner from './SurveyBanner';

function Overview() {
	const [habits, setHabits] = React.useState([]);
	const [banner] = React.useState(null);

	const [completedMP1Survey, setCompletedMP1Survey] = React.useState(false);
	const mp1UserSurvey = 'mp1_user_survey';
	const mp1SurveyThreshold = 1;

	const [total, setTotal] = React.useState();

	const [isEditing, setIsEditing] = React.useState(false);

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

	React.useEffect(async () => {
		let getUserSurvey = await ipcRenderer.invoke(
			'getSurvey',
			mp1UserSurvey
		);

		if (getUserSurvey.length === 0) {
			await ipcRenderer.invoke('insertSurvey', mp1UserSurvey);
		} else if (getUserSurvey[0].completed) {
			setCompletedMP1Survey(true);
		}
	}, []);

	// const handleDelete = id => {
	// 	ipcRenderer.invoke('deleteHabit', id);
	// 	const nextHabits = habits.filter(h => h.id != id);
	// 	setHabits(nextHabits);
	// };

	React.useEffect(() => {
		const nextTotal = habits.reduce((s, h) => s + h.done, 0);
		setTotal(nextTotal);
	}, [habits]);

	const handleDelete = id => {
		ipcRenderer.invoke('deleteHabit', id);
		const nextHabits = habits.filter(h => h.id != id);
		setHabits(nextHabits);
	};

	return (
		<Container>
			<Top>
				<BannerContainer>
					{!completedMP1Survey && total >= { mp1SurveyThreshold } ? (
						<SurveyBanner />
					) : (
						banner && <Banner banner={banner} />
					)}
				</BannerContainer>
				<MenuButton>
					<IoMenu style={{ display: 'block' }} />
				</MenuButton>
				<Summary>
					<div style={{ fontSize: '12px' }}>Today:</div>
					<div style={{ fontWeight: '700', fontSize: '20px' }}>
						{total}
					</div>
					<div>Completed</div>
				</Summary>
				<Character>
					<img style={{ width: 240, height: 240 }} src={stand} />
				</Character>
			</Top>
			<Bottom className="scroll-view">
				<SectionHeader>
					<span style={{ marginLeft: 10 }}>Today's Habits</span>
					<HeaderButtons>
						<CircleButton
							backgroundColor={isEditing ? '#d4d4d4' : 'white'}
							style={{ marginRight: '5px' }}
							onClick={() => setIsEditing(!isEditing)}
						>
							<ImPencil
								color="black"
								style={{ display: 'block' }}
							/>
						</CircleButton>
						<Link to={'/reminderform'}>
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
				{/* <Reminder addReminder={true} /> */}
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
	height: 220px;
	justify-content: flex-end;
	background-color: white;
`;

const BannerContainer = styled.div`
	position: absolute;
	top: 25px;
	width: 100%;
	display: flex;
	justify-content: center;
`;

const Bottom = styled.div`
	flex: 4;
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
`;

const Summary = styled.div`
	position: absolute;
	left: 0;
	top: 60px;
	display: flex;
	flex-direction: column;
	background-color: #fcaf4e;
	border-radius: 0 10px 10px 0;
	padding-right: 20px;
	padding-left: 10px;
	padding-top: 20px;
	padding-bottom: 20px;
`;

const MenuButton = styled.button`
	position: absolute;
	right: 0;
	top: 0;
	margin: 20px;

	background-color: #eeeeee;
	padding: 5px;
	border-radius: 20px;

	border: none;
	filter: brightness(100%);

	:hover {
		filter: brightness(85%);
	}

	:focus {
		outline: 0;
	}
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

const CircleButton = styled.div`
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

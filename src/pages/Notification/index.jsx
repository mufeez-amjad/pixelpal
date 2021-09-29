import React, { useState } from 'react';
import styled from 'styled-components';
const { ipcRenderer } = window.require('electron');

import { IoCheckmarkSharp, IoTimerOutline } from 'react-icons/io5';
import wave from './wave_crop.gif';
import popup from './pop_up_crop.gif';
import celebrateImg from './celebrate_noloop.gif';

import { StyledButton, ButtonGroup } from './styles';

function Notification() {
	const [body, setBody] = useState();
	const [popUp, setPopUp] = useState(true);
	const [celebrate, setCelebrate] = useState(false);

	ipcRenderer.on('notification', (event, habit) => {
		console.log('hello');
		setBody(habit.name);
		setPopUp(true);
		setTimeout(() => {
			setPopUp(false);
			console.log('wave');
		}, 1000);
	});

	const respond = action => {
		if (action == 'done') {
			setCelebrate(true);
			setTimeout(() => {
				setCelebrate(false);
				ipcRenderer.invoke('notification', action);
			}, 1000);
		} else {
			ipcRenderer.invoke('notification', action);
		}
	};

	return (
		<Container>
			{!celebrate && (
				<Content>
					<SpeechBubble>Hey, it's time to {body}!</SpeechBubble>
					<ButtonGroup>
						<StyledButton
							color="#4BB543"
							style={{
								flex: 4,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center'
							}}
							onClick={() => respond('done')}
						>
							<IoCheckmarkSharp />
							<span style={{ marginLeft: 5 }}>Done</span>
						</StyledButton>
						<StyledButton
							color="#808080"
							fontColor="white"
							style={{
								flex: 3,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								padding: 5
							}}
							onClick={() => respond('dismiss')}
						>
							<IoTimerOutline />
							<span style={{ marginLeft: 5 }}>Dismiss</span>
						</StyledButton>
					</ButtonGroup>
				</Content>
			)}
			{popUp ? (
				<Character style={{ width: 70, height: 90 }} src={popup} />
			) : celebrate ? (
				<Character
					style={{ width: 120, height: 120 }}
					src={celebrateImg}
				/>
			) : (
				<Character style={{ width: 70, height: 90 }} src={wave} />
			)}
		</Container>
	);
}

const Content = styled.div`
	display: none;
	flex-direction: column;
	padding: 5px;
	width: 200px;
`;

const Container = styled.div`
	display: flex;
	justify-content: flex-end;
	overflow: hidden;
	align-items: flex-start;
	height: fit-content;

	user-select: none; // needed for "native" feel

	:hover div {
		display: flex;
	}

	* {
		font-family: Arial, Helvetica, sans-serif;
	}
`;

const SpeechBubble = styled.div`
	color: black;
	/* font-family: Arial, Helvetica, sans-serif; */
	font-size: 11pt;
	background-color: white;
	padding: 10px 20px;
	border: 4px solid black;

	position: relative;
	border-radius: 0.4em;

	// generated with: https://projects.verou.me/bubbly/
	:after {
		content: '';
		position: absolute;
		right: 0;
		bottom: 10%;
		width: 0;
		height: 0;
		border: 15px solid transparent;
		border-left-color: black;
		border-right: 0;
		border-top: 0;
		margin-bottom: 0px;
		margin-right: -15px;
	}
`;

const Character = styled.img`
	pointer-events: none; // needed for "native" feel
`;

export default Notification;

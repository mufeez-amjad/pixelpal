import React from 'react';
import styled from 'styled-components';
const { ipcRenderer } = window.require('electron');

import { IoCheckmarkSharp, IoTimerOutline } from 'react-icons/io5';
import wavingGif from './waving.gif';

import { StyledButton, ButtonGroup } from './styles';

function Notification() {
	return (
		<Container>
			<Content>
				<SpeechBubble>
					Hey Mufeez, it's time to drink some water!
				</SpeechBubble>
				<ButtonGroup>
					<StyledButton
						color="#4BB543"
						style={{
							flex: 4,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center'
						}}
						onClick={() =>
							ipcRenderer.sendSync('close-window', 'notification')
						}
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
							justifyContent: 'center'
						}}
					>
						<IoTimerOutline />
						<span style={{ marginLeft: 5 }}>Snooze</span>
					</StyledButton>
				</ButtonGroup>
			</Content>
			<Character style={{ width: 90, height: 80 }} src={wavingGif} />
		</Container>
	);
}

const Content = styled.div`
	display: none;
	flex-direction: column;
	padding: 5px;
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

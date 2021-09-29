import React from 'react';
import styled from 'styled-components';

import { IoCloseCircleOutline } from 'react-icons/io5';
import { useHistory } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

function Survey() {
	const history = useHistory();
	const mp1UserSurvey = 'mp1_user_survey';

	React.useEffect(async () => {
		await ipcRenderer.invoke('completeSurvey', mp1UserSurvey);
	}, []);

	return (
		<div style={{ paddingBottom: 10 }}>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					marginBottom: '0px'
				}}
			>
				<CircleButton
					style={{ marginRight: '10px' }}
					onClick={() => history.push('/')}
				>
					<IoCloseCircleOutline
						color="black"
						style={{ display: 'block' }}
						fontSize={18}
					/>
				</CircleButton>
				<div
					style={{
						fontSize: '20px',
						fontWeight: '800',
						marginTop: '10px',
						marginBottom: '10px'
					}}
				>
					Survey
				</div>
			</div>
			<iframe
				src="https://docs.google.com/forms/d/e/1FAIpQLSdRTxRWcCemDf003A604_APERNjOJU7ThzOMipsviwe3NXgDw/viewform?embedded=true"
				width="100%"
				height="100%"
			>
				Loading…
			</iframe>
		</div>
	);
}

export default Survey;

const CircleButton = styled.div`
	background-color: ${({ backgroundColor }) =>
		backgroundColor ? backgroundColor : 'white'};
	border-radius: 20px;
	padding: 10px;
	height: fit-content;
	width: fit-content;
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

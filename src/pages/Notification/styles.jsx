import styled from 'styled-components';

export const StyledButton = styled.button`
	background-color: ${({ color }) => color};
	color: white;
	font-size: 14px;
	padding: 5px 2px;
	width: 64px;
	text-align: center;

	border: none;
	border-radius: 5px;
	filter: brightness(100%);

	:hover {
		filter: brightness(85%);
	}

	:focus {
		outline: 0;
	}
`;

export const ButtonGroup = styled.div`
	display: flex;
	justify-content: space-evenly;
	margin: 5px;
`;

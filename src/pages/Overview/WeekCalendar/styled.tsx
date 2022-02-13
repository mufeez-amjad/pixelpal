import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	/* padding: 10px;
	padding-top: 20px; */
`;

export const Month = styled.div`
	width: fit-content;
	padding: 5px;
	font-size: 16px;

	> span {
		&:first-child {
			font-weight: 700;
		}

		&:last-child {
			color: #fcb852;
		}
	}

	filter: brightness(100%);

	:hover {
		filter: brightness(90%);
	}
`;

export const Week = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 8px 0px;
`;

export const DaysContainer = styled.div`
	display: flex;
	justify-content: space-between;
`;

interface ContainerProps {
	current: boolean;
	selected?: boolean;
	isWeekend?: boolean;
}

export const DayContainer = styled.div<ContainerProps>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding-top: 4px;
	
	/* ${({ current }) => !current && `
		color: #ccc;
  	`} */

	> span {
		font-size: 10px;

		/* ${({ isWeekend }) => isWeekend && `
			color: #b4b4b4;
  		`} */
	}	
`;

export const DateContainer = styled.div<ContainerProps>`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 2px 4px;
	width: 32px;
	height: 32px;
	border-radius: 24px;

	${({ current }) => !current && `
		color: #ccc;
  	`}

	${({ selected }) => selected && `
		color: white;
		background: #FCB852;
  	`}
`;
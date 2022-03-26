import { styled } from '../../../theme';

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
			color: ${({theme}) => theme.color.primary};
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
	position: relative;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 2px 4px;
	width: 32px;
	height: 32px;
	border-radius: ${({theme}) => theme.all.borderRadius.round};

	${({ current }) => !current && `
		color: #ccc;
  	`}

	${({ selected, theme }) => selected && `
		color: white;
		background: ${theme.color.primary};
  	`}

	> * {
		margin-top: -2px;
	}
`;

export const DotsContainer = styled.div`
	position: absolute;
	bottom: 4px;
	display: flex;
`;

interface DotProps {
	color: string;
}
export const Dot = styled.div<DotProps>`
	height: 4px;
	width: 4px;
	margin: 0.5px;
	background-color: ${({color}) => color};
	border-radius: 50%;
	display: inline-block;
`;
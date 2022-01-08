import React from 'react';
import styled from 'styled-components';

import { FaChevronLeft } from 'react-icons/fa';
import { useHistory } from 'react-router';

interface PageContainerProps {
	children?: React.ReactNode
	style?: React.CSSProperties
}
export const PageContainer: React.FC<PageContainerProps> = ({children, style}) => {
	return (
		<Container
			style={style}
		>
			{children}
		</Container>
	);
};

interface PageTitleProps {
	text: string;
}
export const PageTitle : React.FC<PageTitleProps> = ({text}) => {
	const history = useHistory();

	return (
		<Title>
			<FaChevronLeft 
				onClick={() => history.goBack()}
			/>
			<span>
				{text}
			</span>
		</Title>
	);
};

const Container = styled.div`
	background-color: #eeeeee;
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
`;

const Title = styled.div`
	span {
		font-size: 16px;
		font-weight: 600;
		margin-left: 8px;
	}
	
	display: flex;
	align-items: center;

	svg {
		fill: #333333;
		&:hover {
    		fill: #6d6d6d;
		}
	}
`;

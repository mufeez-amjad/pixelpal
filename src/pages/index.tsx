import React from 'react';
import styled from 'styled-components';

import { FaChevronLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router';

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
	navigateTo: string;
}
export const PageTitle : React.FC<PageTitleProps> = ({text, navigateTo}) => {
	const navigate = useNavigate();

	return (
		<Title>
			<FaChevronLeft 
				onClick={() => navigate(navigateTo)}
			/>
			<span>
				{text}
			</span>
		</Title>
	);
};

const Container = styled.div`
	background-color: #ffffff;
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
		fill: #777777;
		&:hover {
    		fill: #363636;
		}
	}
`;

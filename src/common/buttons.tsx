import React from 'react';
import { IconType } from 'react-icons/lib';
import styled, { CSSProperties } from 'styled-components';

interface ButtonProps {
	text?: string;
	onClick: () => void;
}

interface IconButtonProps extends ButtonProps {
	Icon: IconType;
}

export const IconButton = ({Icon, text, onClick}: IconButtonProps) => {
	return (
		<Container
			onClick={() => onClick()}
		>
			<Icon />
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					width: '100%',
				}}
			>
				<span
					style={{
						marginLeft: 4,
					}}
				>{text}</span>
			</div>
			
		</Container>
	);
};

interface ImageButtonProps extends ButtonProps {
	image: string;
	style: CSSProperties;
}
export const ImageButton = ({style, text, image, onClick}: ImageButtonProps) => {
	return (
		<Container
			onClick={() => onClick()}
			style={style}
		>
			<img 
				src={image}
				style={{
					width: 20,
					height: 20
				}}
			/>
			{text && (
				<span
					style={{
						marginLeft: 4,
					}}
				>{text}</span>
			)}
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 8px 12px;
	background-color: #50af50;
	border-radius: 8px;
	/* width: fit-content; */
	color: white;
	font-weight: 500;

	filter: brightness(100%);

	:hover {
		cursor: default;
		filter: brightness(95%);
	}

	:focus {
		outline: 0;
	}
`;

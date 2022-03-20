import React from 'react';
import { IconType } from 'react-icons/lib';
import { CSSProperties } from 'styled-components';
import { styled } from '../theme';

import {LoadingIndicator, LoadingSpinner} from './LoadingWrapper';

export enum ButtonType {
	CTA,
	Primary,
	Default,
	Tertiary
}

interface ButtonProps {
	text?: string;
	onClick: () => void;
	type?: ButtonType; 
	loading?: boolean;
}
export const Button = ({text, onClick, loading, type = ButtonType.Default}: ButtonProps): JSX.Element => {
	return (
		<Container
			onClick={() => onClick()}
			type={type}
		>
			{loading && <LoadingSpinner style={{
				marginRight: 10
			}}/>}
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					width: '100%',
				}}
			>
				<span>{text}</span>
			</div>
			
		</Container>
	);
};


interface IconButtonProps extends ButtonProps {
	Icon: IconType;
}
export const IconButton = ({Icon, text, onClick, type = ButtonType.Default}: IconButtonProps) => {
	return (
		<Container
			onClick={() => onClick()}
			type={type}
		>
			<Icon />
			<div
				style={{
					display: 'flex',
					justifyContent: 'center',
					width: '100%',
				}}
			>
				<span>{text}</span>
			</div>
			
		</Container>
	);
};

interface ImageButtonProps extends ButtonProps {
	image: string;
	style: CSSProperties;
}
export const ImageButton = ({style, text, image, onClick, type = ButtonType.Default}: ImageButtonProps) => {
	return (
		<Container
			onClick={() => onClick()}
			style={style}
			type={type}
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

interface ContainerProps {
	type: ButtonType
}
const Container = styled.div<ContainerProps>`
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 8px 12px;
	margin: 0 2px;
	border-radius: 8px;
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

	${({type, theme}) => type === ButtonType.CTA && `
		background-color: #50af50;
	`}

	${({type, theme}) => type === ButtonType.Primary && `
		background-color: ${theme.color.primary};
	`}

	${({type, theme}) => type === ButtonType.Default && `
		background-color: ${theme.color.lightGrey};
		// border: 1px solid ${theme.color.midGrey};
		color: ${theme.color.grey};
	`}
`;

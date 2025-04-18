import React from 'react';
import styled, { CSSProperties } from 'styled-components';

import gif from './loading.gif';

interface ILoadingProps {
	style?: CSSProperties;
}
export const LoadingIndicator: React.FC<ILoadingProps> = ({ style }): JSX.Element => {
	return (
		<LoadingContainer
			style={style}
		>
			<img
				src={gif}
			/>
		</LoadingContainer>
	);
};

const LoadingContainer = styled.div`
	width: 100%;
	height: fit-content;
	
	display: flex;

	img {
		background-color: rgba(255, 255, 255, 0.6);
		width: 100%;
		height: 100%;
	}

	justify-content: center;
	align-items: center;
`;

interface Props {
	isLoading: boolean;
}
const LoadingWrapper: React.FC<Props> = ({ isLoading, children }) => {
	return (
		<>
			{isLoading && (
				<LoadingIndicator
					style={{
						position: 'absolute',
						top: '50%',
						transform: 'translateY(-16px)',
					}}
				/>
			)}
			{children && <div>
				{children}
			</div>}
		</>
	);
};

export default LoadingWrapper;

export const LoadingSpinner: React.FC<ILoadingProps> = ({ style }): JSX.Element => {
	return (
		<Spinner
			style={style}
		>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
			<div></div>
		</Spinner>
	);
};

const Spinner = styled.div`
	color: official;
	display: inline-block;
	position: relative;
	width: 18px;
	height: 18px;

	div {
		transform-origin: 9px 9px;
		animation: lds-spinner 1.2s linear infinite;
	}
	div:after {
		content: " ";
		display: block;
		position: absolute;
		top: 0px;
		left: 7px;
		width: 2px;
		height: 5px;
		border-radius: 20%;
		background: #fff;
	}
	div:nth-child(1) {
		transform: rotate(0deg);
		animation-delay: -1.1s;
	}
	div:nth-child(2) {
		transform: rotate(30deg);
		animation-delay: -1s;
	}
	div:nth-child(3) {
		transform: rotate(60deg);
		animation-delay: -0.9s;
	}
	div:nth-child(4) {
		transform: rotate(90deg);
		animation-delay: -0.8s;
	}
	div:nth-child(5) {
		transform: rotate(120deg);
		animation-delay: -0.7s;
	}
	div:nth-child(6) {
		transform: rotate(150deg);
		animation-delay: -0.6s;
	}
	div:nth-child(7) {
		transform: rotate(180deg);
		animation-delay: -0.5s;
	}
	div:nth-child(8) {
		transform: rotate(210deg);
		animation-delay: -0.4s;
	}
	div:nth-child(9) {
		transform: rotate(240deg);
		animation-delay: -0.3s;
	}
	div:nth-child(10) {
		transform: rotate(270deg);
		animation-delay: -0.2s;
	}
	div:nth-child(11) {
		transform: rotate(300deg);
		animation-delay: -0.1s;
	}
	div:nth-child(12) {
		transform: rotate(330deg);
		animation-delay: 0s;
	}
	@keyframes lds-spinner {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}
`;
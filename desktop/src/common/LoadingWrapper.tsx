import React from 'react';
import styled, { CSSProperties } from 'styled-components';

import gif from './loading.gif';

interface ILoadingProps {
	style: CSSProperties;
}
export const LoadingIndicator: React.FC<ILoadingProps> = ({style}): JSX.Element => {
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
	z-index: 2;
	
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
const LoadingWrapper: React.FC<Props> = ({isLoading, children}) => {
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

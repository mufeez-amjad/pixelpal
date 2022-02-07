import React from 'react';
import styled from 'styled-components';

interface TitleProps {
	text: string;
}
export const Title = ({text}: TitleProps) => {
	return (
		<TitleContainer>
			{text}
		</TitleContainer>
	);
};

const TitleContainer = styled.div`
	
`;
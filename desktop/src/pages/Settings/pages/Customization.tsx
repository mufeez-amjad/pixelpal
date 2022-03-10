import React from 'react';
import styled, { useTheme } from 'styled-components';
import { COLORS, Theme } from '../../../theme';

import { FiCheck } from 'react-icons/fi';


interface Props {
	setTheme: (theme: Theme) => void; // React.Dispatch<React.SetStateAction<Theme>>;
}
export default function Customization({setTheme}: Props): JSX.Element {
	const theme = useTheme() as Theme;

	const selectTheme = (theme: Theme) => {
		setTheme(theme);
	};

	return (
		<Container>
			<span>Accent Color</span>
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap'
				}}
			>
				{Object.entries(COLORS).map(((value, i) => {
					const [color, hex] = value;

					const selected = theme.color.primary === hex;
					return (
						<Color
							selected={selected}
							hex={hex}
							key={i}
							onClick={() => selectTheme({
								...theme,
								color: {
									...theme.color,
									primary: hex,
								}
							})}
						>
							{selected && <FiCheck color={'white'} size={14} />}
						</Color>
					);
				}))}
			</div>

		</Container>
	);
}

const Container = styled.div`
	padding: 0 10px;
	height: 100%;
	width: 100%;
	display: flex;
	flex-direction: column;
`;

interface ColorProps {
	selected: boolean;
	hex: string;
}
const Color = styled.div<ColorProps>`
	display: flex;
	width: 42px;
	height: 32px;
	padding: 4px;
	margin: 4px;
	background-color: ${({hex}) => hex};
	border-radius: ${({theme}) => theme.all.borderRadius.standard};

	justify-content: center;
	align-items: center;

	${({selected}) => selected && `
		border: 1px solid #359df1;
	`}
`;
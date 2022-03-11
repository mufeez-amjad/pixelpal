import baseStyled, { ThemedStyledInterface } from 'styled-components';

export const COLORS = {
	cyan: '#64DAFF',
	orange: '#fcb852',
	pink: '#ffafc5',
	granite: '#6D6466',
	aquamarine: '#61e294'
};

export const lightTheme = {
	all: {
		borderRadius: {
			standard: '0.20rem',
			round: '50%'
		}
	},
	color: {
		primary: COLORS.orange,
		lighterGrey: '#e0dede',
		lightGrey: '#cdcdcd',
		midGrey: '#b9b9b9',
		grey: '#808080',
	}
};

// export const lightTheme = {
// 	all: {
// 		borderRadius: '0.5rem',
// 	},
// 	main: {
// 		color: '#FAFAFA',
// 		textColor: '#212121',
// 		bodyColor: '#FFF',
// 	},
// 	secondary: {
// 		color: '#757575',
// 	},
// };

// // Force both themes to be consistent!
// export const darkTheme: Theme = {
// 	// Make properties the same on both!
// 	all: { ...lightTheme.all },
// 	main: {
// 		color: '#212121',
// 		textColor: '#FAFAFA',
// 		bodyColor: '#424242',
// 	},
// 	secondary: {
// 		color: '#616161',
// 	},
// };

export type Theme = typeof lightTheme;
export const styled = baseStyled as ThemedStyledInterface<Theme>;

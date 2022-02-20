import React from 'react';
import styled, { CSSProperties } from 'styled-components';

interface TextInputProps {
	value: string;
	placeholder: string;
	disableBlurOnEnter?: boolean;
	style?: CSSProperties;
	onChange: React.ChangeEventHandler<HTMLInputElement>
}

export const TextInput = ({value, placeholder, disableBlurOnEnter, style, onChange}: TextInputProps) => {
	function handleKeyUp(event: any) {
		//key code for enter
		if (event.keyCode === 13 && event.target) {
			event.preventDefault();
			event.target.blur();
		}
	}

	return (
		<>
			<Input
				value={value}
				placeholder={placeholder}
				onKeyUp={handleKeyUp}
				style={style}
				onChange={onChange}
			/>
		</>
	);
};

const Input = styled.input`
	border: none;
	font-size: 16px;
	background: none;
	color: #797979;

	margin-right: 20px;
	box-shadow: -8px 16px 0px -9px #ebebeb, 8px 16px 0px -9px #ebebeb;
	-webkit-transition: box-shadow 0.3s;
	transition: box-shadow 0.3s;

	&::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
		opacity: 0.65;
	}

	&:focus {
		outline: none;
		box-shadow: -8px 16px 0px -9px #FCB852, 8px 16px 0px -9px #FCB852;
	}
`;
import React from 'react';
import styled, { CSSProperties } from 'styled-components';

import { BiErrorCircle } from 'react-icons/bi';
import { IconType } from 'react-icons/lib';
interface TextInputProps {
	value: string;
	placeholder: string;
	disableBlurOnEnter?: boolean;
	style?: CSSProperties;
	onChange: React.ChangeEventHandler<HTMLInputElement>;
	error?: string | null;
	Icon?: IconType;
	iconStyle?: React.CSSProperties;
	flex?: number;
}

export const TextInput = ({
	value,
	placeholder,
	disableBlurOnEnter,
	style,
	onChange,
	error,
	Icon, iconStyle,
	flex
}: TextInputProps): JSX.Element => {
	function handleKeyUp(event: any) {
		//key code for enter
		if (event.keyCode === 13 && event.target) {
			event.preventDefault();
			event.target.blur();
		}
	}

	return (
		<Container
			style={style}
		>
			<InputContainer>
				{Icon && <Icon style={{marginRight: 4, ...iconStyle}} />}	
				<Input
					value={value}
					placeholder={placeholder}
					onKeyUp={handleKeyUp}
					onChange={onChange}
				/>
			</InputContainer>
			{error && <ErrorContainer>
				<BiErrorCircle size={12} />
				<span>{error}</span>
			</ErrorContainer>}
		</Container>
	);
};

const Container = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
`;

const InputContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;

	padding: 4px 4px;
	border-radius: 4px;

	border: 0.5px solid transparent;

	&:hover {
		border: 0.5px solid grey;
	}
`;

const Input = styled.input`
	border: none;
	font-size: 14px;
	width: 100%;
	background: none;
	color: black;

	&::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
		opacity: 0.65;
	}

	&:focus {
		outline: none;
	}
`;

const ErrorContainer = styled.div`
	position: absolute;
	top: 28px;

	display: flex;
	align-items: center;

	color: #e96c6c;

	span {
		font-size: 12px;
		margin-left: 4px;
	}
`;

interface TextAreaProps {
	value: string;
	placeholder: string;
	disableBlurOnEnter?: boolean;
	style?: CSSProperties;
	onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
	error?: string | null;
	Icon?: IconType;
	iconStyle?: React.CSSProperties;
	flex?: number;
}

export const TextArea = ({
	value,
	placeholder,
	disableBlurOnEnter,
	style,
	onChange,
	error,
	Icon, iconStyle,
	flex
}: TextAreaProps): JSX.Element => {
	function handleKeyUp(event: any) {
		//key code for enter
		if (event.keyCode === 13 && event.target) {
			event.preventDefault();
			event.target.blur();
		}
	}

	return (
		<Container
			style={style}
		>
			<InputContainer>
				{Icon && <Icon style={{marginRight: 4, ...iconStyle}} />}	
				<AreaInput
					value={value}
					placeholder={placeholder}
					onKeyUp={handleKeyUp}
					onChange={onChange}
				/>
			</InputContainer>
			{error && <ErrorContainer>
				<BiErrorCircle size={12} />
				<span>{error}</span>
			</ErrorContainer>}
		</Container>
	);
};


const AreaInput = styled.textarea`
	border: none;
	font-size: 14px;
	width: 100%;
	background: none;
	color: black;

	&::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
		opacity: 0.65;
	}

	&:focus {
		outline: none;
	}
`;

export const Dropdown = () => {
	return (
		<div>
			hi
		</div>
	);
};

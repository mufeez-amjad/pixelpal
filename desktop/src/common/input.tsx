import React, { ChangeEvent } from 'react';
import { CSSProperties } from 'styled-components';
import { styled } from '../theme';

import { BiErrorCircle } from 'react-icons/bi';
import { IconType } from 'react-icons/lib';
import { FiCheck } from 'react-icons/fi';

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
	onClick?: React.MouseEventHandler<HTMLInputElement>;
	focused?: boolean;
}

export const TextInput = ({
	value,
	placeholder,
	disableBlurOnEnter,
	style,
	onChange,
	error,
	Icon, iconStyle,
	flex,
	onClick,
	focused
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
			<InputContainer
				focused={focused}
			>
				{Icon && <Icon style={{marginRight: 4, ...iconStyle}} />}	
				<Input
					value={value}
					placeholder={placeholder}
					onKeyUp={handleKeyUp}
					onChange={onChange}
					onClick={onClick}
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

interface InputContainerProps {
	focused?: boolean;
}
const InputContainer = styled.div<InputContainerProps>`
	display: flex;
	flex-direction: row;
	align-items: center;

	height: 28px;

	padding: 4px 4px;
	border-radius: 4px;

	border: 0.5px solid transparent;

	&:hover {
		border: 0.5px solid grey;
	}

	${({focused, theme}) => focused && `
		background-color: ${theme.color.lightGrey};
	`}
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

interface Option {
	value: string,
	data: any;
}
export interface DropdownOptions {
	subheading?: string;
	items: Option[];
}
interface DropdownProps {
	options: DropdownOptions[];
	onSelectValue?: () => void;
	Icon?: IconType;
	valueField: string;
	dividerField?: string;
}
export const Dropdown = ({options, Icon, valueField}: DropdownProps): JSX.Element => {
	const [value, setValue] = React.useState('');
	const [isDropped, setIsDropped] = React.useState(false);

	return (
		<Container
			style={{
				flexGrow: 1,
			}}
		>
			<TextInput
				value={value} 
				placeholder={value}
				onChange={(e) => setValue(e.target.value)}
				Icon={Icon}
				onClick={() => setIsDropped(!isDropped)}
				focused={isDropped}
			/>
			{isDropped && <DropdownContainer>
				{options.map((os) => {
					return (
						<>
							{os.subheading && <Subheading>{os.subheading}</Subheading>}
							<div>
								{os.items.map((option, index) => (
									<Option
										key={index}
										onClick={() => setValue(option.value)}
									>
										<div
											style={{
												display: 'flex',
												justifyContent: 'center',
												width: 12,
												height: 12,
											}}
										>
											{value === option.value && <FiCheck
												color='black'
												size={12}
											/>}
										</div>
										<span
											style={{
												marginLeft: 4
											}}
										>{option.value}</span>
									</Option>								
								))}
							</div>
						</>
						
					);
				})}
			</DropdownContainer>}
		</Container>
	);
};

const DropdownContainer = styled.div`
	position: absolute;
	top: 28px;
	z-index: 3;
	width: 100%;
	max-height: 128px;
	overflow-y: scroll;
	padding: 8px 12px;
	background-color: ${({theme}) => theme.color.lighterGrey};
	border-radius: 0 0 ${({theme}) => theme.all.borderRadius.standard} ${({theme}) => theme.all.borderRadius.standard};

	* {
		overflow-x: hidden;
		text-overflow: ellipsis;
	}

	&::-webkit-scrollbar {
      width: 7px;
    }
	
    &::-webkit-scrollbar-thumb {
      background-color: rgba(0,0,0,0.4);
      border-radius: 10rem;
      /* border: 1px solid #fff; */
    }

    &::-webkit-scrollbar-track-piece {
		&:start, :end {
			background: none;
		}
	}
`;

const Subheading = styled.div`
	font-size: 10px;
	color: ${({theme}) => theme.color.grey};
`;

const Option = styled.div`
	display: flex;
	flex-direction: row;
	font-size: 12px;
	align-items: center;
	padding: 8px 4px;
	color: black;
	border-radius: ${({theme}) => theme.all.borderRadius.standard};

	&:first-child {
		margin-top: 2px;
	}
	&:last-child {
		margin-bottom: 2px;
	}
	/* background-color: red; */
	&:hover {
		background-color: ${({theme}) => theme.color.midGrey};
	}
`;
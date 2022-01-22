import React from 'react';
import { IconType } from 'react-icons/lib';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface GroupProps {
	title: string;
	Icon: IconType;
}
export const SettingsGroup: React.FC<GroupProps> = ({title, Icon, children}) => {
	return (
		<Group>
			<Header>
				<Icon size={12}/>
				<Title>
					{title}
				</Title>
			</Header>
			
			<Items>
				{children}
			</Items>
		</Group>
	);
};

const Group = styled.div`
	display: flex;
	flex-direction: column;
	padding-right: 10px;

	:not(:first-child) { 
		margin-top: 20px;
	}
`;

const Header = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;

	color: #9e9e9e;
`;

const Title = styled.div`
	margin-left: 10px;
	font-size: 13px;
	font-weight: 400;
`;

const Items = styled.div`
	display: flex;
	flex-direction: column;
`;

interface ItemProps {
	text: string;
	href: string;
	selected?: boolean;
}
export const SettingItem = ({text, href, selected}: ItemProps): JSX.Element => {
	return (
		<Item
			to={href}
			selected={selected}
		>
			{text}
		</Item>
	);
};

interface StyledItemProps {
	selected?: boolean;
}
const Item = styled(Link)<StyledItemProps>`
	all: unset;

	&:hover {
		text-decoration: none;
		color: black;
		background: #d4d4d4;
		cursor: default;
	}

	font-size: 13px;

	margin-left: 14px;
	margin-top: 6px;
	padding: 2px 8px;
	border-radius: 2px;
	
	${({ selected }) => selected && `
		color: black;
		background: #d4d4d4;
  	`}
`;
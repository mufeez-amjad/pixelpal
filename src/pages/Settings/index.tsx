import React from 'react';
import styled from 'styled-components';

import { PageContainer, PageTitle } from '..';
import { SettingItem, SettingsGroup } from './SettingsGroup';
import { IoCalendarClearSharp, IoExtensionPuzzle } from 'react-icons/io5';
import { Route, Routes, useLocation } from 'react-router-dom';

import General from './pages/General';
import Calendar from './pages/Calendar';

const paths = [
	{
		title: 'Calendar',
		icon: IoCalendarClearSharp,
		items: [
			{
				text: 'General',
				href: '/settings/'
			},
			{
				text: 'Customization',
				href: '/settings/customization'
			},
			{
				text: 'Notifications',
				href: '/settings/notifications'
			}
		]
	}, 
	{
		title: 'Integrations',
		icon: IoExtensionPuzzle,
		items: [
			{
				text: 'Calendars',
				href: '/settings/calendars'
			},
			{
				text: 'NFT',
				href: '/settings/nft'
			},
			{
				text: 'Conferencing',
				href: '/settings/conferencing'
			}
		]
	}
];

function Settings(): JSX.Element {
	const location = useLocation();

	return (
		<PageContainer
			style={{
				padding: 16
			}}
		>
			<PageTitle 
				text='Settings'
				navigateTo='/'
			/>
			<SplitContainer
				style={{
					marginTop: 32
				}}
			>
				<Split
					flex={2}
				>
					{paths.map((group, i) => {
						return (
							<SettingsGroup
								key={i}
								title={group.title}
								Icon={group.icon}
							>
								{group.items.map((path, i) => {
									return (
										<SettingItem
											selected={path.href == location.pathname}
											key={i}
											text={path.text} 
											href={path.href}											
										/>
									);
								})}
							</SettingsGroup>
						);
					})}	
				</Split>
				<Split
					flex={4}
				>
					<Routes>
						<Route path="/" element={<General />} />	
						<Route path="/customization"  element={<>Notifications</>} />
						<Route path="/notifications"  element={<>Notifications</>} />
						<Route path="/calendars"  element={<Calendar />} />
						<Route path="/nft"  element={<>NFT</>} />
						<Route path="/conferencing"  element={<>Conferencing</>} />
					</Routes>
				</Split>
			</SplitContainer>
		</PageContainer>
	);
}

export default Settings;

interface SplitProps {
	flex: number;
}

const SplitContainer = styled.div`
	display: flex;
	flex-direction: row;
	height: 100%;
	width: 100%;

	
`;
const Split = styled.div<SplitProps>`
	flex: ${({flex}) => flex};

	height: 100%;

	:not(:last-child) { 
		border-right: solid 1px #eeeeee;
	}
`;

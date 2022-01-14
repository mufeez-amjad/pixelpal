import React from 'react';
import styled from 'styled-components';

import { PageContainer, PageTitle } from '..';
import { SettingItem, SettingsGroup } from './SettingsGroup';
import { IoCalendarClearSharp, IoExtensionPuzzle } from 'react-icons/io5';
import { Route, Routes } from 'react-router-dom';

import General from './pages/General';
import Calendar from './pages/Calendar';

function Settings(): JSX.Element {
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
					<SettingsGroup 
						title='Calendar'
						Icon={IoCalendarClearSharp}
					>
						<SettingItem 
							text='General'
							href='/settings/'
						/>
						<SettingItem 
							text='Customization'
							href='/settings/customization'
						/>
						<SettingItem 
							text='Notifications'
							href='/settings/notifications'
						/>
					</SettingsGroup>

					<SettingsGroup 
						title='Integrations'
						Icon={IoExtensionPuzzle}
					>
						<SettingItem 
							text='Calendars'
							href='/settings/calendars'
						/>
						<SettingItem 
							text='NFT'
							href='/settings/nft'
						/>
						<SettingItem 
							text='Conferencing'
							href='/settings/conferencing'
						/>
					</SettingsGroup>
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

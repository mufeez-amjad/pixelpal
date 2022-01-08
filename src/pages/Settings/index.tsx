import React from 'react';
import styled from 'styled-components';

import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { PageContainer, PageTitle } from '..';
import { SettingItem, SettingsGroup } from './SettingsGroup';
import { IoCalendarClearSharp } from 'react-icons/io5';
import { Route, Switch } from 'react-router-dom';

function Settings(): JSX.Element {
	return (
		<PageContainer
			style={{
				padding: 16
			}}
		>
			
			<PageTitle text='Settings'/>
			<SplitContainer
				style={{
					marginTop: 20
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
							href='/settings'
						/>
						<SettingItem 
							text='Notifications'
							href='/settings/notifications'
						/>
					</SettingsGroup>

					<SettingsGroup 
						title='Integrations'
						Icon={IoCalendarClearSharp}
					>
						<SettingItem 
							text='Calendar'
							href='/settings/general'
						/>
						<SettingItem 
							text='Conferencing'
							href='/settings/general'
						/>
					</SettingsGroup>
				</Split>
				<Split
					flex={4}
				>
					<Switch>
						<Route exact path="/settings" component={() => <>hi!</>} />
						<Route exact path="/settings/notifications" component={() => <>hi!</>} />
					</Switch>
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
		border-right: solid 1px #dddddd;
	}
`;
